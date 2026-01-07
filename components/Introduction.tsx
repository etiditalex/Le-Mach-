"use client";

import { motion } from "framer-motion";

export default function Introduction() {
  return (
    <section className="bg-[#FDFBF8] py-16 md:py-24">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto text-center"
        >
          {/* Main Heading */}
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 font-sans">
            LUXURY HOTEL & ACCOMMODATION IN KILIFI COUNTY KENYA
          </h2>
          
          {/* Decorative Line */}
          <div className="w-24 h-1 bg-gradient-to-r from-primary to-secondary mx-auto mb-8"></div>

          {/* Body Text */}
          <div className="space-y-6 text-gray-700 text-lg md:text-xl leading-relaxed font-sans">
            <p>
              Get ready to experience the perfect blend of comfort, luxury, and authentic Kenyan hospitality at Le Mach Hotel & Accommodations, 
              one of the premier hotels in Kilifi County. Whether you're visiting for business, a family getaway, or a romantic retreat, 
              our hotel offers everything you need for a truly unforgettable stay.
            </p>
            
            <p>
              Nestled along the scenic B69 highway in the heart of Kilifi County, our hotel is one of the best accommodation options in the region. 
              Surrounded by the natural beauty of coastal Kenya, we're strategically located to provide easy access to the stunning beaches, 
              cultural attractions, and business centers that make Kilifi County a sought-after destination.
            </p>
            
            <p>
              With luxurious rooms and suites featuring modern amenities and elegant design, Le Mach Hotel is the ultimate accommodation choice in Kilifi County. 
              Whether you're relaxing by our swimming pool, indulging in exquisite dining at our restaurant, hosting events in our professional facilities, 
              or exploring the beautiful surroundings, every moment feels like a perfect escape.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

