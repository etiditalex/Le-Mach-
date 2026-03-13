"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

const showcaseItems = [
  {
    id: 1,
    title: "Luxurious Rooms & Accommodations",
    text: "Perfect for both families and solo travelers, each spacious room is thoughtfully designed to offer style and relaxation. Enjoy a private balcony with breathtaking views of Kilifi County, sparkling pools, or lush tropical gardens. Whether you're seeking a tranquil retreat or a luxurious escape in Kilifi, your journey to relaxation starts here!",
    image: "https://res.cloudinary.com/dyfnobo9r/image/upload/v1773405758/LEMACHGARDENS272of562_oerxub.jpg",
    link: "/rooms",
    linkText: "Find out more",
  },
  {
    id: 2,
    title: "Bar & Restaurant",
    text: "Indulge in exquisite dining experiences at our bar and restaurant, where local and international cuisine meets authentic Kenyan hospitality. Savor fresh ingredients, expertly prepared dishes, and a warm, inviting atmosphere that makes every meal a memorable occasion.",
    image: "https://res.cloudinary.com/dyfnobo9r/image/upload/v1773406091/LEMACHGARDENS190of562_sdatzg.jpg",
    link: "/bar-restaurant",
    linkText: "Find out more",
  },
  {
    id: 3,
    title: "Meetings & Events",
    text: "Host your professional conferences, celebrations, and special occasions in our versatile event spaces. With state-of-the-art facilities and dedicated event planning services, we ensure your meetings and celebrations are executed flawlessly.",
    image: "https://res.cloudinary.com/dyfnobo9r/image/upload/v1773406340/LEMACHGARDENS99of562_d80jsm.jpg",
    link: "/meetings-events",
    linkText: "Find out more",
  },
];

export default function RoomsShowcase() {
  return (
    <section className="bg-white py-12 md:py-16">
      {showcaseItems.map((item, index) => (
        <div key={item.id} className="container mx-auto px-4">
          <div className={index % 2 === 0 ? "flex flex-col md:flex-row max-w-7xl mx-auto" : "flex flex-col md:flex-row-reverse max-w-7xl mx-auto"}>
            {/* Text Section - Left */}
            <motion.div
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="w-full md:w-1/2 bg-white flex items-center justify-center p-8 md:p-12 lg:p-16"
            >
              <div className="max-w-xl">
                <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 font-sans">
                  {item.title}
                </h3>
                <p className="text-gray-900 text-lg md:text-xl leading-relaxed mb-6 font-sans">
                  {item.text}
                </p>
                <Link
                  href={item.link}
                  className="text-primary underline font-semibold text-lg hover:text-secondary transition-colors font-sans inline-block"
                >
                  {item.linkText}
                </Link>
              </div>
            </motion.div>

            {/* Image Section - Right */}
            <motion.div
              initial={{ opacity: 0, x: index % 2 === 0 ? 50 : -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="w-full md:w-1/2 relative h-96 md:h-[600px]"
            >
              <Image
                src={item.image}
                alt="Le Mach Hotel"
                fill
                className="object-cover"
                priority={index === 0}
              />
            </motion.div>
          </div>
        </div>
      ))}
    </section>
  );
}

