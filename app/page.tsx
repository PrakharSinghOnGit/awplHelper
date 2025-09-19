import { Features } from "@/components/home/Features";
import { Footer } from "@/components/home/Footer";
import { Hero } from "@/components/home/Hero";
import { Pricing } from "@/components/home/Pricing";
import { Faq } from "@/components/home/FAQ";
import { Contact } from "@/components/home/Contact";

export default function Home() {
  return (
    <div className="pt-[var(--standalone)]">
      <div className="h-[var(--standalone)] top-0 z-50 w-full fixed backdrop-blur-lg" />
      <Hero />
      <Features />
      <Pricing />
      <Faq />
      <Contact />
      <Footer />
    </div>
  );
}
