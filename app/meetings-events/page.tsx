"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Users, Tv, Coffee, Utensils, Wifi, Music, CheckCircle, Calendar, Clock, MapPin, Phone, Mail, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const eventSpaces = [
  {
    id: "conference",
    name: "Conference Hall",
    capacity: "Up to 100 guests",
    description: "Our spacious conference hall is perfect for large corporate meetings, seminars, and presentations. Equipped with state-of-the-art audiovisual equipment and comfortable seating.",
    features: [
      { icon: Tv, text: "Projector & Screen" },
      { icon: Music, text: "Sound System" },
      { icon: Wifi, text: "High-speed WiFi" },
      { icon: Tv, text: "Video Conferencing" },
    ],
    image: "https://res.cloudinary.com/dyfnobo9r/image/upload/v1756014498/IMG_2958_dsuafs.jpg",
    size: "150 sqm",
  },
  {
    id: "boardroom",
    name: "Boardroom",
    capacity: "Up to 20 guests",
    description: "An elegant boardroom setting ideal for executive meetings, board discussions, and intimate business gatherings. Features premium furnishings and a professional atmosphere.",
    features: [
      { icon: Tv, text: "Large Display Screen" },
      { icon: Coffee, text: "Refreshments Included" },
      { icon: Wifi, text: "WiFi Access" },
      { icon: Users, text: "Executive Seating" },
    ],
    image: "https://res.cloudinary.com/dyfnobo9r/image/upload/v1756014501/IMG_2941_t3rved.jpg",
    size: "40 sqm",
  },
  {
    id: "meeting",
    name: "Meeting Room",
    capacity: "Up to 30 guests",
    description: "Versatile meeting space suitable for team meetings, training sessions, and workshops. Flexible layout options to suit your needs.",
    features: [
      { icon: Tv, text: "Projector Available" },
      { icon: Coffee, text: "Coffee Break Service" },
      { icon: Wifi, text: "Free WiFi" },
      { icon: Utensils, text: "Catering Options" },
    ],
    image: "https://res.cloudinary.com/dyfnobo9r/image/upload/v1756014505/IMG_2947_u6egrt.jpg",
    size: "60 sqm",
  },
];

const eventTypes = [
  {
    id: "corporate",
    name: "Corporate Events",
    description: "Professional corporate meetings, conferences, seminars, and business presentations.",
    image: "https://res.cloudinary.com/dyfnobo9r/image/upload/v1756014498/IMG_2958_dsuafs.jpg",
  },
  {
    id: "wedding",
    name: "Weddings",
    description: "Celebrate your special day in our elegant venue with beautiful settings and professional service.",
    image: "https://res.cloudinary.com/dyfnobo9r/image/upload/v1756012069/download_2_ye1m22.jpg",
  },
  {
    id: "birthday",
    name: "Birthday Celebrations",
    description: "Make birthdays memorable with our celebration packages and personalized service.",
    image: "https://res.cloudinary.com/dyfnobo9r/image/upload/v1756012069/download_3_lnn47e.jpg",
  },
  {
    id: "social",
    name: "Social Gatherings",
    description: "Perfect venue for family reunions, anniversaries, and social celebrations.",
    image: "https://res.cloudinary.com/dyfnobo9r/image/upload/v1756012069/download_4_sknues.jpg",
  },
];

const services = [
  {
    icon: Utensils,
    title: "Catering Services",
    description: "Customized menus for all event types, from coffee breaks to full-course meals.",
  },
  {
    icon: Coffee,
    title: "Refreshments",
    description: "Premium coffee, tea, and refreshments served throughout your event.",
  },
  {
    icon: Wifi,
    title: "Technical Support",
    description: "On-site technical support for all audiovisual equipment and connectivity needs.",
  },
  {
    icon: Users,
    title: "Event Planning",
    description: "Dedicated event coordinator to help plan and execute your perfect event.",
  },
];

const packages = [
  {
    name: "Half Day Package",
    duration: "4 hours",
    price: "KSh 15,000",
    includes: [
      "Room rental",
      "Basic AV equipment",
      "Coffee break",
      "WiFi access",
    ],
  },
  {
    name: "Full Day Package",
    duration: "8 hours",
    price: "KSh 25,000",
    includes: [
      "Room rental",
      "Full AV equipment",
      "Coffee breaks & lunch",
      "WiFi access",
      "Event coordinator",
    ],
  },
  {
    name: "Premium Package",
    duration: "Custom",
    price: "Custom Quote",
    includes: [
      "Exclusive venue access",
      "Premium AV equipment",
      "Full catering service",
      "Dedicated event team",
      "Customized setup",
    ],
  },
];

