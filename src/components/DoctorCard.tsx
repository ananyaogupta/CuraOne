
import React from 'react';
import { Star } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface Doctor {
  id: string;
  name: string;
  specialization: string;
  experience_years: number | null;
  rating: number | null;
  consultation_fee: number | null;
  hospital_id: string | null;
}

interface DoctorCardProps {
  doctor: Doctor;
  onBookAppointment: (type: string, name: string) => void;
}

const DoctorCard = ({ doctor, onBookAppointment }: DoctorCardProps) => {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{doctor.name}</CardTitle>
            <CardDescription>{doctor.specialization}</CardDescription>
          </div>
          <div className="flex items-center">
            <Star className="h-4 w-4 text-yellow-400 fill-current" />
            <span className="text-sm font-medium ml-1">{doctor.rating || 'N/A'}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <p className="text-sm text-gray-600">📍 Multiple Locations</p>
          <p className="text-sm text-gray-600">🎓 {doctor.experience_years || 0} years experience</p>
          <p className="text-sm text-gray-600">💰 ${doctor.consultation_fee || 0}</p>
          <p className="text-sm text-gray-600">⏰ Available for appointments</p>
          <div className="flex gap-2 pt-3">
            <Button 
              size="sm" 
              className="flex-1 bg-green-600 hover:bg-green-700"
              onClick={() => onBookAppointment("doctor", doctor.name)}
            >
              Book Virtual
            </Button>
            <Button 
              size="sm" 
              variant="outline" 
              className="flex-1"
              onClick={() => onBookAppointment("doctor", doctor.name)}
            >
              Book Physical
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DoctorCard;
