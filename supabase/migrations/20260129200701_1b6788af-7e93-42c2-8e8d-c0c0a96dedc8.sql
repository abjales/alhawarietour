-- Create storage bucket for site media
INSERT INTO storage.buckets (id, name, public)
VALUES ('site-media', 'site-media', true)
ON CONFLICT (id) DO NOTHING;

-- Allow anyone to view files in site-media bucket
CREATE POLICY "Anyone can view site media"
ON storage.objects FOR SELECT
USING (bucket_id = 'site-media');

-- Allow admins to upload files
CREATE POLICY "Admins can upload site media"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'site-media' 
  AND has_role(auth.uid(), 'admin'::app_role)
);

-- Allow admins to update files
CREATE POLICY "Admins can update site media"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'site-media' 
  AND has_role(auth.uid(), 'admin'::app_role)
);

-- Allow admins to delete files
CREATE POLICY "Admins can delete site media"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'site-media' 
  AND has_role(auth.uid(), 'admin'::app_role)
);

-- Create site_media table to track uploaded media and their purposes
CREATE TABLE public.site_media (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  media_type TEXT NOT NULL CHECK (media_type IN ('image', 'video')),
  purpose TEXT NOT NULL,
  url TEXT NOT NULL,
  alt_text TEXT,
  headline TEXT,
  subheadline TEXT,
  display_order INTEGER DEFAULT 0,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.site_media ENABLE ROW LEVEL SECURITY;

-- Anyone can view active media
CREATE POLICY "Anyone can view active site media"
ON public.site_media FOR SELECT
USING (active = true);

-- Admins can manage all media
CREATE POLICY "Admins can manage site media"
ON public.site_media FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Add trigger for updated_at
CREATE TRIGGER update_site_media_updated_at
BEFORE UPDATE ON public.site_media
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for faster lookups by purpose
CREATE INDEX idx_site_media_purpose ON public.site_media(purpose);
CREATE INDEX idx_site_media_active ON public.site_media(active);