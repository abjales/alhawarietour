import { useState, useCallback, useEffect, useMemo } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useSiteMedia } from "@/hooks/useSiteMedia";

// Fallback static images
import carouselKaaba from "@/assets/carousel-kaaba.jpg";
import carouselMedina from "@/assets/carousel-medina.jpg";
import carouselPilgrims from "@/assets/carousel-pilgrims.jpg";
import carouselAccommodation from "@/assets/carousel-accommodation.jpg";
import pilgrimKaaba1 from "@/assets/pilgrim-kaaba-1.jpeg";
import pilgrimKaaba2 from "@/assets/pilgrim-kaaba-2.jpeg";
import pilgrimMecca from "@/assets/pilgrim-mecca.jpeg";

const fallbackSlides = [
  {
    image: carouselKaaba,
    headline: "Experience the Sacred Journey",
    subheadline: "Join thousands of pilgrims in the holy rituals of Hajj and Umrah",
    alt: "Holy Kaaba surrounded by pilgrims during Hajj",
  },
  {
    image: pilgrimKaaba1,
    headline: "Your Journey Begins Here",
    subheadline: "Stand before the Holy Kaaba and fulfill your spiritual calling",
    alt: "Pilgrim standing before the Holy Kaaba",
  },
  {
    image: carouselMedina,
    headline: "Visit Al-Masjid an-Nabawi",
    subheadline: "Walk in the footsteps of the Prophet (PBUH) in the blessed city of Medina",
    alt: "Prophet's Mosque in Medina at sunset",
  },
  {
    image: pilgrimKaaba2,
    headline: "Creating Memories That Last",
    subheadline: "Travel with your loved ones on this life-changing spiritual journey",
    alt: "Pilgrims together at the Holy Kaaba",
  },
  {
    image: carouselAccommodation,
    headline: "Comfort Meets Devotion",
    subheadline: "Stay in premium accommodations just steps away from the Holy Sites",
    alt: "Luxury hotel accommodation near Holy Sites",
  },
  {
    image: pilgrimMecca,
    headline: "Experience the Holy City",
    subheadline: "Immerse yourself in the spiritual atmosphere of Mecca",
    alt: "Pilgrim in the streets of Mecca",
  },
];

const ImageCarousel = () => {
  const { media: dynamicMedia, isLoading } = useSiteMedia("carousel");

  // Use dynamic media if available, otherwise fall back to static slides
  const slides = useMemo(() => {
    if (dynamicMedia.length > 0) {
      return dynamicMedia.map((item) => ({
        image: item.url,
        headline: item.headline || "Experience the Sacred Journey",
        subheadline: item.subheadline || "Join thousands of pilgrims in the holy rituals of Hajj and Umrah",
        alt: item.alt_text || item.name,
      }));
    }
    return fallbackSlides;
  }, [dynamicMedia]);

  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [
    Autoplay({ delay: 4000, stopOnInteraction: false, stopOnMouseEnter: true }),
  ]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);
  const scrollTo = useCallback((index: number) => emblaApi?.scrollTo(index), [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi, onSelect]);

  return (
    <section className="relative w-full overflow-hidden bg-primary">
      {/* Carousel Container */}
      <div ref={emblaRef} className="overflow-hidden">
        <div className="flex touch-pan-y">
          {slides.map((slide, index) => (
            <div
              key={index}
              className="relative min-w-0 flex-[0_0_100%]"
            >
              {/* Image with lazy loading */}
              <div className="relative h-[50vh] md:h-[60vh] lg:h-[70vh]">
                <img
                  src={slide.image}
                  alt={slide.alt}
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover"
                />
                
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/60 to-primary/30" />
                <div className="absolute inset-0 bg-gradient-to-r from-primary/50 via-transparent to-primary/50" />
                
                {/* Text Content */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="container mx-auto px-4">
                    <AnimatePresence mode="wait">
                      {selectedIndex === index && (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 30 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -30 }}
                          transition={{ duration: 0.5, ease: "easeOut" }}
                          className="text-center max-w-4xl mx-auto"
                        >
                          <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2, duration: 0.5 }}
                            className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-serif font-bold text-primary-foreground mb-4 md:mb-6 drop-shadow-lg"
                          >
                            {slide.headline}
                          </motion.h2>
                          <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4, duration: 0.5 }}
                            className="text-lg md:text-xl lg:text-2xl text-primary-foreground/90 font-sans drop-shadow-md"
                          >
                            {slide.subheadline}
                          </motion.p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={scrollPrev}
        className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 rounded-full bg-primary-foreground/10 backdrop-blur-sm border border-primary-foreground/20 flex items-center justify-center text-primary-foreground hover:bg-primary-foreground/20 transition-all duration-300 group"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-5 h-5 md:w-6 md:h-6 group-hover:-translate-x-0.5 transition-transform" />
      </button>
      <button
        onClick={scrollNext}
        className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 rounded-full bg-primary-foreground/10 backdrop-blur-sm border border-primary-foreground/20 flex items-center justify-center text-primary-foreground hover:bg-primary-foreground/20 transition-all duration-300 group"
        aria-label="Next slide"
      >
        <ChevronRight className="w-5 h-5 md:w-6 md:h-6 group-hover:translate-x-0.5 transition-transform" />
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 flex gap-2 md:gap-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => scrollTo(index)}
            className={`w-2 h-2 md:w-3 md:h-3 rounded-full transition-all duration-300 ${
              selectedIndex === index
                ? "bg-secondary w-6 md:w-8"
                : "bg-primary-foreground/40 hover:bg-primary-foreground/60"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Decorative Elements */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
};

export default ImageCarousel;