export default function MeetingsEventsPage() {
  const [formData, setFormData] = useState({
    eventType: "",
    space: "",
    date: "",
    guests: "",
    name: "",
    email: "",
    phone: "",
    message: "",
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
        eventType: "",
        space: "",
        date: "",
        guests: "",
        name: "",
        email: "",
        phone: "",
        message: "",
      });
      setTimeout(() => setIsSubmitted(false), 5000);
    }, 1500);
  };

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
              Meetings & Events
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Host your perfect event in our professional and elegant venues
            </p>
          </motion.div>

          {/* Event Spaces */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-20"
          >
            <h2 className="text-3xl font-serif font-bold text-primary mb-8 text-center">
              Our Event Spaces
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {eventSpaces.map((space, index) => (
                <motion.div
                  key={space.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + index * 0.1 }}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow"
                >
                  <div className="relative h-48">
                    <Image
                      src={space.image}
                      alt={space.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-2xl font-serif font-bold text-gray-800 mb-2">
                      {space.name}
                    </h3>
                    <p className="text-gray-600 mb-4">{space.description}</p>
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-sm text-gray-700">
                        <Users className="w-4 h-4 text-primary" />
                        <span>{space.capacity}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-700">
                        <MapPin className="w-4 h-4 text-primary" />
                        <span>{space.size}</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 mb-4">
                      {space.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center gap-1 text-xs text-gray-600">
                          <feature.icon className="w-3 h-3 text-primary" />
                          <span>{feature.text}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Event Types */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-20"
          >
            <h2 className="text-3xl font-serif font-bold text-primary mb-8 text-center">
              Types of Events
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {eventTypes.map((event, index) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow"
                >
                  <div className="relative h-40">
                    <Image
                      src={event.image}
                      alt={event.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-800 mb-2">{event.name}</h3>
                    <p className="text-sm text-gray-600">{event.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Services */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-lg shadow-md p-8 mb-20"
          >
            <h2 className="text-3xl font-serif font-bold text-primary mb-8 text-center">
              Event Services
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {services.map((service, index) => (
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

          {/* Packages */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-20"
          >
            <h2 className="text-3xl font-serif font-bold text-primary mb-8 text-center">
              Event Packages
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {packages.map((pkg, index) => (
                <motion.div
                  key={pkg.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-shadow"
                >
                  <h3 className="text-2xl font-serif font-bold text-primary mb-2">
                    {pkg.name}
                  </h3>
                  <p className="text-gray-600 mb-4">{pkg.duration}</p>
                  <div className="text-3xl font-bold text-primary mb-6">
                    {pkg.price}
                  </div>
                  <ul className="space-y-2 mb-6">
                    {pkg.includes.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-gray-600">
                        <CheckCircle className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                  <button className="w-full bg-gradient-to-r from-primary to-secondary text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-shadow">
                    Book Package
                  </button>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Contact & Inquiry Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20"
          >
            {/* Contact Info */}
            <div>
              <h2 className="text-3xl font-serif font-bold text-primary mb-6">
                Get in Touch
              </h2>
              <p className="text-gray-600 mb-8">
                Our event planning team is ready to help you create the perfect event. Contact us to discuss your requirements and get a customized quote.
              </p>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-3 rounded-lg">
                    <Phone className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-1">Phone</h3>
                    <a href="tel:+254721929446" className="text-gray-600 hover:text-primary transition-colors">
                      +254 721 929446
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-3 rounded-lg">
                    <Mail className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-1">Email</h3>
                    <a href="mailto:lemachstudios@gmail.com" className="text-gray-600 hover:text-primary transition-colors">
                      lemachstudios@gmail.com
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-3 rounded-lg">
                    <MapPin className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-1">Location</h3>
                    <p className="text-gray-600">
                      B69 Highway, Kilifi County, Kenya
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-3 rounded-lg">
                    <Clock className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-1">Business Hours</h3>
                    <p className="text-gray-600">
                      Monday - Sunday: 8:00 AM - 8:00 PM
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Inquiry Form */}
            <div className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-serif font-bold text-primary mb-6">
                Request a Quote
              </h2>

              {isSubmitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-green-50 border border-green-200 rounded-lg p-6 text-center"
                >
                  <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                  <p className="text-green-700 font-semibold text-lg">
                    Thank you for your inquiry!
                  </p>
                  <p className="text-green-600 mt-2">
                    We'll get back to you within 24 hours.
                  </p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="eventType" className="block text-sm font-medium text-gray-700 mb-2">
                      Event Type *
                    </label>
                    <select
                      id="eventType"
                      name="eventType"
                      required
                      value={formData.eventType}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    >
                      <option value="">Select event type</option>
                      <option value="corporate">Corporate Event</option>
                      <option value="wedding">Wedding</option>
                      <option value="birthday">Birthday Celebration</option>
                      <option value="social">Social Gathering</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="space" className="block text-sm font-medium text-gray-700 mb-2">
                      Preferred Space
                    </label>
                    <select
                      id="space"
                      name="space"
                      value={formData.space}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    >
                      <option value="">Select space</option>
                      <option value="conference">Conference Hall</option>
                      <option value="boardroom">Boardroom</option>
                      <option value="meeting">Meeting Room</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
                        Event Date *
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
                      <label htmlFor="guests" className="block text-sm font-medium text-gray-700 mb-2">
                        Number of Guests *
                      </label>
                      <input
                        type="number"
                        id="guests"
                        name="guests"
                        required
                        min="1"
                        value={formData.guests}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
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
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                        Phone *
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

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                      Additional Details
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={4}
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Tell us more about your event..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-primary to-secondary text-white px-6 py-4 rounded-lg font-semibold hover:shadow-lg transition-shadow disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        Submit Inquiry
                        <ArrowRight className="w-5 h-5" />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
