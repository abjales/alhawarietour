import { motion } from "framer-motion";
import { Check, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BookingDialog } from "@/components/BookingDialog";
import { useState } from "react";
import pilgrimKaaba1 from "@/assets/pilgrim-kaaba-1.jpeg";
import pilgrimKaaba2 from "@/assets/pilgrim-kaaba-2.jpeg";
import pilgrimMecca from "@/assets/pilgrim-mecca.jpeg";

const packages = [
  {
    name: "Umrah Essential",
    price: "From $2,500",
    duration: "10 Days",
    image: pilgrimMecca,
    type: "Umrah",
    features: [
      "Return flights from Ghana",
      "3-star hotel accommodation",
      "Visa processing",
      "Ground transportation",
      "Guided Umrah rituals",
    ],
    popular: false,
  },
  {
    name: "Umrah Premium",
    price: "From $4,200",
    duration: "14 Days",
    image: pilgrimKaaba1,
    type: "Umrah",
    features: [
      "Return flights from Ghana",
      "5-star hotel near Haram",
      "Visa processing",
      "Private transportation",
      "Personal guide",
      "Ziyarat tours included",
    ],
    popular: true,
  },
  {
    name: "Hajj Complete",
    price: "From $8,500",
    duration: "21 Days",
    image: pilgrimKaaba2,
    type: "Hajj",
    features: [
      "Return flights from Ghana",
      "Premium accommodation",
      "Full Hajj visa support",
      "All transportation",
      "Experienced guide",
      "Meals included",
      "Mina & Arafat camps",
    ],
    popular: false,
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] as const },
  },
};

export const PackagesSection = () => {
  const [bookingOpen, setBookingOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<string>("Umrah");

  const handleBookPackage = (packageType: string) => {
    setSelectedPackage(packageType);
    setBookingOpen(true);
  };

  return (
    <section id="packages" className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            Our Packages
          </span>
          <h2 className="text-3xl md:text-5xl font-serif font-bold text-foreground mb-4">
            Choose Your <span className="text-primary">Pilgrimage Package</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Carefully curated packages to suit every budget and preference.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {packages.map((pkg) => (
            <motion.div
              key={pkg.name}
              variants={cardVariants}
              className={`relative rounded-3xl overflow-hidden bg-card border ${
                pkg.popular ? "border-primary shadow-xl" : "border-border"
              }`}
            >
              {pkg.popular && (
                <div className="absolute top-4 right-4 z-10 bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                  <Star className="w-4 h-4 fill-current" />
                  Most Popular
                </div>
              )}
              <div className="h-48 overflow-hidden">
                <img
                  src={pkg.image}
                  alt={pkg.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xl font-serif font-semibold text-foreground">
                    {pkg.name}
                  </h3>
                  <span className="text-sm text-muted-foreground">{pkg.duration}</span>
                </div>
                <p className="text-2xl font-bold text-primary mb-4">{pkg.price}</p>
                <ul className="space-y-2 mb-6">
                  {pkg.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Check className="w-4 h-4 text-primary flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button
                  onClick={() => handleBookPackage(pkg.type)}
                  className={`w-full ${pkg.popular ? "" : "variant-outline"}`}
                  variant={pkg.popular ? "default" : "outline"}
                >
                  Book This Package
                </Button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      <BookingDialog
        isOpen={bookingOpen}
        onClose={() => setBookingOpen(false)}
      />
    </section>
  );
};
