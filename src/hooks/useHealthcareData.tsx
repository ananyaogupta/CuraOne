
import { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Hospital {
  id: string;
  name: string;
  address: string;
  phone: string | null;
  specialties: string[] | null;
  rating: number | null;
}

interface Doctor {
  id: string;
  name: string;
  specialization: string;
  experience_years: number | null;
  rating: number | null;
  consultation_fee: number | null;
  hospital_id: string | null;
}

export const useHealthcareData = () => {
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchHospitals = async () => {
    try {
      const { data, error } = await supabase
        .from('hospitals')
        .select('*')
        .order('rating', { ascending: false });

      if (error) throw error;
      setHospitals(data || []);
    } catch (error) {
      console.error('Error fetching hospitals:', error);
      toast({
        title: "Error",
        description: "Failed to load hospitals. Please try again.",
        variant: "destructive"
      });
    }
  };

  const fetchDoctors = async () => {
    try {
      const { data, error } = await supabase
        .from('doctors')
        .select('*')
        .order('rating', { ascending: false });

      if (error) throw error;
      setDoctors(data || []);
    } catch (error) {
      console.error('Error fetching doctors:', error);
      toast({
        title: "Error",
        description: "Failed to load doctors. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHospitals();
    fetchDoctors();
  }, []);

  return {
    hospitals,
    doctors,
    loading,
    refetchHospitals: fetchHospitals,
    refetchDoctors: fetchDoctors
  };
};
