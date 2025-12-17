import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Shield, Home, Briefcase, Info, Phone, LucideIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import logo from "@/assets/logo.jpeg";

const navLinks: { label: string; href: string; icon: LucideIcon }[] = [
  { label: "Home", href: "#", icon: Home },
  { label: "Services", href: "#services", icon: Briefcase },
  { label: "About", href: "#about", icon: Info },
  { label: "Contact", href: "#contact", icon: Phone },
];

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, isAdmin } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-background/95 backdrop-blur-md shadow-md py-3"
            : "bg-transparent py-5"
        }`}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <a href="#" className="flex items-center gap-2">
              <img 
                src={logo} 
                alt="Alhawarie Tours Logo" 
                className="h-10 md:h-12 w-auto"
              />
              <span
                className={`text-lg md:text-xl font-serif font-bold transition-colors ${
                  isScrolled ? "text-primary" : "text-primary-foreground"
                }`}
              >
                <span className="text-secondary">ALHAWARIE</span>{" "}
                TOURS
              </span>
            </a>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className={`group font-medium transition-all duration-300 hover:text-secondary flex items-center gap-1.5 ${
                    isScrolled
                      ? "text-foreground/80"
                      : "text-primary-foreground/80"
                  }`}
                >
                  <link.icon className="h-4 w-4 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6" />
                  {link.label}
                </a>
              ))}
              {user && isAdmin && (
                <Link
                  to="/admin"
                  className={`font-medium transition-colors hover:text-secondary flex items-center gap-1 ${
                    isScrolled
                      ? "text-foreground/80"
                      : "text-primary-foreground/80"
                  }`}
                >
                  <Shield className="h-4 w-4" />
                  Admin
                </Link>
              )}
              {!user && (
                <Link to="/auth">
                  <Button
                    variant="ghost"
                    size="sm"
                    className={isScrolled ? "text-foreground" : "text-primary-foreground"}
                  >
                    Login
                  </Button>
                </Link>
              )}
              <Button
                variant={isScrolled ? "default" : "gold"}
                size="default"
              >
                Book Now
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`md:hidden p-2 ${
                isScrolled ? "text-foreground" : "text-primary-foreground"
              }`}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-background pt-20 md:hidden"
          >
            <div className="container mx-auto px-4 py-8">
              <div className="flex flex-col gap-6">
                {navLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="group text-2xl font-serif font-semibold text-foreground hover:text-primary transition-all duration-300 flex items-center gap-3"
                  >
                    <link.icon className="h-6 w-6 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6" />
                    {link.label}
                  </a>
                ))}
                {user && isAdmin && (
                  <Link
                    to="/admin"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-2xl font-serif font-semibold text-foreground hover:text-primary transition-colors flex items-center gap-2"
                  >
                    <Shield className="h-5 w-5" />
                    Admin
                  </Link>
                )}
                {!user && (
                  <Link
                    to="/auth"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-2xl font-serif font-semibold text-foreground hover:text-primary transition-colors"
                  >
                    Login
                  </Link>
                )}
                <Button variant="gold" size="lg" className="mt-4">
                  Book Now
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
