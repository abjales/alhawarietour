import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";
import ImageCarousel from "@/components/ImageCarousel";
import { ServicesSection } from "@/components/ServicesSection";
import { PackagesSection } from "@/components/PackagesSection";
import { TestimonialsSection } from "@/components/TestimonialsSection";
import { WhyChooseUsSection } from "@/components/WhyChooseUsSection";
import { Footer } from "@/components/Footer";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { AIChatAssistant } from "@/components/AIChatAssistant";

const Index = () => {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <ImageCarousel />
      <ServicesSection />
      <PackagesSection />
      <TestimonialsSection />
      <WhyChooseUsSection />
      <Footer />
      <WhatsAppButton />
      <AIChatAssistant />
    </main>
  );
};

export default Index;
