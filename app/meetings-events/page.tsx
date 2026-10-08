"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Users, Tv, Coffee, Utensils, Wifi, Music, CheckCircle, Calendar, Clock, MapPin, Phone, Mail, ArrowRight, Bookmark, Sun, Sparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const cld = (src: string, transform: string) =>
  src.replace("/image/upload/", `/image/upload/${transform}/`);

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
    image: cld(
      "https://res.cloudinary.com/dyfnobo9r/image/upload/v1773841224/Boardroom_1_hfa8v2.jpg",
      "f_auto,q_auto,w_1200"
    ),
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
    image: cld(
      "https://res.cloudinary.com/dyfnobo9r/image/upload/v1773841223/Boardroom_5_lf2hqj.jpg",
      "f_auto,q_auto,w_1200"
    ),
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
    image: cld(
      "https://res.cloudinary.com/dyfnobo9r/image/upload/v1773841223/Boardroom_6_bx9clk.jpg",
      "f_auto,q_auto,w_1200"
    ),
    size: "60 sqm",
  },
];

const services = [
  {
    icon: Tv,
    title: "Projectors & Screens",
    description: "Projectors and screens in the conference hall, boardroom, and meeting room.",
  },
  {
    icon: Wifi,
    title: "High-Speed WiFi",
    description: "WiFi for presentations and guest devices throughout the event spaces.",
  },
  {
    icon: Music,
    title: "Sound & AV",
    description: "A sound system and video conferencing, with on-site support for the equipment.",
  },
  {
    icon: Utensils,
    title: "In-house Catering",
    description: "Menus for coffee breaks, working lunches, and full meals.",
  },
  {
    icon: Coffee,
    title: "Refreshments",
    description: "Coffee, tea, and refreshments served through the event.",
  },
  {
    icon: Users,
    title: "Event Planning",
    description: "A coordinator to help plan the day and see it through.",
  },
];

