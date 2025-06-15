import React, { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { useHealthcareData } from "@/hooks/useHealthcareData";
import SearchForm from './SearchForm';
import HospitalCard from './HospitalCard';
import DoctorCard from './DoctorCard';
import { getCoordinates, getNearbyHospitals } from "@/utils/locationApi";

const HospitalSearch = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [location, setLocation] = useState("");
  const [fetchedHospitals, setFetchedHospitals] = useState([]);
  const { hospitals, doctors, loading } = useHealthcareData();
  const { toast } = useToast();

  // Booking appointment toast
  const handleBookAppointment = (type: string, name: string) => {
    toast({
      title: "Booking Initiated",
      description: `Redirecting to book appointment with ${name}`
    });
  };

  // Search hospitals by location
  const handleSearch = async () => {
    try {
      const { lat, lon } = await getCoordinates(location);
      const results = await getNearbyHospitals(lat, lon);
      setFetchedHospitals(results);

      toast({
        title: "Hospitals Found",
        description: `Showing results near ${location}`
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Could not find hospitals for the location.",
        variant: "destructive"
      });
    }
  };

  // Get user geolocation
  const getUserLocation = (): Promise<{ lat: number; lon: number }> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("Geolocation is not supported by your browser."));
      }
      navigator.geolocation.getCurrentPosition(
        (pos) => resolve({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
        (err) => reject(err)
      );
    });
  };

  // Open OSRM directions in a new tab
  const openOSRMDirections = async (hospitalLat: number, hospitalLon: number) => {
    try {
      const { lat: userLat, lon: userLon } = await getUserLocation();

      // OSRM directions URL with user's coords as start and hospital coords as end
      // Note: OSM longitude comes first in URL (lon,lat)
      const directionsUrl = `https://www.openstreetmap.org/directions?engine=fossgis_osrm_car&route=${userLon}%2C${userLat}%3B${hospitalLon}%2C${hospitalLat}`;

      window.open(directionsUrl, "_blank");
    } catch (error) {
      toast({
        title: "Location Access Denied",
        description: "Please allow location access to get directions.",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <SearchForm
        searchTerm={searchTerm}
        location={location}
        onSearchTermChange={setSearchTerm}
        onLocationChange={setLocation}
        onSearch={handleSearch}
      />

      {/* Hospitals Section */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Hospitals & Clinics</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(fetchedHospitals.length > 0 ? fetchedHospitals : hospitals).map((hospital: any) => (
            <HospitalCard
              key={hospital.id}
              hospital={hospital}
              onBookAppointment={handleBookAppointment}
              onGetDirections={() => openOSRMDirections(hospital.latitude, hospital.longitude)}
            />
          ))}
        </div>
      </div>

      {/* Doctors Section */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Top Rated Doctors</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {doctors.map((doctor) => (
            <DoctorCard
              key={doctor.id}
              doctor={doctor}
              onBookAppointment={handleBookAppointment}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default HospitalSearch;
