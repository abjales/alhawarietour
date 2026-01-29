import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AudioPlayer } from "@/components/AudioPlayer";
import { BookingDialog } from "@/components/BookingDialog";
import { useSingleMedia } from "@/hooks/useSiteMedia";
import heroImageFallback from "@/assets/hero-kaaba.jpg";

export const HeroSection = () => {
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const { media: heroMedia } = useSingleMedia("hero");

  const heroImage = heroMedia?.url || heroImageFallback;

  const scrollToServices = () => {
    document.getElementById("services")?.scrollIntoView({ behavior: "smooth" });
  };
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroImage}
          alt="The Holy Kaaba in Mecca"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-dark/90 via-emerald/80 to-emerald-dark/95" />
      </div>

      {/* Islamic Pattern Overlay */}
      <div className="absolute inset-0 z-[1] islamic-pattern-dark opacity-30" />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 pt-20 pb-16 text-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-6"
        >
          <span className="inline-block px-4 py-2 rounded-full bg-secondary/20 text-secondary text-sm font-medium border border-secondary/30 backdrop-blur-sm">
            Premium Hajj & Umrah Services from Ghana
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold text-primary-foreground mb-6 leading-tight"
        >
          Your Gateway to{" "}
          <span className="text-gradient-gold">the Holy Land</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-lg md:text-xl text-primary-foreground/80 max-w-2xl mx-auto mb-10"
        >
          Experience spiritual journeys with unparalleled care. From Accra to
          the Holy Sites, we handle every detail so you can focus on what
          matters most.
        </motion.p>

        {/* Audio Player */}
        <div className="mb-10">
          <AudioPlayer />
        </div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 1 }}
        >
          <Button variant="gold" size="xl" className="group" onClick={() => setIsBookingOpen(true)}>
            <span>Book Your Package</span>
            <motion.span
              className="inline-block ml-1"
              animate={{ x: [0, 4, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            >
              →
            </motion.span>
          </Button>
        </motion.div>

        {/* Booking Dialog */}
        <BookingDialog isOpen={isBookingOpen} onClose={() => setIsBookingOpen(false)} />

        {/* Scroll Indicator */}
        <motion.button
          onClick={scrollToServices}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-primary-foreground/60 hover:text-secondary transition-colors cursor-pointer"
          aria-label="Scroll to services"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          >
            <ChevronDown className="h-8 w-8" />
          </motion.div>
        </motion.button>
      </div>
    </section>
  );
};
