
-- Create hospitals table
CREATE TABLE public.hospitals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  phone TEXT,
  specialties TEXT[],
  rating DECIMAL(2,1) CHECK (rating >= 0 AND rating <= 5),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create doctors table
CREATE TABLE public.doctors (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  specialization TEXT NOT NULL,
  experience_years INTEGER CHECK (experience_years >= 0),
  rating DECIMAL(2,1) CHECK (rating >= 0 AND rating <= 5),
  consultation_fee INTEGER CHECK (consultation_fee >= 0),
  hospital_id UUID REFERENCES public.hospitals(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security (RLS) for both tables
ALTER TABLE public.hospitals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.doctors ENABLE ROW LEVEL SECURITY;

-- Create policies to allow public read access (since this is healthcare data that should be publicly viewable)
CREATE POLICY "Allow public read access to hospitals" 
  ON public.hospitals 
  FOR SELECT 
  TO public
  USING (true);

CREATE POLICY "Allow public read access to doctors" 
  ON public.doctors 
  FOR SELECT 
  TO public
  USING (true);

-- Insert sample hospital data
INSERT INTO public.hospitals (name, address, phone, specialties, rating) VALUES
('City General Hospital', '123 Main St, Downtown', '(555) 123-4567', ARRAY['Cardiology', 'Emergency'], 4.5),
('Metro Medical Center', '456 Oak Ave, Midtown', '(555) 987-6543', ARRAY['Pediatrics', 'Surgery'], 4.2),
('St. Mary''s Hospital', '789 Pine Rd, Uptown', '(555) 456-7890', ARRAY['Oncology', 'Neurology'], 4.7),
('Westside Clinic', '321 Elm St, Westside', '(555) 234-5678', ARRAY['Family Medicine', 'Dermatology'], 4.3);

-- Insert sample doctor data
INSERT INTO public.doctors (name, specialization, experience_years, rating, consultation_fee, hospital_id) VALUES
('Dr. Sarah Johnson', 'Cardiologist', 12, 4.8, 150, (SELECT id FROM public.hospitals WHERE name = 'City General Hospital')),
('Dr. Michael Chen', 'Pediatrician', 8, 4.6, 120, (SELECT id FROM public.hospitals WHERE name = 'Metro Medical Center')),
('Dr. Emily Rodriguez', 'Emergency Medicine', 15, 4.9, 180, (SELECT id FROM public.hospitals WHERE name = 'City General Hospital')),
('Dr. James Wilson', 'Surgeon', 20, 4.7, 250, (SELECT id FROM public.hospitals WHERE name = 'Metro Medical Center')),
('Dr. Lisa Thompson', 'Oncologist', 18, 4.8, 200, (SELECT id FROM public.hospitals WHERE name = 'St. Mary''s Hospital')),
('Dr. Robert Davis', 'Family Medicine', 10, 4.4, 100, (SELECT id FROM public.hospitals WHERE name = 'Westside Clinic'));
