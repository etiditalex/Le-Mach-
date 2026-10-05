import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import AvailabilitySearch from "@/components/AvailabilitySearch";
import AboutTheHotel from "@/components/AboutTheHotel";
import Accommodation from "@/components/Accommodation";
import StayQuote from "@/components/StayQuote";
import DiningVenues from "@/components/DiningVenues";
import Experiences from "@/components/Experiences";
import GalleryGlimpse from "@/components/GalleryGlimpse";
import BookYourStay from "@/components/BookYourStay";

export const metadata: Metadata = {
  title: {
    absolute: "Lemach Hotel Kilifi | Hotel in Kilifi County, Kenya",
  },
  description:
    "Stay at Lemach Hotel in Kilifi, Kenya. Rooms, a restaurant and bar, meetings, gardens, and a pool, just off the B69 Highway in Kilifi County.",
  keywords: [
    "Lemach Hotel Kilifi",
    "hotel in Kilifi",
    "Kilifi hotel",
    "where to stay in Kilifi",
    "accommodation in Kilifi County",
    "Lemach Hotel",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Lemach Hotel Kilifi | Hotel in Kilifi County, Kenya",
    description:
      "Stay at Lemach Hotel in Kilifi, Kenya. Rooms, dining, meetings, gardens, and a pool, just off the B69 Highway.",
    url: "/",
  },
};

export default function Home() {
  return (
    <main className="w-full min-w-0 overflow-x-hidden">
      <Header />
      <Hero />
      <AvailabilitySearch />
      <AboutTheHotel />
      <Accommodation />
      <StayQuote />
      <DiningVenues />
      <Experiences />
      <GalleryGlimpse />
      <BookYourStay />
      <Footer />
    </main>
  );
}

