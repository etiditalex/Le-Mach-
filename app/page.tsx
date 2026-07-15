import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import Introduction from "@/components/Introduction";
import CrispyFoodShowcase from "@/components/CrispyFoodShowcase";
import RoomsShowcase from "@/components/RoomsShowcase";
import PhotoCarousel from "@/components/PhotoCarousel";
import WhyBookDirectly from "@/components/WhyBookDirectly";
import FAQs from "@/components/FAQs";

export const metadata: Metadata = {
  title: "Home",
  description:
    "Lemach Hotel & Accommodations - Luxury hotel in Kilifi County, Kenya. Rooms, dining, events, and hospitality.",
  openGraph: {
    title: "Lemach Hotel & Accommodations - Kilifi County, Kenya",
    description:
      "Luxury hotel and accommodations in Kilifi County, Kenya. Experience world-class hospitality, dining, and events.",
    url: "https://lemach.co.ke",
  },
};

export default function Home() {
  return (
    <main className="w-full min-w-0 overflow-x-hidden">
      <Header />
      <Hero />
      <Introduction />
      <CrispyFoodShowcase />
      <RoomsShowcase />
      <PhotoCarousel />
      <WhyBookDirectly />
      <FAQs />
      <Footer />
    </main>
  );
}

