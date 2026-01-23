import { motion } from "framer-motion";
import { Check, Star, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BookingDialog } from "@/components/BookingDialog";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface Package {
  id: string;
  name: string;
  slug: string;
  duration: string;
  travel_date: string | null;
  makkah_days: number | null;
  madina_days: number | null;
  price_ghs: number | null;
  price_usd: number | null;
  features: string[];
  payment_details: {
    bank_name?: string;
    accounts?: { currency: string; account_number: string }[];
  } | null;
  popular: boolean;
  active: boolean;
}

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
  const [packages, setPackages] = useState<Package[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPackages = async () => {
      const { data, error } = await supabase
        .from("packages")
        .select("*")
        .eq("active", true)
        .order("popular", { ascending: false });

      if (!error && data) {
        setPackages(data as Package[]);
      }
      setIsLoading(false);
    };

    fetchPackages();
  }, []);

  const handleBookPackage = (packageName: string) => {
    const packageType = packageName.toLowerCase().includes("hajj") ? "Hajj" : "Umrah";
    setSelectedPackage(packageType);
    setBookingOpen(true);
  };

  const formatPrice = (pkg: Package) => {
    if (pkg.price_ghs && pkg.price_usd) {
      return `GHS ${pkg.price_ghs.toLocaleString()} / USD ${pkg.price_usd.toLocaleString()}`;
    }
    return null;
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

        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {packages.map((pkg) => (
              <motion.div
                key={pkg.id}
                variants={cardVariants}
                className={`relative rounded-3xl overflow-hidden bg-card border ${
                  pkg.popular ? "border-primary shadow-xl" : "border-border"
                }`}
              >
                {pkg.popular && (
                  <div className="absolute top-4 right-4 z-10 bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                    <Star className="w-4 h-4 fill-current" />
                    Featured
                  </div>
                )}
                <div className="p-6">
                  <div className="mb-4">
                    <h3 className="text-xl font-serif font-semibold text-foreground">
                      {pkg.name}
                    </h3>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <span className="text-sm text-muted-foreground">{pkg.duration}</span>
                      {pkg.makkah_days && pkg.madina_days && (
                        <span className="text-sm text-muted-foreground">
                          ({pkg.makkah_days} days Makkah, {pkg.madina_days} days Madina)
                        </span>
                      )}
                    </div>
                    {pkg.travel_date && (
                      <p className="text-sm font-medium text-primary mt-2">
                        Travel Date: {pkg.travel_date}
                      </p>
                    )}
                  </div>

                  {formatPrice(pkg) && (
                    <div className="mb-4 p-3 bg-primary/5 rounded-lg">
                      <p className="text-lg font-bold text-primary">{formatPrice(pkg)}</p>
                    </div>
                  )}

                  <ul className="space-y-2 mb-6">
                    {pkg.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Check className="w-4 h-4 text-primary flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  {pkg.payment_details && pkg.payment_details.accounts && (
                    <div className="mb-6 p-3 bg-muted rounded-lg">
                      <p className="text-sm font-medium text-foreground mb-2">
                        Payment Details - {pkg.payment_details.bank_name}
                      </p>
                      <div className="space-y-1">
                        {pkg.payment_details.accounts.map((account) => (
                          <p key={account.currency} className="text-xs text-muted-foreground">
                            {account.currency}: {account.account_number}
                          </p>
                        ))}
                      </div>
                    </div>
                  )}

                  <Button
                    onClick={() => handleBookPackage(pkg.name)}
                    className={`w-full ${pkg.popular ? "" : "variant-outline"}`}
                    variant={pkg.popular ? "default" : "outline"}
                  >
                    Book This Package
                  </Button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      <BookingDialog
        isOpen={bookingOpen}
        onClose={() => setBookingOpen(false)}
      />
    </section>
  );
};
