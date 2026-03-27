import { paystackVerify } from "@/lib/paystack";
import { getBookingById, markBookingPaidWithNotify } from "@/lib/repositories/bookings";
import { getFoodOrderById, markFoodOrderPaidWithNotify } from "@/lib/repositories/food-orders";

function metaEntity(meta: Record<string, string> | undefined): { target: "food" | "booking"; entityId: string } | null {
  if (!meta) return null;
  const target = (meta.target || meta.Target) as string | undefined;
  const entityId = (meta.entityId || meta.entity_id || meta.EntityId) as string | undefined;
  if (target !== "food" && target !== "booking") return null;
  if (!entityId) return null;
  return { target, entityId };
}

export type FulfillResult =
  | { ok: true; target: "food" | "booking"; entityId: string }
  | { ok: false; error: string };

/** Idempotent: marks paid once; validates amount for KES when available. */
export async function fulfillPaystackReference(reference: string): Promise<FulfillResult> {
  const v = await paystackVerify(reference);
  if (!v.ok) return { ok: false, error: v.error };
  if (!v.paid) return { ok: false, error: "Payment not successful yet" };

  const ent = metaEntity(v.metadata);
  if (!ent) return { ok: false, error: "Missing Paystack metadata" };

  try {
    if (ent.target === "food") {
      const order = await getFoodOrderById(ent.entityId);
      if (!order) throw new Error("Order not found");
      if (order.status === "paid") return { ok: true, target: "food", entityId: ent.entityId };
      if (v.amountKes !== undefined && v.amountKes !== order.totalKes) {
        throw new Error("Amount mismatch");
      }
      if (order.paystack?.reference && order.paystack.reference !== reference) {
        throw new Error("Reference mismatch");
      }
      await markFoodOrderPaidWithNotify(order, {
        paymentProvider: "paystack",
        paystack: { ...order.paystack, reference },
      });
      return { ok: true, target: "food", entityId: ent.entityId };
    }

    const booking = await getBookingById(ent.entityId);
    if (!booking) throw new Error("Booking not found");
    if (booking.status === "paid") return { ok: true, target: "booking", entityId: ent.entityId };
    if (v.amountKes !== undefined && v.amountKes !== booking.totalKes) {
      throw new Error("Amount mismatch");
    }
    if (booking.paystack?.reference && booking.paystack.reference !== reference) {
      throw new Error("Reference mismatch");
    }
    await markBookingPaidWithNotify(booking, {
      paymentProvider: "paystack",
      paystack: { ...booking.paystack, reference },
    });
    return { ok: true, target: "booking", entityId: ent.entityId };
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Fulfillment failed";
    return { ok: false, error: msg };
  }
}
