"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Calendar, Users, Bed, CheckCircle, ArrowRight } from "lucide-react";
import Link from "next/link";

const roomTypes = {
  standard: { name: "Standard Room", price: 8500 },
  deluxe: { name: "Deluxe Room", price: 12000 },
  family: { name: "Family Suite", price: 18000 },
  executive: { name: "Executive Suite", price: 25000 },
};

function BookingForm() {
  const searchParams = useSearchParams();
  const roomParam = searchParams.get("room");

  const [formData, setFormData] = useState({
    roomType: roomParam || "",
    checkIn: "",
    checkOut: "",
    guests: "1",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    specialRequests: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [nights, setNights] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    if (formData.checkIn && formData.checkOut) {
      const checkInDate = new Date(formData.checkIn);
      const checkOutDate = new Date(formData.checkOut);
      const diffTime = Math.abs(checkOutDate.getTime() - checkInDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      setNights(diffDays > 0 ? diffDays : 0);
    } else {
      setNights(0);
    }
  }, [formData.checkIn, formData.checkOut]);

  useEffect(() => {
    if (formData.roomType && nights > 0) {
      const room = roomTypes[formData.roomType as keyof typeof roomTypes];
      if (room) {
        setTotalPrice(room.price * nights);
      }
    } else {
      setTotalPrice(0);
    }
  }, [formData.roomType, nights]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 2000);
  };

  const getMinCheckOutDate = () => {
    if (formData.checkIn) {
      const checkInDate = new Date(formData.checkIn);
      checkInDate.setDate(checkInDate.getDate() + 1);
      return checkInDate.toISOString().split("T")[0];
    }
    return "";
  };

  if (isSubmitted) {
    return (
      <main>
        <Header />
        <div className="pt-24 pb-12 min-h-screen flex items-center justify-center bg-gray-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white p-12 rounded-lg shadow-lg text-center max-w-2xl mx-4"
          >
            <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
            <h1 className="text-4xl font-serif font-bold text-primary mb-4">
              Booking Confirmed!
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Thank you for your booking. We've sent a confirmation email to{" "}
              <strong>{formData.email}</strong>
            </p>
            <div className="bg-gray-50 p-6 rounded-lg mb-8 text-left">
              <h3 className="font-semibold text-gray-800 mb-4">Booking Details</h3>
              <div className="space-y-2 text-gray-600">
                <p>
                  <strong>Room:</strong> {roomTypes[formData.roomType as keyof typeof roomTypes]?.name}
                </p>
                <p>
                  <strong>Check-in:</strong> {new Date(formData.checkIn).toLocaleDateString()}
                </p>
                <p>
                  <strong>Check-out:</strong> {new Date(formData.checkOut).toLocaleDateString()}
                </p>
                <p>
                  <strong>Guests:</strong> {formData.guests}
                </p>
                <p>
                  <strong>Total:</strong> KSh {totalPrice.toLocaleString()}
                </p>
              </div>
            </div>
            <div className="flex gap-4 justify-center">
              <Link
                href="/"
                className="bg-gradient-to-r from-primary to-secondary text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-shadow"
              >
                Back to Home
              </Link>
              <Link
                href="/rooms"
                className="border-2 border-primary text-primary px-6 py-3 rounded-lg font-semibold hover:bg-primary hover:text-white transition-colors"
              >
                View More Rooms
              </Link>
            </div>
          </motion.div>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main>
      <Header />
      <div className="pt-24 pb-12 min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-5xl font-serif font-bold text-primary mb-4">Book Your Stay</h1>
            <p className="text-xl text-gray-600">
              Reserve your perfect room at Lemach Hotel
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Booking Form */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white p-8 rounded-lg shadow-md"
              >
                <h2 className="text-2xl font-serif font-bold text-gray-800 mb-6">
                  Booking Information
                </h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Room Type */}
                  <div>
                    <label htmlFor="roomType" className="block text-sm font-medium text-gray-700 mb-2">
                      Room Type *
                    </label>
                    <select
                      id="roomType"
                      name="roomType"
                      required
                      value={formData.roomType}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    >
                      <option value="">Select a room type</option>
                      {Object.entries(roomTypes).map(([key, room]) => (
                        <option key={key} value={key}>
                          {room.name} - KSh {room.price.toLocaleString()}/night
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Dates */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="checkIn" className="block text-sm font-medium text-gray-700 mb-2">
                        <Calendar className="w-4 h-4 inline mr-1" />
                        Check-in Date *
                      </label>
                      <input
                        type="date"
                        id="checkIn"
                        name="checkIn"
                        required
                        min={new Date().toISOString().split("T")[0]}
                        value={formData.checkIn}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label htmlFor="checkOut" className="block text-sm font-medium text-gray-700 mb-2">
                        <Calendar className="w-4 h-4 inline mr-1" />
                        Check-out Date *
                      </label>
                      <input
                        type="date"
                        id="checkOut"
                        name="checkOut"
                        required
                        min={getMinCheckOutDate()}
                        value={formData.checkOut}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>
                  </div>

                  {/* Guests */}
                  <div>
                    <label htmlFor="guests" className="block text-sm font-medium text-gray-700 mb-2">
                      <Users className="w-4 h-4 inline mr-1" />
                      Number of Guests *
                    </label>
                    <select
                      id="guests"
                      name="guests"
                      required
                      value={formData.guests}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    >
                      <option value="1">1 Guest</option>
                      <option value="2">2 Guests</option>
                      <option value="3">3 Guests</option>
                      <option value="4">4 Guests</option>
                      <option value="5">5+ Guests</option>
                    </select>
                  </div>

                  {/* Personal Information */}
                  <div className="border-t pt-6">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">Guest Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                          First Name *
                        </label>
                        <input
                          type="text"
                          id="firstName"
                          name="firstName"
                          required
                          value={formData.firstName}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                          Last Name *
                        </label>
                        <input
                          type="text"
                          id="lastName"
                          name="lastName"
                          required
                          value={formData.lastName}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          required
                          value={formData.email}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                          Phone Number *
                        </label>
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          required
                          value={formData.phone}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Special Requests */}
                  <div>
                    <label htmlFor="specialRequests" className="block text-sm font-medium text-gray-700 mb-2">
                      Special Requests
                    </label>
                    <textarea
                      id="specialRequests"
                      name="specialRequests"
                      rows={4}
                      value={formData.specialRequests}
                      onChange={handleChange}
                      placeholder="Any special requests or preferences..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting || !formData.roomType || !formData.checkIn || !formData.checkOut}
                    className="w-full bg-gradient-to-r from-primary to-secondary text-white px-6 py-4 rounded-lg font-semibold hover:shadow-lg transition-shadow disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        Complete Booking
                        <ArrowRight className="w-5 h-5" />
                      </>
                    )}
                  </button>
                </form>
              </motion.div>
            </div>

            {/* Booking Summary */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white p-6 rounded-lg shadow-md sticky top-24"
              >
                <h2 className="text-2xl font-serif font-bold text-primary mb-6">Booking Summary</h2>

                {formData.roomType ? (
                  <>
                    <div className="space-y-4 mb-6">
                      <div className="flex items-center gap-3">
                        <Bed className="w-5 h-5 text-primary" />
                        <div>
                          <p className="font-semibold text-gray-800">
                            {roomTypes[formData.roomType as keyof typeof roomTypes]?.name}
                          </p>
                          <p className="text-sm text-gray-600">
                            KSh {roomTypes[formData.roomType as keyof typeof roomTypes]?.price.toLocaleString()}/night
                          </p>
                        </div>
                      </div>

                      {formData.checkIn && (
                        <div className="flex items-center gap-3 text-gray-600">
                          <Calendar className="w-5 h-5 text-primary" />
                          <div>
                            <p className="text-sm">Check-in</p>
                            <p className="font-semibold text-gray-800">
                              {new Date(formData.checkIn).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      )}

                      {formData.checkOut && (
                        <div className="flex items-center gap-3 text-gray-600">
                          <Calendar className="w-5 h-5 text-primary" />
                          <div>
                            <p className="text-sm">Check-out</p>
                            <p className="font-semibold text-gray-800">
                              {new Date(formData.checkOut).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      )}

                      {nights > 0 && (
                        <div className="flex items-center gap-3 text-gray-600">
                          <Users className="w-5 h-5 text-primary" />
                          <div>
                            <p className="text-sm">Duration</p>
                            <p className="font-semibold text-gray-800">
                              {nights} {nights === 1 ? "night" : "nights"}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="border-t border-b py-4 mb-6">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-600">Subtotal</span>
                        <span className="font-semibold text-gray-800">
                          KSh {totalPrice.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Taxes & Fees</span>
                        <span className="font-semibold text-gray-800">Included</span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center mb-6">
                      <span className="text-lg font-bold text-gray-800">Total</span>
                      <span className="text-2xl font-bold text-primary">
                        KSh {totalPrice.toLocaleString()}
                      </span>
                    </div>
                  </>
                ) : (
                  <p className="text-gray-500 text-center py-8">
                    Select a room type to see pricing
                  </p>
                )}

                <div className="space-y-3 pt-6 border-t">
                  <div className="flex items-start gap-2 text-sm text-gray-600">
                    <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span>Free cancellation up to 24 hours</span>
                  </div>
                  <div className="flex items-start gap-2 text-sm text-gray-600">
                    <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span>Best price guarantee</span>
                  </div>
                  <div className="flex items-start gap-2 text-sm text-gray-600">
                    <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span>Instant confirmation</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}

export default function BookingPage() {
  return (
    <Suspense fallback={
      <main>
        <Header />
        <div className="pt-24 pb-12 min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading booking form...</p>
          </div>
        </div>
        <Footer />
      </main>
    }>
      <BookingForm />
    </Suspense>
  );
}
