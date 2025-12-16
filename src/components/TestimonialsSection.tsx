import { motion } from "framer-motion";
import { Quote, Star } from "lucide-react";

const testimonials = [
  {
    name: "Fatima Mensah",
    location: "Accra, Ghana",
    text: "ALHAWARIE TOURS made my first Umrah truly unforgettable. Every detail was taken care of, from visa processing to comfortable accommodation near the Haram. I could focus entirely on my worship.",
    rating: 5,
  },
  {
    name: "Ibrahim Yusuf",
    location: "Kumasi, Ghana",
    text: "I traveled with my elderly parents for Hajj. The team's attention to their special needs was exceptional. The guides were knowledgeable and patient. Highly recommended!",
    rating: 5,
  },
  {
    name: "Amina Bello",
    location: "Tamale, Ghana",
    text: "This was my third time using ALHAWARIE TOURS, and they never disappoint. The premium package was worth every cedi. The hotel was literally steps from Masjid al-Haram.",
    rating: 5,
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

export const TestimonialsSection = () => {
  return (
    <section className="py-24 bg-background islamic-pattern">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            Testimonials
          </span>
          <h2 className="text-3xl md:text-5xl font-serif font-bold text-foreground mb-4">
            What Our <span className="text-primary">Pilgrims Say</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Hear from those who have experienced our services firsthand.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {testimonials.map((testimonial) => (
            <motion.div
              key={testimonial.name}
              variants={cardVariants}
              className="relative p-8 rounded-3xl bg-card border border-border hover:border-primary/30 transition-colors"
            >
              <Quote className="absolute top-6 right-6 w-10 h-10 text-primary/20" />
              <div className="flex gap-1 mb-4">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-secondary fill-secondary" />
                ))}
              </div>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                "{testimonial.text}"
              </p>
              <div>
                <p className="font-serif font-semibold text-foreground">
                  {testimonial.name}
                </p>
                <p className="text-sm text-muted-foreground">{testimonial.location}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
