import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import Introduction from "@/components/Introduction";
import RoomsShowcase from "@/components/RoomsShowcase";
import Reviews from "@/components/Reviews";
import FAQs from "@/components/FAQs";

export default function Home() {
  return (
    <main>
      <Header />
      <Hero />
      <Introduction />
      <RoomsShowcase />
      <Reviews />
      <FAQs />
      <Footer />
    </main>
  );
}

