import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload,
  Trash2,
  Image as ImageIcon,
  Video,
  Loader2,
  Plus,
  Eye,
  EyeOff,
  GripVertical,
} from "lucide-react";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { MEDIA_PURPOSES, type MediaPurpose, type SiteMedia } from "@/hooks/useSiteMedia";

export const MediaManager = () => {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [mediaItems, setMediaItems] = useState<SiteMedia[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [filterPurpose, setFilterPurpose] = useState<string>("all");

  // Form state
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    purpose: "" as MediaPurpose | "",
    alt_text: "",
    headline: "",
    subheadline: "",
    display_order: 0,
  });

  useEffect(() => {
    fetchAllMedia();
  }, []);

  const fetchAllMedia = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from("site_media")
      .select("*")
      .order("purpose")
      .order("display_order", { ascending: true });

    if (error) {
      toast({
        title: "Error fetching media",
        description: error.message,
        variant: "destructive",
      });
    } else {
      setMediaItems((data as SiteMedia[]) || []);
    }
    setIsLoading(false);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const isImage = file.type.startsWith("image/");
    const isVideo = file.type.startsWith("video/");

    if (!isImage && !isVideo) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image or video file",
        variant: "destructive",
      });
      return;
    }

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    
    // Auto-set name from filename
    if (!formData.name) {
      setFormData((prev) => ({
        ...prev,
        name: file.name.replace(/\.[^/.]+$/, ""),
      }));
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !formData.purpose) {
      toast({
        title: "Missing information",
        description: "Please select a file and choose a purpose",
        variant: "destructive",
      });
      return;
    }

    const purposeConfig = MEDIA_PURPOSES.find((p) => p.value === formData.purpose);
    const isImage = selectedFile.type.startsWith("image/");
    const isVideo = selectedFile.type.startsWith("video/");

    // Validate media type matches purpose
    if (purposeConfig) {
      if (purposeConfig.type === "image" && !isImage) {
        toast({
          title: "Wrong file type",
          description: `${purposeConfig.label} requires an image file`,
          variant: "destructive",
        });
        return;
      }
      if (purposeConfig.type === "video" && !isVideo) {
        toast({
          title: "Wrong file type",
          description: `${purposeConfig.label} requires a video file`,
          variant: "destructive",
        });
        return;
      }
    }

    setIsUploading(true);

    try {
      // Upload file to storage
      const fileExt = selectedFile.name.split(".").pop();
      const fileName = `${formData.purpose}/${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("site-media")
        .upload(fileName, selectedFile);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: urlData } = supabase.storage
        .from("site-media")
        .getPublicUrl(fileName);

      // Insert record into site_media table
      const { error: insertError } = await supabase.from("site_media").insert({
        name: formData.name,
        media_type: isImage ? "image" : "video",
        purpose: formData.purpose,
        url: urlData.publicUrl,
        alt_text: formData.alt_text || null,
        headline: formData.headline || null,
        subheadline: formData.subheadline || null,
        display_order: formData.display_order,
        active: true,
      });

      if (insertError) throw insertError;

      toast({ title: "Media uploaded successfully" });
      resetForm();
      setIsDialogOpen(false);
      fetchAllMedia();
    } catch (error: any) {
      toast({
        title: "Upload failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const toggleActive = async (id: string, currentActive: boolean) => {
    const { error } = await supabase
      .from("site_media")
      .update({ active: !currentActive })
      .eq("id", id);

    if (error) {
      toast({
        title: "Error updating media",
        description: error.message,
        variant: "destructive",
      });
    } else {
      setMediaItems((prev) =>
        prev.map((m) => (m.id === id ? { ...m, active: !currentActive } : m))
      );
      toast({ title: currentActive ? "Media hidden" : "Media visible" });
    }
  };

  const deleteMedia = async (id: string, url: string) => {
    try {
      // Extract file path from URL
      const urlParts = url.split("/site-media/");
      const filePath = urlParts[1];

      // Delete from storage
      if (filePath) {
        await supabase.storage.from("site-media").remove([filePath]);
      }

      // Delete from database
      const { error } = await supabase.from("site_media").delete().eq("id", id);

      if (error) throw error;

      setMediaItems((prev) => prev.filter((m) => m.id !== id));
      toast({ title: "Media deleted" });
    } catch (error: any) {
      toast({
        title: "Error deleting media",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setFormData({
      name: "",
      purpose: "",
      alt_text: "",
      headline: "",
      subheadline: "",
      display_order: 0,
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const filteredMedia = filterPurpose === "all" 
    ? mediaItems 
    : mediaItems.filter((m) => m.purpose === filterPurpose);

  const getPurposeLabel = (purpose: string) => {
    return MEDIA_PURPOSES.find((p) => p.value === purpose)?.label || purpose;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Site Media</h2>
          <p className="text-sm text-muted-foreground">
            Manage images and videos displayed on the website
          </p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add Media
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Upload New Media</DialogTitle>
            </DialogHeader>

            <div className="space-y-4 pt-4">
              {/* File Input */}
              <div className="space-y-2">
                <Label>File</Label>
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-border rounded-lg p-6 text-center cursor-pointer hover:border-emerald/50 transition-colors"
                >
                  {previewUrl ? (
                    selectedFile?.type.startsWith("video/") ? (
                      <video
                        src={previewUrl}
                        className="max-h-40 mx-auto rounded"
                        controls
                      />
                    ) : (
                      <img
                        src={previewUrl}
                        alt="Preview"
                        className="max-h-40 mx-auto rounded object-contain"
                      />
                    )
                  ) : (
                    <div className="text-muted-foreground">
                      <Upload className="h-8 w-8 mx-auto mb-2" />
                      <p>Click to upload image or video</p>
                    </div>
                  )}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*,video/*"
                  className="hidden"
                  onChange={handleFileSelect}
                />
              </div>

              {/* Name */}
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, name: e.target.value }))
                  }
                  placeholder="e.g., Kaaba Hero Image"
                />
              </div>

              {/* Purpose */}
              <div className="space-y-2">
                <Label>Purpose</Label>
                <Select
                  value={formData.purpose}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, purpose: value as MediaPurpose }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select where this media will appear" />
                  </SelectTrigger>
                  <SelectContent>
                    {MEDIA_PURPOSES.map((p) => (
                      <SelectItem key={p.value} value={p.value}>
                        {p.label} ({p.type})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Alt Text */}
              <div className="space-y-2">
                <Label htmlFor="alt_text">Alt Text (for images)</Label>
                <Input
                  id="alt_text"
                  value={formData.alt_text}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, alt_text: e.target.value }))
                  }
                  placeholder="Describe the image for accessibility"
                />
              </div>

              {/* Headline & Subheadline for carousel */}
              {formData.purpose === "carousel" && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="headline">Headline</Label>
                    <Input
                      id="headline"
                      value={formData.headline}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, headline: e.target.value }))
                      }
                      placeholder="Main heading for this slide"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="subheadline">Subheadline</Label>
                    <Textarea
                      id="subheadline"
                      value={formData.subheadline}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          subheadline: e.target.value,
                        }))
                      }
                      placeholder="Supporting text for this slide"
                      rows={2}
                    />
                  </div>
                </>
              )}

              {/* Display Order */}
              <div className="space-y-2">
                <Label htmlFor="display_order">Display Order</Label>
                <Input
                  id="display_order"
                  type="number"
                  value={formData.display_order}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      display_order: parseInt(e.target.value) || 0,
                    }))
                  }
                  placeholder="0"
                />
              </div>

              <Button
                onClick={handleUpload}
                disabled={isUploading || !selectedFile}
                className="w-full"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Media
                  </>
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filter */}
      <div className="flex items-center gap-4">
        <Label>Filter by purpose:</Label>
        <Select value={filterPurpose} onValueChange={setFilterPurpose}>
          <SelectTrigger className="w-[200px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Media</SelectItem>
            {MEDIA_PURPOSES.map((p) => (
              <SelectItem key={p.value} value={p.value}>
                {p.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Media Grid */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-emerald" />
        </div>
      ) : filteredMedia.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <ImageIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>No media uploaded yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence>
            {filteredMedia.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className={`relative bg-card border rounded-lg overflow-hidden ${
                  !item.active ? "opacity-60" : ""
                }`}
              >
                {/* Media Preview */}
                <div className="aspect-video bg-muted relative">
                  {item.media_type === "video" ? (
                    <video
                      src={item.url}
                      className="w-full h-full object-cover"
                      muted
                    />
                  ) : (
                    <img
                      src={item.url}
                      alt={item.alt_text || item.name}
                      className="w-full h-full object-cover"
                    />
                  )}
                  {/* Type Badge */}
                  <div className="absolute top-2 left-2">
                    {item.media_type === "video" ? (
                      <div className="bg-secondary/90 text-secondary-foreground px-2 py-1 rounded text-xs flex items-center gap-1">
                        <Video className="h-3 w-3" />
                        Video
                      </div>
                    ) : (
                      <div className="bg-emerald/90 text-primary-foreground px-2 py-1 rounded text-xs flex items-center gap-1">
                        <ImageIcon className="h-3 w-3" />
                        Image
                      </div>
                    )}
                  </div>
                  {/* Active/Inactive Badge */}
                  {!item.active && (
                    <div className="absolute top-2 right-2 bg-destructive/90 text-destructive-foreground px-2 py-1 rounded text-xs">
                      Hidden
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="p-3 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="font-medium truncate">{item.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {getPurposeLabel(item.purpose)}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => toggleActive(item.id, item.active)}
                      >
                        {item.active ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Media?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This will permanently delete "{item.name}" from the
                              website. This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => deleteMedia(item.id, item.url)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};