const packages = [
  {
    icon: Clock,
    name: "Half Day Package",
    description:
      "Room rental for 4 hours, with basic AV equipment, a coffee break, and WiFi. KSh 15,000.",
  },
  {
    icon: Sun,
    name: "Full Day Package",
    description:
      "Room rental for 8 hours, with full AV equipment, coffee breaks and lunch, WiFi, and an event coordinator. KSh 25,000.",
  },
  {
    icon: Sparkles,
    name: "Premium Package",
    description:
      "Exclusive venue access with premium AV, full catering, a dedicated event team, and a customized setup. Custom quote.",
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
      <div className="min-h-screen bg-gray-50 pt-24">
        <section className="relative min-h-[220px] overflow-hidden sm:min-h-[280px] lg:min-h-[320px]">
          <Image
            src={cld(
              "https://res.cloudinary.com/dyfnobo9r/image/upload/v1773841224/Boardroom_2_ybp800.jpg",
              "f_auto,q_auto,w_2200"
            )}
            alt="Lemach Hotel conference and event space in Kilifi County"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(90deg, rgba(18, 10, 12, 0.68) 0%, rgba(16, 12, 16, 0.55) 46%, rgba(14, 12, 14, 0.48) 100%)",
            }}
          />
          <div className="relative z-10 flex min-h-[220px] items-center px-5 py-10 sm:min-h-[280px] sm:px-12 lg:min-h-[320px] lg:px-16 xl:px-20">
            <div className="max-w-3xl">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-secondary sm:text-xs sm:tracking-[0.28em]">
                Meetings &amp; Events
              </p>
              <h1 className="mt-3 font-serif text-[2.15rem] font-medium leading-[1.05] text-white sm:mt-4 sm:text-5xl lg:text-[3.35rem]">
                Conferences and
                <span className="mt-1 block">celebrations</span>
              </h1>
            </div>
          </div>
        </section>
        <section className="bg-white px-5 py-14 sm:px-8 sm:py-20 lg:px-12 lg:py-24">
          <div className="mx-auto grid max-w-6xl items-start gap-10 lg:grid-cols-[minmax(0,1.35fr)_minmax(280px,0.85fr)] lg:gap-16">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-secondary-dark sm:text-xs sm:tracking-[0.28em]">
                Conference &amp; events
              </p>
              <h2 className="mt-4 font-serif text-[2.15rem] font-medium leading-[1.05] text-primary-dark sm:text-5xl lg:text-[3.25rem]">
                Versatile spaces
                <span className="mt-1 block italic text-primary">for every occasion</span>
              </h2>
              <div className="mt-6 max-w-xl space-y-4 text-[15px] leading-relaxed text-[#5A5A5A] sm:text-base">
                <p>
                  Lemach has a conference hall for up to 100 guests, a boardroom for
                  executive meetings, and a meeting room for teams and workshops, in
                  Kilifi County just off the B69 Highway.
                </p>
                <p>
                  Each space includes audiovisual equipment, WiFi, and comfortable
                  seating. Catering runs from coffee breaks to full meals, and an event
                  coordinator can help plan the day.
                </p>
              </div>
              <div className="mt-8 max-w-md bg-primary px-5 py-6 text-white sm:px-6">
                <div className="flex gap-3">
                  <Bookmark className="mt-0.5 h-5 w-5 shrink-0" />
                  <div>
                    <p className="font-semibold leading-snug">
                      Explore our event packages for tailored solutions
                    </p>
                    <p className="mt-2 text-sm leading-relaxed text-white/90">
                      Half-day, full-day, and premium options, from a coffee break to a
                      dedicated event team.
                    </p>
                  </div>
                </div>
                <Link
                  href="#event-packages"
                  className="mt-5 flex min-h-11 w-full items-center justify-center bg-white px-4 py-3 text-[12px] font-semibold uppercase tracking-[0.14em] text-primary transition-colors hover:bg-logo"
                >
                  View event packages
                </Link>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-8 bg-logo px-4 py-8 sm:gap-x-6 sm:gap-y-10 sm:px-10 sm:py-12">
              {[
                { value: "100", label: "Max. guest capacity" },
                { value: "3", label: "Meeting & event spaces" },
                { value: "1", label: "Boardroom" },
                { value: "3", label: "Event packages" },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <p className="font-serif text-4xl font-medium text-primary sm:text-5xl">{stat.value}</p>
                  <p className="mt-2 text-[10px] font-medium uppercase leading-snug tracking-[0.08em] text-[#6A6A6A] sm:text-[11px] sm:tracking-[0.14em]">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
        <section className="bg-[#F7F4EE] px-5 py-14 sm:px-8 sm:py-20 lg:py-24">
          <div className="mx-auto max-w-6xl text-center">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-secondary-dark sm:text-xs sm:tracking-[0.28em]">
              Facilities &amp; equipment
            </p>
            <h2 className="mt-4 font-serif text-[2.15rem] font-medium leading-[1.05] text-primary-dark sm:text-5xl lg:text-[3.25rem]">
              Everything you need
              <span className="mt-1 block italic text-primary">for a successful event</span>
            </h2>
            <ul className="mt-10 grid grid-cols-1 gap-4 sm:mt-14 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
              {services.map((service) => (
                <li key={service.title} className="bg-white px-5 py-8 sm:px-6 sm:py-10">
                  <service.icon className="mx-auto h-6 w-6 text-primary" strokeWidth={1.5} />
                  <h3 className="mt-4 text-sm font-semibold text-primary">{service.title}</h3>
                  <p className="mx-auto mt-2 max-w-xs text-sm leading-relaxed text-[#6A6A6A]">
                    {service.description}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </section>
        <section className="bg-white px-5 py-14 sm:px-8 sm:py-20 lg:py-24">
          <div className="mx-auto max-w-6xl text-center">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-secondary-dark sm:text-xs sm:tracking-[0.28em]">
              The venues
            </p>
            <h2 className="mt-4 font-serif text-[2.15rem] font-medium leading-[1.05] text-primary-dark sm:text-5xl lg:text-[3.25rem]">
              Spaces as impressive
              <span className="mt-1 block italic text-primary">as your agenda</span>
            </h2>
            <ul className="mt-10 grid grid-cols-1 gap-6 sm:mt-12 sm:grid-cols-3 sm:gap-3">
              {eventSpaces.map((space) => (
                <li key={space.id}>
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <Image
                      src={space.image}
                      alt={`${space.name}, ${space.capacity}`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 100vw, 33vw"
                    />
                  </div>
                  <h3 className="mt-3 text-sm font-semibold text-primary-dark">{space.name}</h3>
                  <p className="mt-1 text-xs text-[#6A6A6A]">{space.capacity}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>
        <section className="bg-[#F7F4EE] px-5 py-14 sm:px-8 sm:py-20 lg:py-24">
          <div className="mx-auto max-w-4xl text-center">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-secondary-dark sm:text-xs sm:tracking-[0.28em]">
              Room capacities
            </p>
            <h2 className="mt-4 font-serif text-[2.15rem] font-medium leading-[1.05] text-primary-dark sm:text-5xl lg:text-[3.25rem]">
              Find the right space
              <span className="mt-1 block italic text-primary">for your group</span>
            </h2>
            <div className="mt-10 overflow-x-auto sm:mt-12">
              <table className="w-full min-w-[280px] text-left text-sm">
                <thead>
                  <tr className="bg-primary-dark text-[11px] font-semibold uppercase tracking-[0.14em] text-white">
                    <th className="px-4 py-3.5 sm:px-6">Venue</th>
                    <th className="px-4 py-3.5 text-center sm:px-6">
                      <span className="inline-flex items-center justify-center gap-1.5">
                        <Users className="h-3.5 w-3.5" />
                        Guests
                      </span>
                    </th>
                    <th className="px-4 py-3.5 text-center sm:px-6">Size</th>
                  </tr>
                </thead>
                <tbody>
                  {eventSpaces.map((space) => {
                    const featured = space.id === "conference";
                    const guests = space.capacity.replace(/\D/g, "");
                    return (
                      <tr
                        key={space.id}
                        className={featured ? "bg-logo text-primary-dark" : "bg-white text-[#3A3A3A]"}
                      >
                        <td className="px-4 py-4 font-medium sm:px-6">{space.name}</td>
                        <td className={`px-4 py-4 text-center font-semibold sm:px-6 ${featured ? "text-primary" : ""}`}>
                          {guests}
                        </td>
                        <td className="px-4 py-4 text-center sm:px-6">{space.size}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <p className="mx-auto mt-6 max-w-2xl text-xs italic leading-relaxed text-[#7A7A7A] sm:text-sm">
              Guest numbers are the maximum for each room. Contact the events team for a setup
              that fits your group.
            </p>
          </div>
        </section>
        <section id="event-packages" className="scroll-mt-28 bg-white px-5 py-14 sm:px-8 sm:py-20 lg:py-24">
          <div className="mx-auto max-w-6xl text-center">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-secondary-dark sm:text-xs sm:tracking-[0.28em]">
              Events &amp; banqueting
            </p>
            <h2 className="mt-4 font-serif text-[2.15rem] font-medium leading-[1.05] text-primary-dark sm:text-5xl lg:text-[3.25rem]">
              Tailored packages
              <span className="mt-1 block italic text-primary">for every event</span>
            </h2>
            <ul className="mt-10 grid grid-cols-1 gap-4 sm:mt-14 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
              {packages.map((pkg) => (
                <li key={pkg.name} className="border border-[#E7E1D8] bg-white px-5 py-8 sm:px-6 sm:py-10">
                  <pkg.icon className="mx-auto h-6 w-6 text-primary" strokeWidth={1.5} />
                  <h3 className="mt-4 text-sm font-semibold text-primary">{pkg.name}</h3>
                  <p className="mx-auto mt-3 max-w-xs text-sm leading-relaxed text-[#6A6A6A]">
                    {pkg.description}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </section>
        <div className="container mx-auto px-4 pb-10 pt-10 sm:pb-12 sm:pt-12">
          {/* Contact & Inquiry Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mb-10 grid grid-cols-1 gap-8 lg:mb-20 lg:grid-cols-2 lg:gap-12"
          >
            {/* Contact Info */}
            <div>
              <h2 className="text-3xl font-sans font-bold text-primary mb-6">
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
                    <a href="mailto:lemachstudios@gmail.com" className="break-all text-gray-600 hover:text-primary transition-colors sm:break-normal">
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
            <div className="rounded-lg bg-white p-5 shadow-md sm:p-8">
              <h2 className="text-2xl font-sans font-bold text-primary mb-6">
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

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
                        className="w-full min-w-0 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
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

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
                    className="w-full bg-logo text-primary px-6 py-4 rounded-lg font-semibold hover:bg-primary hover:text-white transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
