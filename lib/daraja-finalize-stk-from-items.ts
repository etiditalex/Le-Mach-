import {
  getBookingById,
  getBookingByMpesaCheckout,
  markBookingPaidWithNotify,
  setBookingFailed,
} from "@/lib/repositories/bookings";
import {
  getFoodOrderById,
  getFoodOrderByMpesaCheckout,
  markFoodOrderPaidWithNotify,
  setFoodOrderFailed,
} from "@/lib/repositories/food-orders";

export type DarajaFinalizeInput = {
  checkoutRequestId: string;
  merchantRequestId?: string;
  resultCode: number;
  resultDesc?: string;
  amount?: number;
  receipt?: string;
  phone?: string;
  source: "callback" | "query";
};

export type DarajaFinalizeResult =
  | { ok: true; matched: false }
  | {
      ok: true;
      matched: true;
      target: "food" | "booking";
      targetId: string;
      status: "paid" | "failed" | "already_paid";
      reason?: string;
    };

function amountMatches(expected: number, paid?: number): boolean {
  if (paid === undefined) return false;
  return Math.round(paid) === expected;
}

export async function finalizeDarajaStkFromItems(input: DarajaFinalizeInput): Promise<DarajaFinalizeResult> {
  const order = await getFoodOrderByMpesaCheckout(input.checkoutRequestId);
  if (order) {
    const latest = (await getFoodOrderById(order.id)) ?? order;
    if (latest.status === "paid") {
      return { ok: true, matched: true, target: "food", targetId: latest.id, status: "already_paid" };
    }
    if (input.resultCode !== 0) {
      const reason = input.resultDesc || "M-Pesa cancelled or failed";
      await setFoodOrderFailed(latest.id, reason);
      return { ok: true, matched: true, target: "food", targetId: latest.id, status: "failed", reason };
    }

    if (input.source === "callback") {
      if (input.amount === undefined || !input.receipt) {
        const reason = "Incomplete M-Pesa callback metadata";
        await setFoodOrderFailed(latest.id, reason);
        return { ok: true, matched: true, target: "food", targetId: latest.id, status: "failed", reason };
      }
      if (!amountMatches(latest.totalKes, input.amount)) {
        const reason = `M-Pesa amount mismatch (expected ${latest.totalKes})`;
        await setFoodOrderFailed(latest.id, reason);
        return { ok: true, matched: true, target: "food", targetId: latest.id, status: "failed", reason };
      }
    }

    await markFoodOrderPaidWithNotify(latest, {
      paymentProvider: "mpesa",
      mpesa: {
        ...latest.mpesa,
        checkoutRequestId: input.checkoutRequestId,
        merchantRequestId: input.merchantRequestId || latest.mpesa?.merchantRequestId,
        receiptNumber: input.receipt || latest.mpesa?.receiptNumber,
        phone: input.phone || latest.mpesa?.phone,
      },
    });
    return { ok: true, matched: true, target: "food", targetId: latest.id, status: "paid" };
  }

  const booking = await getBookingByMpesaCheckout(input.checkoutRequestId);
  if (!booking) return { ok: true, matched: false };
  const latest = (await getBookingById(booking.id)) ?? booking;
  if (latest.status === "paid") {
    return { ok: true, matched: true, target: "booking", targetId: latest.id, status: "already_paid" };
  }
  if (input.resultCode !== 0) {
    const reason = input.resultDesc || "M-Pesa cancelled or failed";
    await setBookingFailed(latest.id, reason);
    return { ok: true, matched: true, target: "booking", targetId: latest.id, status: "failed", reason };
  }

  if (input.source === "callback") {
    if (input.amount === undefined || !input.receipt) {
      const reason = "Incomplete M-Pesa callback metadata";
      await setBookingFailed(latest.id, reason);
      return { ok: true, matched: true, target: "booking", targetId: latest.id, status: "failed", reason };
    }
    if (!amountMatches(latest.totalKes, input.amount)) {
      const reason = `M-Pesa amount mismatch (expected ${latest.totalKes})`;
      await setBookingFailed(latest.id, reason);
      return { ok: true, matched: true, target: "booking", targetId: latest.id, status: "failed", reason };
    }
  }

  await markBookingPaidWithNotify(latest, {
    paymentProvider: "mpesa",
    mpesa: {
      ...latest.mpesa,
      checkoutRequestId: input.checkoutRequestId,
      merchantRequestId: input.merchantRequestId || latest.mpesa?.merchantRequestId,
      receiptNumber: input.receipt || latest.mpesa?.receiptNumber,
      phone: input.phone || latest.mpesa?.phone,
    },
  });
  return { ok: true, matched: true, target: "booking", targetId: latest.id, status: "paid" };
}
