"use client";

import { motion } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { MapPin, Bed, Utensils, Users, Waves, Leaf, Award, Heart, GraduationCap, ShoppingBag, CheckCircle, Star } from "lucide-react";
import Image from "next/image";

const whyChooseUs = [
  {
    icon: MapPin,
    title: "Prime Location",
    description: "Conveniently located off B69 with easy access to major attractions and business centers.",
  },
  {
    icon: Bed,
    title: "Luxury Accommodation",
    description: "Elegantly designed rooms and suites with modern amenities and stunning views.",
  },
  {
    icon: Utensils,
    title: "Exquisite Dining",
    description: "World-class restaurant serving local and international cuisine prepared by expert chefs.",
  },
  {
    icon: Users,
    title: "Professional Service",
    description: "Dedicated staff committed to providing personalized and attentive service.",
  },
  {
    icon: Waves,
    title: "Recreation Facilities",
    description: "Swimming pool, conference facilities, and various activities for entertainment.",
  },
  {
    icon: Leaf,
    title: "Sustainable Practices",
    description: "Committed to environmental responsibility and sustainable tourism practices.",
  },
];

const awards = [
  {
    title: "Best Hotel in Kilifi County",
    organization: "Tourism Excellence Awards 2023",
    icon: Award,
  },
  {
    title: "Excellence in Service",
    organization: "Kenya Hospitality Awards 2022",
    icon: Star,
  },
  {
    title: "4-Star Rating",
    organization: "Kenya Tourism Board Certification",
    icon: Star,
  },
  {
    title: "Green Hotel Award",
    organization: "Environmental Conservation Recognition",
    icon: Leaf,
  },
];

const communityInitiatives = [
  {
    icon: ShoppingBag,
    title: "Local Partnerships",
    description: "Supporting local farmers and suppliers",
  },
  {
    icon: GraduationCap,
    title: "Education Support",
    description: "Scholarships for local students",
  },
  {
    icon: Heart,
    title: "Community Development",
    description: "Contributing to sustainable development in Kilifi County",
  },
];

export default function AboutPage() {
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
            <div
              className="relative overflow-hidden min-h-[220px] sm:min-h-[260px] md:min-h-[320px]"
            >
              {/* Background image with improved clarity */}
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                  backgroundImage:
                    "url(https://res.cloudinary.com/dyfnobo9r/image/upload/v1773841224/Boardroom_2_ybp800.jpg)",
                  filter: "brightness(0.92) contrast(1.18) saturate(1.06)",
                }}
              />
              {/* Dark overlay kept lighter since there is no text */}
              <div className="absolute inset-0 bg-primary/35" />
            </div>
          </motion.div>

          {/* Our Story Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-lg shadow-md p-8 md:p-12 mb-16"
          >
            <h2 className="text-4xl font-sans font-bold text-primary mb-6">Our Story</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <p className="text-lg text-gray-600 mb-4 leading-relaxed">
                  Founded with a vision to provide exceptional hospitality in the heart of Kilifi County, Lemach Hotel and Accommodations has been serving guests since 2010. Located just off the scenic B69 highway, our establishment has become a landmark destination for both business and leisure travelers.
                </p>
                <p className="text-lg text-gray-600 mb-4 leading-relaxed">
                  What started as a small family-run establishment has grown into a premier hotel offering world-class amenities while maintaining the warm, authentic Kenyan hospitality that our guests have come to love.
                </p>
                <p className="text-lg text-gray-600 leading-relaxed">
                  Our commitment to excellence and attention to detail has earned us a reputation as one of the finest hotels in the region, attracting guests from across Kenya and around the world.
                </p>
              </div>
              <div className="relative h-64 lg:h-96 rounded-lg overflow-hidden">
                <Image
                  src="https://res.cloudinary.com/dyfnobo9r/image/upload/v1756012069/images_11_zaumgq.jpg"
                  alt="Hotel History"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </motion.div>

          {/* Mission, Vision, Values */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16"
          >
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-2xl font-sans font-bold text-primary mb-4">Our Mission</h3>
              <p className="text-gray-600">
                To provide exceptional hospitality experiences that exceed guest expectations while promoting the rich culture and beauty of Kilifi County.
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-2xl font-sans font-bold text-primary mb-4">Our Vision</h3>
              <p className="text-gray-600">
                To be the leading hospitality destination in Kilifi County, known for luxury, comfort, and authentic Kenyan experiences.
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-2xl font-sans font-bold text-primary mb-4">Our Values</h3>
              <p className="text-gray-600">
                Excellence, Integrity, Hospitality, Sustainability, and Community engagement guide everything we do.
              </p>
            </div>
          </motion.div>

          {/* Why Choose Us */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-16"
          >
            <h2 className="text-3xl font-sans font-bold text-primary mb-8 text-center">
              Why Choose Lemach Hotel
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {whyChooseUs.map((item, index) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow"
                >
                  <div className="bg-gradient-to-r from-primary to-secondary w-16 h-16 rounded-full flex items-center justify-center mb-4">
                    <item.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">{item.title}</h3>
                  <p className="text-gray-600">{item.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Awards & Recognition */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-lg shadow-md p-8 mb-16"
          >
            <h2 className="text-3xl font-sans font-bold text-primary mb-8 text-center">
              Awards & Recognition
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {awards.map((award, index) => (
                <motion.div
                  key={award.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className="text-center p-6 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg"
                >
                  <div className="bg-gradient-to-r from-primary to-secondary w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <award.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-800 mb-2">{award.title}</h3>
                  <p className="text-sm text-gray-600">{award.organization}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Community Engagement */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-gradient-to-r from-primary to-secondary rounded-lg p-8 md:p-12 text-white mb-16"
          >
            <h2 className="text-3xl font-sans font-bold mb-6 text-center">
              Community Engagement
            </h2>
            <p className="text-lg mb-8 text-center opacity-90 max-w-3xl mx-auto">
              At Lemach Hotel, we believe in giving back to our community. We actively participate in local initiatives, support local businesses, and contribute to sustainable development in Kilifi County.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {communityInitiatives.map((initiative, index) => (
                <motion.div
                  key={initiative.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  className="bg-white/10 backdrop-blur-sm p-6 rounded-lg"
                >
                  <div className="bg-white/20 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                    <initiative.icon className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{initiative.title}</h3>
                  <p className="opacity-90">{initiative.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
