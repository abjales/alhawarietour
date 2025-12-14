import { motion } from "framer-motion";
import { Heart, Shield, Sparkles } from "lucide-react";

const features = [
  {
    icon: Heart,
    title: "Ghanaian Hospitality",
    description:
      "Experience the warmth of home even while abroad. Our team speaks your language and understands your needs, providing culturally sensitive care throughout your journey.",
    color: "text-rose-500",
    bgColor: "bg-rose-500/10",
  },
  {
    icon: Shield,
    title: "Stress-Free Logistics",
    description:
      "From document preparation to daily schedules, every aspect is meticulously planned. Travel with confidence knowing experienced professionals handle every detail.",
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    icon: Sparkles,
    title: "Spiritual Focus",
    description:
      "Your pilgrimage should be a time of devotion, not worry. We create the perfect environment for you to connect deeply with your faith and spiritual purpose.",
    color: "text-secondary",
    bgColor: "bg-secondary/20",
  },
];

export const WhyChooseUsSection = () => {
  return (
    <section className="py-24 bg-primary relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-secondary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-secondary/20 text-secondary text-sm font-medium mb-4">
            Why Choose Us
          </span>
          <h2 className="text-3xl md:text-5xl font-serif font-bold text-primary-foreground mb-4">
            The <span className="text-gradient-gold">ALHAWARIE</span> Difference
          </h2>
          <p className="text-primary-foreground/70 max-w-2xl mx-auto text-lg">
            For years, we've been Ghana's trusted partner for sacred journeys.
            Here's what sets us apart.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              className="relative group"
            >
              <div className="bg-primary-foreground/5 backdrop-blur-sm rounded-2xl p-8 border border-primary-foreground/10 hover:border-secondary/50 transition-all duration-500 h-full">
                <motion.div
                  whileHover={{ rotate: 5, scale: 1.1 }}
                  className={`w-14 h-14 rounded-xl ${feature.bgColor} flex items-center justify-center mb-6`}
                >
                  <feature.icon className={`h-7 w-7 ${feature.color}`} />
                </motion.div>
                <h3 className="text-xl font-serif font-semibold text-primary-foreground mb-3">
                  {feature.title}
                </h3>
                <p className="text-primary-foreground/70 leading-relaxed">
                  {feature.description}
                </p>
              </div>

              {/* Decorative line */}
              {index < features.length - 1 && (
                <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-px bg-gradient-to-r from-secondary/50 to-transparent" />
              )}
            </motion.div>
          ))}
        </div>

        {/* Trust indicators */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-16 flex flex-wrap justify-center gap-8 text-primary-foreground/60"
        >
          <div className="text-center">
            <div className="text-3xl font-serif font-bold text-secondary">500+</div>
            <div className="text-sm">Happy Pilgrims</div>
          </div>
          <div className="w-px h-12 bg-primary-foreground/20" />
          <div className="text-center">
            <div className="text-3xl font-serif font-bold text-secondary">10+</div>
            <div className="text-sm">Years Experience</div>
          </div>
          <div className="w-px h-12 bg-primary-foreground/20" />
          <div className="text-center">
            <div className="text-3xl font-serif font-bold text-secondary">100%</div>
            <div className="text-sm">Satisfaction Rate</div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
