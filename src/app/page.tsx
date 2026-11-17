import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/sections/HeroSection";
import MenuSection from "@/components/sections/MenuSection";
import CateringSection from "@/components/sections/CateringSection";
import ReviewsSection from "@/components/sections/ReviewsSection";
import LocationSection from "@/components/sections/LocationSection";
import WhatsAppCartDrawer from "@/components/ui/WhatsAppCartDrawer";

export default function Home() {
  return (
    <>
      <a
        href="#menu"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[70] focus:rounded-full focus:bg-neutral-900 focus:px-4 focus:py-2 focus:text-sm focus:text-neutral-50"
      >
        Skip to menu
      </a>
      <Navbar />
      <main>
        <HeroSection />
        <MenuSection />
        <CateringSection />
        <ReviewsSection />
        <LocationSection />
      </main>
      <Footer />
      <WhatsAppCartDrawer />
    </>
  );
}
