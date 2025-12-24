import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import Offers from "@/components/Offers";
import Testimonials from "@/components/Testimonials";
import StickyBanner from "@/components/StickyBanner";

export default function Home() {
  return (
    <main>
      <Header />
      <Hero />
      <StickyBanner />
      <Services />
      <Offers />
      <Testimonials />
      <Footer />
    </main>
  );
}

