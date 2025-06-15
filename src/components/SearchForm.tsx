
import React from 'react';
import { Search, MapPin } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

interface SearchFormProps {
  searchTerm: string;
  location: string;
  onSearchTermChange: (value: string) => void;
  onLocationChange: (value: string) => void;
  onSearch: () => void;
}

const SearchForm = ({ 
  searchTerm, 
  location, 
  onSearchTermChange, 
  onLocationChange, 
  onSearch 
}: SearchFormProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Find Hospitals & Doctors</CardTitle>
        <CardDescription>Search for healthcare providers near you</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search hospitals, doctors, specialties..."
              value={searchTerm}
              onChange={(e) => onSearchTermChange(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="relative">
            <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Enter your location..."
              value={location}
              onChange={(e) => onLocationChange(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700" onClick={onSearch}>
            <Search className="h-4 w-4 mr-2" />
            Search
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SearchForm;
