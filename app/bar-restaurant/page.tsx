"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Utensils, Wine, Music, Trees, Users, Clock, CheckCircle, Coffee, Sparkles, Heart, Calendar, Phone, Mail } from "lucide-react";
import Image from "next/image";

const features = [
  { icon: Utensils, title: "Fine Dining", description: "Exquisite cuisine prepared by expert chefs" },
  { icon: Wine, title: "Premium Beverages", description: "Curated selection of wines and cocktails" },
  { icon: Music, title: "Live Music", description: "Enjoy live entertainment on select evenings" },
  { icon: Trees, title: "Garden Views", description: "Beautiful views of our landscaped gardens" },
];

const diningAreas = [
  {
    id: "main",
    name: "Main Restaurant",
    description: "Our elegant main dining area offers a sophisticated atmosphere perfect for any occasion. Enjoy our signature dishes in a comfortable and stylish setting.",
    capacity: "Up to 80 guests",
    hours: "6:30 AM - 10:30 PM",
    features: "Full menu available",
    image: "https://res.cloudinary.com/dyfnobo9r/image/upload/v1756014494/IMG_2948_kzpa8s.jpg",
  },
  {
    id: "terrace",
    name: "Outdoor Terrace",
    description: "Experience al fresco dining on our beautiful terrace with stunning views of the surrounding landscape. Perfect for romantic dinners and special occasions.",
    capacity: "Up to 40 guests",
    hours: "7:00 AM - 9:00 PM",
    features: "Garden views",
    image: "https://res.cloudinary.com/dyfnobo9r/image/upload/v1756014498/IMG_20250710_183035_xxzjze.jpg",
  },
  {
    id: "bar",
    name: "Bar & Lounge",
    description: "Relax and unwind in our stylish bar and lounge area. Enjoy premium cocktails, local beers, and light snacks in a casual and welcoming atmosphere.",
    capacity: "Up to 50 guests",
    hours: "11:00 AM - 12:00 AM",
    features: "Live entertainment",
    image: "https://res.cloudinary.com/dyfnobo9r/image/upload/v1756014505/IMG_2947_u6egrt.jpg",
  },
];

const barServices = [
  {
    icon: Sparkles,
    title: "Craft Cocktails",
    description: "Expertly crafted cocktails using premium spirits and fresh local ingredients.",
  },
  {
    icon: Wine,
    title: "Premium Beverages",
    description: "Curated selection of premium non-alcoholic beverages, fresh juices, and specialty drinks to complement your meal.",
  },
  {
    icon: Utensils,
    title: "Local Specialties",
    description: "Selection of local Kenyan specialties, fresh juices, and international favorites.",
  },
  {
    icon: Coffee,
    title: "Coffee & Tea",
    description: "Premium coffee from local Kenyan beans and a variety of specialty teas.",
  },
];

const specialEvents = [
  {
    id: "brunch",
    name: "Sunday Brunch",
    description: "Join us every Sunday for our famous brunch featuring live cooking stations, fresh pastries, and bottomless fresh juices.",
    schedule: "Every Sunday",
    time: "11:00 AM - 3:00 PM",
    price: "KSh 3,500 per person",
    image: "https://res.cloudinary.com/dyfnobo9r/image/upload/v1756014498/IMG_20250710_183035_xxzjze.jpg",
  },
  {
    id: "gourmet",
    name: "Gourmet Dine Evenings",
    description: "Monthly gourmet pairing dinners featuring exquisite dishes paired with carefully selected premium beverages.",
    schedule: "Last Friday of Month",
    time: "7:00 PM - 10:00 PM",
    price: "KSh 5,000 per person",
    image: "https://res.cloudinary.com/dyfnobo9r/image/upload/v1756014497/IMG_2954_y59iig.jpg",
  },
  {
    id: "romantic",
    name: "Romantic Dinner Packages",
    description: "Special romantic dinner packages for couples with private seating and personalized service.",
    schedule: "Available Daily",
    time: "6:30 PM - 9:30 PM",
    price: "KSh 8,000 per couple",
    image: "https://res.cloudinary.com/dyfnobo9r/image/upload/v1756014505/IMG_2947_u6egrt.jpg",
  },
];

