import { motion } from "framer-motion";
import { Plane, FileCheck, Building2, Bus } from "lucide-react";
import pilgrimKaaba1 from "@/assets/pilgrim-kaaba-1.jpeg";
import pilgrimKaaba2 from "@/assets/pilgrim-kaaba-2.jpeg";
import pilgrimMecca from "@/assets/pilgrim-mecca.jpeg";
import carouselAccommodation from "@/assets/carousel-accommodation.jpg";

const services = [
  {
    icon: Plane,
    title: "Global Ticketing",
    description:
      "Seamless flight bookings from Ghana to Saudi Arabia with premium carriers. We secure the best routes and prices for your sacred journey.",
    image: pilgrimMecca,
  },
  {
    icon: FileCheck,
    title: "Visa Processing",
    description:
      "Complete visa handling with expert guidance through every requirement. Your documents, our responsibility.",
    image: pilgrimKaaba1,
  },
  {
    icon: Building2,
    title: "Accommodation",
    description:
      "Premium hotels within walking distance of the Holy Sites. Comfort and convenience for restful nights during your pilgrimage.",
    image: carouselAccommodation,
  },
  {
    icon: Bus,
    title: "Ground Transportation",
    description:
      "Reliable, air-conditioned transport between all sacred sites. Travel in comfort with experienced local drivers.",
    image: pilgrimKaaba2,
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.4, 0, 0.2, 1] as const,
    },
  },
};

export const ServicesSection = () => {
  return (
    <section id="services" className="py-24 bg-background islamic-pattern">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            Our Services
          </span>
          <h2 className="text-3xl md:text-5xl font-serif font-bold text-foreground mb-4">
            Everything You Need for a{" "}
            <span className="text-primary">Blessed Journey</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            From the moment you decide to embark on your pilgrimage until your
            safe return home, we take care of every detail.
          </p>
        </motion.div>

        {/* Featured Video */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <div className="card-elevated overflow-hidden max-w-4xl mx-auto">
            <video
              className="w-full aspect-video object-cover"
              controls
              poster={pilgrimKaaba1}
            >
              <source src="/videos/services-video.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              variants={cardVariants}
              className="card-elevated overflow-hidden group cursor-pointer"
            >
              <div className="h-40 overflow-hidden">
                <img
                  src={service.image}
                  alt={service.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <div className="p-6">
                <div className="mb-4 relative flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary transition-colors duration-300">
                    <service.icon className="h-6 w-6 text-primary group-hover:text-primary-foreground transition-colors duration-300" />
                  </div>
                  <h3 className="text-lg font-serif font-semibold text-foreground group-hover:text-primary transition-colors">
                    {service.title}
                  </h3>
                </div>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {service.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
