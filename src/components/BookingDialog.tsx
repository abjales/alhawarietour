import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Calendar, Users, Plane, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface BookingDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BookingDialog = ({ isOpen, onClose }: BookingDialogProps) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    package_type: "",
    travel_date: "",
    number_of_pilgrims: 1,
    special_requests: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await supabase.from("bookings").insert([
        {
          full_name: formData.full_name.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
          package_type: formData.package_type,
          travel_date: formData.travel_date || null,
          number_of_pilgrims: formData.number_of_pilgrims,
          special_requests: formData.special_requests.trim() || null,
        },
      ]);

      if (error) throw error;

      setIsSuccess(true);
      toast({
        title: "Booking Request Submitted!",
        description: "We'll contact you within 24 hours to confirm your pilgrimage package.",
      });

      setTimeout(() => {
        onClose();
        setIsSuccess(false);
        setFormData({
          full_name: "",
          email: "",
          phone: "",
          package_type: "",
          travel_date: "",
          number_of_pilgrims: 1,
          special_requests: "",
        });
      }, 2000);
    } catch (error) {
      toast({
        title: "Submission Failed",
        description: "Please try again or contact us directly.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field: string, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto bg-card rounded-2xl shadow-2xl border border-border"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="sticky top-0 z-10 bg-emerald p-6 rounded-t-2xl">
              <button
                onClick={onClose}
                className="absolute top-4 right-4 text-primary-foreground/70 hover:text-primary-foreground transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-secondary/20 rounded-lg">
                  <Plane className="h-6 w-6 text-secondary" />
                </div>
                <div>
                  <h2 className="text-xl font-serif font-bold text-primary-foreground">
                    Book Your Package
                  </h2>
                  <p className="text-sm text-primary-foreground/70">
                    Begin your spiritual journey
                  </p>
                </div>
              </div>
            </div>

            {/* Success State */}
            {isSuccess ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-8 text-center"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring" }}
                  className="w-20 h-20 mx-auto mb-4 rounded-full bg-emerald/10 flex items-center justify-center"
                >
                  <CheckCircle className="h-10 w-10 text-emerald" />
                </motion.div>
                <h3 className="text-xl font-serif font-bold text-foreground mb-2">
                  Alhamdulillah!
                </h3>
                <p className="text-muted-foreground">
                  Your booking request has been received. We'll be in touch soon.
                </p>
              </motion.div>
            ) : (
              /* Form */
              <form onSubmit={handleSubmit} className="p-6 space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="full_name">Full Name *</Label>
                  <Input
                    id="full_name"
                    placeholder="Enter your full name"
                    value={formData.full_name}
                    onChange={(e) => handleChange("full_name", e.target.value)}
                    required
                    className="bg-background"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      value={formData.email}
                      onChange={(e) => handleChange("email", e.target.value)}
                      required
                      className="bg-background"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+233 XX XXX XXXX"
                      value={formData.phone}
                      onChange={(e) => handleChange("phone", e.target.value)}
                      required
                      className="bg-background"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="package_type">Package Type *</Label>
                  <Select
                    value={formData.package_type}
                    onValueChange={(value) => handleChange("package_type", value)}
                    required
                  >
                    <SelectTrigger className="bg-background">
                      <SelectValue placeholder="Select a package" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="umrah-economy">Umrah - Economy Package</SelectItem>
                      <SelectItem value="umrah-standard">Umrah - Standard Package</SelectItem>
                      <SelectItem value="umrah-premium">Umrah - Premium Package</SelectItem>
                      <SelectItem value="hajj-economy">Hajj - Economy Package</SelectItem>
                      <SelectItem value="hajj-standard">Hajj - Standard Package</SelectItem>
                      <SelectItem value="hajj-premium">Hajj - Premium Package</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="travel_date" className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Preferred Travel Date
                    </Label>
                    <Input
                      id="travel_date"
                      type="date"
                      value={formData.travel_date}
                      onChange={(e) => handleChange("travel_date", e.target.value)}
                      className="bg-background"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pilgrims" className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      Number of Pilgrims
                    </Label>
                    <Input
                      id="pilgrims"
                      type="number"
                      min={1}
                      max={50}
                      value={formData.number_of_pilgrims}
                      onChange={(e) =>
                        handleChange("number_of_pilgrims", parseInt(e.target.value) || 1)
                      }
                      className="bg-background"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="special_requests">Special Requests</Label>
                  <Textarea
                    id="special_requests"
                    placeholder="Any special requirements or questions..."
                    value={formData.special_requests}
                    onChange={(e) => handleChange("special_requests", e.target.value)}
                    className="bg-background min-h-[80px]"
                  />
                </div>

                <Button
                  type="submit"
                  variant="gold"
                  size="lg"
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <motion.span
                      animate={{ opacity: [1, 0.5, 1] }}
                      transition={{ repeat: Infinity, duration: 1 }}
                    >
                      Submitting...
                    </motion.span>
                  ) : (
                    "Submit Booking Request"
                  )}
                </Button>

                <p className="text-xs text-center text-muted-foreground">
                  By submitting, you agree to be contacted about your pilgrimage booking.
                </p>
              </form>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
