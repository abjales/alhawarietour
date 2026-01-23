import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Plus,
  Pencil,
  Trash2,
  Loader2,
  Package,
  X,
  Save,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface PackageData {
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

const emptyPackage: Omit<PackageData, "id"> = {
  name: "",
  slug: "",
  duration: "",
  travel_date: null,
  makkah_days: null,
  madina_days: null,
  price_ghs: null,
  price_usd: null,
  features: [],
  payment_details: null,
  popular: false,
  active: true,
};

export const PackagesManager = () => {
  const { toast } = useToast();
  const [packages, setPackages] = useState<PackageData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPackage, setEditingPackage] = useState<PackageData | null>(null);
  const [formData, setFormData] = useState<Omit<PackageData, "id">>(emptyPackage);
  const [featuresText, setFeaturesText] = useState("");
  const [paymentDetailsText, setPaymentDetailsText] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from("packages")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast({
        title: "Error fetching packages",
        description: error.message,
        variant: "destructive",
      });
    } else {
      setPackages((data || []) as PackageData[]);
    }
    setIsLoading(false);
  };

  const openCreateDialog = () => {
    setEditingPackage(null);
    setFormData(emptyPackage);
    setFeaturesText("");
    setPaymentDetailsText("");
    setIsDialogOpen(true);
  };

  const openEditDialog = (pkg: PackageData) => {
    setEditingPackage(pkg);
    setFormData({
      name: pkg.name,
      slug: pkg.slug,
      duration: pkg.duration,
      travel_date: pkg.travel_date,
      makkah_days: pkg.makkah_days,
      madina_days: pkg.madina_days,
      price_ghs: pkg.price_ghs,
      price_usd: pkg.price_usd,
      features: pkg.features,
      payment_details: pkg.payment_details,
      popular: pkg.popular,
      active: pkg.active,
    });
    setFeaturesText(pkg.features.join("\n"));
    setPaymentDetailsText(
      pkg.payment_details
        ? JSON.stringify(pkg.payment_details, null, 2)
        : ""
    );
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    if (!formData.name || !formData.slug || !formData.duration) {
      toast({
        title: "Validation Error",
        description: "Name, slug, and duration are required",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);

    const features = featuresText
      .split("\n")
      .map((f) => f.trim())
      .filter((f) => f.length > 0);

    let paymentDetails = null;
    if (paymentDetailsText.trim()) {
      try {
        paymentDetails = JSON.parse(paymentDetailsText);
      } catch {
        toast({
          title: "Invalid JSON",
          description: "Payment details must be valid JSON",
          variant: "destructive",
        });
        setIsSaving(false);
        return;
      }
    }

    const packageData = {
      ...formData,
      features,
      payment_details: paymentDetails,
    };

    if (editingPackage) {
      const { error } = await supabase
        .from("packages")
        .update(packageData)
        .eq("id", editingPackage.id);

      if (error) {
        toast({
          title: "Error updating package",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({ title: "Package updated successfully" });
        fetchPackages();
        setIsDialogOpen(false);
      }
    } else {
      const { error } = await supabase.from("packages").insert(packageData);

      if (error) {
        toast({
          title: "Error creating package",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({ title: "Package created successfully" });
        fetchPackages();
        setIsDialogOpen(false);
      }
    }

    setIsSaving(false);
  };

  const deletePackage = async (id: string) => {
    const { error } = await supabase.from("packages").delete().eq("id", id);

    if (error) {
      toast({
        title: "Error deleting package",
        description: error.message,
        variant: "destructive",
      });
    } else {
      setPackages((prev) => prev.filter((p) => p.id !== id));
      toast({ title: "Package deleted" });
    }
  };

  const toggleActive = async (pkg: PackageData) => {
    const { error } = await supabase
      .from("packages")
      .update({ active: !pkg.active })
      .eq("id", pkg.id);

    if (error) {
      toast({
        title: "Error updating package",
        description: error.message,
        variant: "destructive",
      });
    } else {
      setPackages((prev) =>
        prev.map((p) => (p.id === pkg.id ? { ...p, active: !p.active } : p))
      );
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold">Packages Management</h2>
          <p className="text-sm text-muted-foreground">
            Create and manage pilgrimage packages
          </p>
        </div>
        <Button onClick={openCreateDialog}>
          <Plus className="h-4 w-4 mr-2" />
          Add Package
        </Button>
      </div>

      {isLoading ? (
        <div className="p-8 text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
        </div>
      ) : packages.length === 0 ? (
        <div className="p-8 text-center text-muted-foreground">
          <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>No packages yet. Create your first package.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {packages.map((pkg) => (
                <TableRow key={pkg.id}>
                  <TableCell>
                    <div>
                      <span className="font-medium">{pkg.name}</span>
                      {pkg.popular && (
                        <Badge variant="default" className="ml-2">
                          Featured
                        </Badge>
                      )}
                      {pkg.travel_date && (
                        <p className="text-xs text-muted-foreground mt-1">
                          {pkg.travel_date}
                        </p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{pkg.duration}</TableCell>
                  <TableCell>
                    {pkg.price_ghs
                      ? `GHS ${pkg.price_ghs.toLocaleString()}`
                      : "—"}
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={pkg.active}
                      onCheckedChange={() => toggleActive(pkg)}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openEditDialog(pkg)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:text-destructive"
                        onClick={() => deletePackage(pkg.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingPackage ? "Edit Package" : "Create Package"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Package Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Umrah Exclusives - Ramadan 2026"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="slug">Slug *</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) =>
                    setFormData({ ...formData, slug: e.target.value })
                  }
                  placeholder="umrah-ramadan-2026"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="duration">Duration *</Label>
                <Input
                  id="duration"
                  value={formData.duration}
                  onChange={(e) =>
                    setFormData({ ...formData, duration: e.target.value })
                  }
                  placeholder="10 days total"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="travel_date">Travel Date</Label>
                <Input
                  id="travel_date"
                  value={formData.travel_date || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, travel_date: e.target.value || null })
                  }
                  placeholder="5th March 2026 (15th of Ramadan 1447H)"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="makkah_days">Makkah Days</Label>
                <Input
                  id="makkah_days"
                  type="number"
                  value={formData.makkah_days || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      makkah_days: e.target.value ? parseInt(e.target.value) : null,
                    })
                  }
                  placeholder="7"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="madina_days">Madina Days</Label>
                <Input
                  id="madina_days"
                  type="number"
                  value={formData.madina_days || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      madina_days: e.target.value ? parseInt(e.target.value) : null,
                    })
                  }
                  placeholder="3"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price_ghs">Price (GHS)</Label>
                <Input
                  id="price_ghs"
                  type="number"
                  value={formData.price_ghs || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      price_ghs: e.target.value ? parseFloat(e.target.value) : null,
                    })
                  }
                  placeholder="28000"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="price_usd">Price (USD)</Label>
                <Input
                  id="price_usd"
                  type="number"
                  value={formData.price_usd || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      price_usd: e.target.value ? parseFloat(e.target.value) : null,
                    })
                  }
                  placeholder="2600"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="features">Features (one per line)</Label>
              <Textarea
                id="features"
                value={featuresText}
                onChange={(e) => setFeaturesText(e.target.value)}
                placeholder="Umrah Visa&#10;International Flight Ticket&#10;10 Days Hotel Accommodation"
                rows={5}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="payment_details">Payment Details (JSON)</Label>
              <Textarea
                id="payment_details"
                value={paymentDetailsText}
                onChange={(e) => setPaymentDetailsText(e.target.value)}
                placeholder='{"bank_name": "Guaranty Trust Bank", "accounts": [{"currency": "GHS", "account_number": "1234567890"}]}'
                rows={4}
                className="font-mono text-sm"
              />
            </div>

            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Switch
                  id="popular"
                  checked={formData.popular}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, popular: checked })
                  }
                />
                <Label htmlFor="popular">Featured Package</Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  id="active"
                  checked={formData.active}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, active: checked })
                  }
                />
                <Label htmlFor="active">Active</Label>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              {editingPackage ? "Update" : "Create"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
