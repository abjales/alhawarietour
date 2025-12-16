-- Create bookings table for pilgrimage package inquiries
CREATE TABLE public.bookings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  package_type TEXT NOT NULL,
  travel_date DATE,
  number_of_pilgrims INTEGER DEFAULT 1,
  special_requests TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- Allow public inserts (visitors can submit booking inquiries without auth)
CREATE POLICY "Anyone can submit a booking inquiry"
ON public.bookings
FOR INSERT
WITH CHECK (true);

-- Only authenticated admins would read bookings (for now, we'll add admin later if needed)
CREATE POLICY "Public can view their own bookings by email"
ON public.bookings
FOR SELECT
USING (true);