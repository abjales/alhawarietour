import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface SiteMedia {
  id: string;
  name: string;
  media_type: "image" | "video";
  purpose: string;
  url: string;
  alt_text: string | null;
  headline: string | null;
  subheadline: string | null;
  display_order: number;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export type MediaPurpose = 
  | "hero"
  | "carousel"
  | "services-video"
  | "service-ticketing"
  | "service-visa"
  | "service-accommodation"
  | "service-transport";

export const MEDIA_PURPOSES: { value: MediaPurpose; label: string; type: "image" | "video" }[] = [
  { value: "hero", label: "Hero Background Image", type: "image" },
  { value: "carousel", label: "Carousel Slide", type: "image" },
  { value: "services-video", label: "Services Section Video", type: "video" },
  { value: "service-ticketing", label: "Service: Ticketing Image", type: "image" },
  { value: "service-visa", label: "Service: Visa Image", type: "image" },
  { value: "service-accommodation", label: "Service: Accommodation Image", type: "image" },
  { value: "service-transport", label: "Service: Transport Image", type: "image" },
];

export function useSiteMedia(purpose?: string) {
  const [media, setMedia] = useState<SiteMedia[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMedia = async () => {
    setIsLoading(true);
    setError(null);

    let query = supabase
      .from("site_media")
      .select("*")
      .eq("active", true)
      .order("display_order", { ascending: true });

    if (purpose) {
      query = query.eq("purpose", purpose);
    }

    const { data, error: fetchError } = await query;

    if (fetchError) {
      setError(fetchError.message);
    } else {
      setMedia((data as SiteMedia[]) || []);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchMedia();
  }, [purpose]);

  return { media, isLoading, error, refetch: fetchMedia };
}

export function useSingleMedia(purpose: string) {
  const { media, isLoading, error } = useSiteMedia(purpose);
  return { 
    media: media[0] || null, 
    isLoading, 
    error 
  };
}
