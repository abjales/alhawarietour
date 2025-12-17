-- Add INSERT policy to prevent privilege escalation
-- Only existing admins can assign roles to users
CREATE POLICY "Only admins can assign roles"
ON public.user_roles
FOR INSERT
WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));