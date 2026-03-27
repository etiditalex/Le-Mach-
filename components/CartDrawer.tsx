"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Minus, Trash2 } from "lucide-react";
import { useCart } from "@/context/CartContext";
import Image from "next/image";
import { useState } from "react";
import PaymentPanel from "@/components/PaymentPanel";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { cart, updateQuantity, removeFromCart, totalPrice, clearCart } = useCart();
  const [step, setStep] = useState<"cart" | "details" | "pay">("cart");
  const [roomNumber, setRoomNumber] = useState("");
  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [guestPhone, setGuestPhone] = useState("");
  const [orderId, setOrderId] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [formErr, setFormErr] = useState<string | null>(null);

  const resetFlow = () => {
    setStep("cart");
    setOrderId(null);
    setFormErr(null);
  };

  const handleClose = () => {
    resetFlow();
    onClose();
  };

  const createOrder = async () => {
    setFormErr(null);
    if (!roomNumber.trim() || !guestName.trim() || !guestEmail.trim() || !guestPhone.trim()) {
      setFormErr("Please fill in room number and guest details.");
      return;
    }
    setCreating(true);
    try {
      const res = await fetch("/api/orders/food", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: cart.map((c) => ({ id: c.id, quantity: c.quantity })),
          roomNumber: roomNumber.trim(),
          guestName: guestName.trim(),
          guestEmail: guestEmail.trim(),
          guestPhone: guestPhone.trim(),
        }),
      });
      const data = (await res.json()) as { orderId?: string; error?: string };
      if (!res.ok || !data.orderId) throw new Error(data.error || "Could not create order");
      setOrderId(data.orderId);
      setStep("pay");
    } catch (e) {
      setFormErr(e instanceof Error ? e.message : "Order failed");
    } finally {
      setCreating(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/50 z-50"
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-xl z-50 overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-sans font-bold text-primary">
                  {step === "cart"
                    ? "Shopping Cart"
                    : step === "details"
                      ? "Room service details"
                      : "Payment"}
                </h2>
                <button onClick={handleClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>

              {step === "cart" && cart.length > 0 && (
                <button
                  type="button"
                  onClick={() => setStep("details")}
                  className="mb-4 text-sm text-primary font-medium hover:underline"
                >
                  Continue to checkout →
                </button>
              )}

              {step !== "cart" && (
                <button
                  type="button"
                  onClick={() => {
                    if (step === "pay" && orderId) {
                      setStep("details");
                      setOrderId(null);
                    } else {
                      setStep("cart");
                    }
                  }}
                  className="mb-4 text-sm text-gray-600 hover:text-primary"
                >
                  ← Back
                </button>
              )}

              {cart.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500 mb-4">Your cart is empty</p>
                  <button onClick={handleClose} className="text-primary hover:underline">
                    Continue Shopping
                  </button>
                </div>
              ) : step === "cart" ? (
                <>
                  <div className="space-y-4 mb-6">
                    {cart.map((item) => (
                      <div key={item.id} className="flex gap-4 p-4 border rounded-lg">
                        <div className="relative w-20 h-20 flex-shrink-0">
                          <Image src={item.image} alt={item.name} fill className="object-cover rounded" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-800">{item.name}</h3>
                          <p className="text-sm text-gray-500 mb-2">KSh {item.price.toLocaleString()}</p>
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="p-1 hover:bg-gray-100 rounded"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="w-8 text-center">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="p-1 hover:bg-gray-100 rounded"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => removeFromCart(item.id)}
                              className="ml-auto p-1 text-red-500 hover:bg-red-50 rounded"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="border-t pt-4 space-y-4">
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total:</span>
                      <span className="text-primary">KSh {totalPrice.toLocaleString()}</span>
                    </div>
                    <button onClick={clearCart} className="w-full py-2 text-gray-600 hover:text-red-500 transition-colors">
                      Clear Cart
                    </button>
                    <button
                      type="button"
                      onClick={() => setStep("details")}
                      className="w-full bg-logo text-primary py-3 rounded-lg font-semibold hover:bg-primary hover:text-white transition-all shadow-md"
                    >
                      Proceed to Checkout
                    </button>
                  </div>
                </>
              ) : step === "details" ? (
                <div className="space-y-4">
                  <p className="text-sm text-gray-600">
                    Add your room and contact details so kitchen staff can confirm delivery.
                  </p>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Room number</label>
                    <input
                      value={roomNumber}
                      onChange={(e) => setRoomNumber(e.target.value)}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2"
                      placeholder="e.g. 204"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Guest name</label>
                    <input
                      value={guestName}
                      onChange={(e) => setGuestName(e.target.value)}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Email</label>
                    <input
                      type="email"
                      value={guestEmail}
                      onChange={(e) => setGuestEmail(e.target.value)}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Phone</label>
                    <input
                      type="tel"
                      value={guestPhone}
                      onChange={(e) => setGuestPhone(e.target.value)}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2"
                    />
                  </div>

                  <div className="flex justify-between font-semibold text-gray-900 pt-2">
                    <span>Total due</span>
                    <span>KSh {totalPrice.toLocaleString()}</span>
                  </div>

                  {formErr && <p className="text-sm text-red-600">{formErr}</p>}

                  <button
                    type="button"
                    disabled={creating}
                    onClick={() => void createOrder()}
                    className="w-full bg-logo text-primary py-3 rounded-lg font-semibold hover:bg-primary hover:text-white transition-all shadow-md disabled:opacity-50"
                  >
                    {creating ? "Creating order…" : "Continue to payment"}
                  </button>
                </div>
              ) : orderId ? (
                <>
                  <p className="text-sm text-gray-600 mb-3">
                    Order <span className="font-mono text-xs">{orderId}</span> · KSh{" "}
                    {totalPrice.toLocaleString()}
                  </p>
                  <PaymentPanel
                    target="food"
                    entityId={orderId}
                    onPaid={async () => {
                      const r = await fetch(`/api/orders/food/${orderId}`, { cache: "no-store" });
                      const d = (await r.json()) as { receiptKey?: string };
                      clearCart();
                      resetFlow();
                      if (d.receiptKey) {
                        window.location.href = `/receipt/food/${orderId}?key=${encodeURIComponent(d.receiptKey)}`;
                      } else {
                        onClose();
                      }
                    }}
                  />
                </>
              ) : null}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