export default function BarRestaurantPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    date: "",
    time: "",
    guests: "",
    phone: "",
    specialRequests: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

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

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setFormData({
        fullName: "",
        email: "",
        date: "",
        time: "",
        guests: "",
        phone: "",
        specialRequests: "",
      });
      setTimeout(() => setIsSubmitted(false), 5000);
    }, 1500);
  };

  const timeSlots = [
    "6:30 AM", "7:00 AM", "7:30 AM", "8:00 AM", "8:30 AM", "9:00 AM", "9:30 AM", "10:00 AM",
    "11:00 AM", "12:00 PM", "12:30 PM", "1:00 PM", "1:30 PM", "2:00 PM", "2:30 PM", "3:00 PM",
    "4:00 PM", "5:00 PM", "5:30 PM", "6:00 PM", "6:30 PM", "7:00 PM", "7:30 PM", "8:00 PM",
    "8:30 PM", "9:00 PM", "9:30 PM", "10:00 PM", "11:00 PM",
  ];

  return (
    <main>
      <Header />
      <div className="pt-24 pb-12 min-h-screen bg-gray-50">
        <div className="container mx-auto px-4">
          {/* Page Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h1 className="text-5xl font-serif font-bold text-primary mb-4">
              Bar & Restaurant
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Experience exquisite dining and refreshing drinks in our elegant restaurant and bar
            </p>
          </motion.div>

          {/* Welcome Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-lg shadow-md p-8 md:p-12 mb-16"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-4xl font-serif font-bold text-primary mb-6">
                  Welcome to Our Restaurant
                </h2>
                <p className="text-lg text-gray-600 mb-4 leading-relaxed">
                  At Lemach Hotel's restaurant, we take pride in offering a culinary journey that combines traditional Kenyan flavors with international cuisine. Our expert chefs use the finest local ingredients to create memorable dining experiences.
                </p>
                <p className="text-lg text-gray-600 leading-relaxed">
                  Whether you're enjoying a romantic dinner, a family meal, or a business lunch, our restaurant provides the perfect setting with its elegant ambiance and attentive service.
                </p>
              </div>
              <div className="relative h-64 lg:h-96 rounded-lg overflow-hidden">
                <Image
                  src="https://res.cloudinary.com/dyfnobo9r/image/upload/v1756014494/IMG_2948_kzpa8s.jpg"
                  alt="Restaurant Interior"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </motion.div>

          {/* Features */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16"
          >
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className="bg-white p-6 rounded-lg shadow-md text-center hover:shadow-lg transition-shadow"
              >
                <div className="bg-gradient-to-r from-primary to-secondary w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-600">{feature.description}</p>
              </div>
            ))}
          </motion.div>

          {/* Dining Areas */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-16"
          >
            <h2 className="text-3xl font-serif font-bold text-primary mb-8 text-center">
              Our Dining Areas
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {diningAreas.map((area, index) => (
                <motion.div
                  key={area.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow"
                >
                  <div className="relative h-48">
                    <Image
                      src={area.image}
                      alt={area.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-2xl font-serif font-bold text-gray-800 mb-3">
                      {area.name}
                    </h3>
                    <p className="text-gray-600 mb-4">{area.description}</p>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-gray-700">
                        <Users className="w-4 h-4 text-primary" />
                        <span>{area.capacity}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-700">
                        <Clock className="w-4 h-4 text-primary" />
                        <span>{area.hours}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-700">
                        <CheckCircle className="w-4 h-4 text-primary" />
                        <span>{area.features}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Bar Services */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-lg shadow-md p-8 mb-16"
          >
            <h2 className="text-3xl font-serif font-bold text-primary mb-8 text-center">
              Bar Services
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {barServices.map((service, index) => (
                <div
                  key={service.title}
                  className="text-center"
                >
                  <div className="bg-gradient-to-r from-primary to-secondary w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <service.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-800 mb-2">{service.title}</h3>
                  <p className="text-sm text-gray-600">{service.description}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Special Dining Events */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mb-16"
          >
            <h2 className="text-3xl font-serif font-bold text-primary mb-8 text-center">
              Special Dining Events
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {specialEvents.map((event, index) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow"
                >
                  <div className="relative h-48">
                    <Image
                      src={event.image}
                      alt={event.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-2xl font-serif font-bold text-gray-800 mb-3">
                      {event.name}
                    </h3>
                    <p className="text-gray-600 mb-4">{event.description}</p>
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-sm text-gray-700">
                        <Calendar className="w-4 h-4 text-primary" />
                        <span>{event.schedule}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-700">
                        <Clock className="w-4 h-4 text-primary" />
                        <span>{event.time}</span>
                      </div>
                      <div className="text-lg font-bold text-primary mt-3">
                        {event.price}
                      </div>
                    </div>
                    <button className="w-full bg-gradient-to-r from-primary to-secondary text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-shadow">
                      Reserve Table
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Reservation Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white rounded-lg shadow-md p-8 md:p-12 max-w-4xl mx-auto"
          >
            <h2 className="text-3xl font-serif font-bold text-primary mb-8 text-center">
              Make a Reservation
            </h2>
            <p className="text-center text-gray-600 mb-8">
              Book your table for an unforgettable dining experience
            </p>

            {isSubmitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-green-50 border border-green-200 rounded-lg p-6 text-center"
              >
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <p className="text-green-700 font-semibold text-lg">
                  Reservation request submitted successfully!
                </p>
                <p className="text-green-600 mt-2">
                  We'll confirm your reservation via email shortly.
                </p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="fullName"
                      name="fullName"
                      required
                      value={formData.fullName}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email *
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
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
                      Date *
                    </label>
                    <input
                      type="date"
                      id="date"
                      name="date"
                      required
                      min={new Date().toISOString().split("T")[0]}
                      value={formData.date}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-2">
                      Time *
                    </label>
                    <select
                      id="time"
                      name="time"
                      required
                      value={formData.time}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    >
                      <option value="">Select time</option>
                      {timeSlots.map((time) => (
                        <option key={time} value={time}>
                          {time}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="guests" className="block text-sm font-medium text-gray-700 mb-2">
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
                      <option value="">Select guests</option>
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                        <option key={num} value={num}>
                          {num} {num === 1 ? "Guest" : "Guests"}
                        </option>
                      ))}
                      <option value="10+">10+ Guests</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                </div>

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
                    placeholder="Any special requests or dietary requirements..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-primary to-secondary text-white px-6 py-4 rounded-lg font-semibold hover:shadow-lg transition-shadow disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Submitting..." : "Book Table"}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
