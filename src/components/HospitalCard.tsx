import React from 'react';
import { MapPin, Star, Phone, Clock, Navigation } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Hospital {
  id: string;
  name: string;
  address: string;
  phone: string | null;
  specialties: string[] | null;
  rating: number | null;
  latitude: number;    // Make sure your hospital object has these
  longitude: number;   // coordinates!
}

interface HospitalCardProps {
  hospital: Hospital;
  onBookAppointment: (type: string, name: string) => void;
  onGetDirections: () => void;    // New prop for directions
}

const HospitalCard = ({ hospital, onBookAppointment, onGetDirections }: HospitalCardProps) => {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{hospital.name}</CardTitle>
          <div className="flex items-center">
            <Star className="h-4 w-4 text-yellow-400 fill-current" />
            <span className="text-sm font-medium ml-1">{hospital.rating ?? 'N/A'}</span>
          </div>
        </div>
        <CardDescription className="flex items-center">
          <MapPin className="h-4 w-4 mr-1" />
          {hospital.address}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {hospital.phone && (
            <div className="flex items-center text-sm text-gray-600">
              <Phone className="h-4 w-4 mr-2" />
              {hospital.phone}
            </div>
          )}
          <div className="flex items-center text-sm text-gray-600">
            <Clock className="h-4 w-4 mr-2" />
            24/7 Available
          </div>
          {hospital.specialties && (
            <div className="flex flex-wrap gap-1">
              {hospital.specialties.map((specialty, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {specialty}
                </Badge>
              ))}
            </div>
          )}
          <div className="flex gap-2 pt-2">
            <Button 
              size="sm" 
              className="flex-1 bg-blue-600 hover:bg-blue-700"
              onClick={() => onBookAppointment("hospital", hospital.name)}
            >
              Book Appointment
            </Button>
            <Button 
              size="sm" 
              variant="outline" 
              className="flex-1"
              onClick={onGetDirections}  // HERE: handle directions click
            >
              <Navigation className="h-4 w-4 mr-1" />
              Directions
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default HospitalCard;
