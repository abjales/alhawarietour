import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";
import ImageCarousel from "@/components/ImageCarousel";
import { ServicesSection } from "@/components/ServicesSection";
import { WhyChooseUsSection } from "@/components/WhyChooseUsSection";
import { Footer } from "@/components/Footer";
import { WhatsAppButton } from "@/components/WhatsAppButton";
const Index = () => {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <ImageCarousel />
      <ServicesSection />
      <WhyChooseUsSection />
      <Footer />
      <WhatsAppButton />
    </main>
  );
};

export default Index;
