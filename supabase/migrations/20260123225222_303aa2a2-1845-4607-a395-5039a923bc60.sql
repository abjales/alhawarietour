-- Create packages table for dynamic package management
CREATE TABLE public.packages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  duration TEXT NOT NULL,
  travel_date TEXT,
  makkah_days INTEGER,
  madina_days INTEGER,
  price_ghs DECIMAL(10,2),
  price_usd DECIMAL(10,2),
  features TEXT[] NOT NULL DEFAULT '{}',
  payment_details JSONB,
  popular BOOLEAN DEFAULT false,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.packages ENABLE ROW LEVEL SECURITY;

-- Public can view active packages
CREATE POLICY "Anyone can view active packages"
ON public.packages
FOR SELECT
USING (active = true);

-- Admins can do everything
CREATE POLICY "Admins can manage packages"
ON public.packages
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Create trigger for updated_at
CREATE TRIGGER update_packages_updated_at
BEFORE UPDATE ON public.packages
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();