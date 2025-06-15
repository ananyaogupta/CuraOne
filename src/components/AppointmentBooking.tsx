import React, { useState, useEffect } from 'react';
import { Calendar, Clock, User, Phone, Video, MapPin } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { getCoordinates, getNearbyHospitals } from "@/utils/locationApi";

interface Appointment {
  id: number;
  doctor: string;
  specialty: string;
  date: string;
  time: string;
  type: string;
  hospital: string;
}

const AppointmentBooking = () => {
  const [appointmentType, setAppointmentType] = useState("virtual");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [city, setCity] = useState("");
  const [hospitals, setHospitals] = useState<{ id: number, name: string }[]>([]);
  const [selectedHospital, setSelectedHospital] = useState("");
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [specialty, setSpecialty] = useState("");
  const [doctor, setDoctor] = useState("");
  const { toast } = useToast();

  const [reschedulingId, setReschedulingId] = useState<number | null>(null);
  const [newDate, setNewDate] = useState("");
  const [newTime, setNewTime] = useState("");

  const timeSlots = [
    "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM",
    "02:00 PM", "02:30 PM", "03:00 PM", "03:30 PM", "04:00 PM", "04:30 PM",
    "05:00 PM", "05:30 PM"
  ];

  useEffect(() => {
    const stored = localStorage.getItem("appointments");
    if (stored) {
      setAppointments(JSON.parse(stored));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("appointments", JSON.stringify(appointments));
  }, [appointments]);

  const handleCitySearch = async () => {
    try {
      const { lat, lon } = await getCoordinates(city);
      const nearby = await getNearbyHospitals(lat, lon);
      setHospitals(nearby);
    } catch (err) {
      toast({ title: "Location Error", description: "Unable to find hospitals for the city." });
    }
  };

  const handleBookAppointment = (e: React.FormEvent) => {
    e.preventDefault();

    const newAppointment: Appointment = {
      id: Date.now(),
      doctor,
      specialty,
      date: selectedDate,
      time: selectedTime,
      type: appointmentType,
      hospital: selectedHospital || "N/A"
    };

    setAppointments((prev) => [...prev, newAppointment]);

    toast({
      title: "Appointment Booked!",
      description: `Your ${appointmentType} appointment has been scheduled successfully.`
    });
  };

  const handleConfirmReschedule = (id: number) => {
    const updated = appointments.map((appt) =>
      appt.id === id ? { ...appt, date: newDate, time: newTime } : appt
    );
    setAppointments(updated);
    localStorage.setItem("appointments", JSON.stringify(updated));
    setReschedulingId(null);
    setNewDate("");
    setNewTime("");
    toast({
      title: "Appointment Rescheduled!",
      description: `Your appointment has been moved to ${newDate} at ${newTime}.`,
    });
  };

  const handleJoinVirtual = (appt: Appointment) => {
    // dummy link; you can replace with actual video call room URL
    window.open("https://meet.jit.si/your-health-session-" + appt.id, "_blank");
  };

  return (
    <div className="space-y-6">
      {/* Booking Form */}
      <Card>
        <CardHeader>
          <CardTitle>Book an Appointment</CardTitle>
          <CardDescription>Schedule a consultation with our healthcare professionals</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleBookAppointment} className="space-y-6">
            <div className="space-y-3">
              <Label className="text-base font-medium">Appointment Type</Label>
              <RadioGroup value={appointmentType} onValueChange={setAppointmentType} className="flex gap-6">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="virtual" id="virtual" />
                  <Label htmlFor="virtual" className="flex items-center cursor-pointer">
                    <Video className="h-4 w-4 mr-2 text-green-600" />
                    Virtual Appointment
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="physical" id="physical" />
                  <Label htmlFor="physical" className="flex items-center cursor-pointer">
                    <MapPin className="h-4 w-4 mr-2 text-blue-600" />
                    Physical Appointment
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {appointmentType === "physical" && (
              <div className="flex gap-4">
                <Input placeholder="Enter your city" value={city} onChange={(e) => setCity(e.target.value)} />
                <Button type="button" onClick={handleCitySearch}>Find Hospitals</Button>
              </div>
            )}

            {appointmentType === "physical" && hospitals.length > 0 && (
              <div className="space-y-2">
                <Label htmlFor="hospital">Nearby Hospitals</Label>
                <Select value={selectedHospital} onValueChange={setSelectedHospital}>
                  <SelectTrigger><SelectValue placeholder="Select hospital" /></SelectTrigger>
                  <SelectContent>
                    {hospitals.map((h) => (
                      <SelectItem key={h.id} value={h.name}>{h.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Specialty</Label>
                <Select value={specialty} onValueChange={setSpecialty}>
                  <SelectTrigger><SelectValue placeholder="Select specialty" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general">General Medicine</SelectItem>
                    <SelectItem value="cardiology">Cardiology</SelectItem>
                    <SelectItem value="neurology">Neurology</SelectItem>
                    <SelectItem value="pediatrics">Pediatrics</SelectItem>
                    <SelectItem value="orthopedics">Orthopedics</SelectItem>
                    <SelectItem value="dermatology">Dermatology</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Doctor</Label>
                <Select value={doctor} onValueChange={setDoctor}>
                  <SelectTrigger><SelectValue placeholder="Select doctor" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Dr. Rasmita Singh">Dr. Rasmita Singh</SelectItem>
                    <SelectItem value="Dr. Milan Reddy">Dr. Milan Reddy</SelectItem>
                    <SelectItem value="Dr. Ananya Gupta">Dr. Ananya Gupta</SelectItem>
                    <SelectItem value="Dr. Joseph">Dr. Joseph</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date">Preferred Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="time">Preferred Time</Label>
                <Select value={selectedTime} onValueChange={setSelectedTime}>
                  <SelectTrigger><SelectValue placeholder="Select time slot" /></SelectTrigger>
                  <SelectContent>
                    {timeSlots.map((time) => (
                      <SelectItem key={time} value={time}>{time}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input id="patientName" placeholder="Patient Name" required />
              <Input id="patientAge" type="number" placeholder="Age" required />
              <Input id="patientPhone" type="tel" placeholder="Phone Number" required />
              <Input id="patientEmail" type="email" placeholder="Email" required />
            </div>

            <Textarea placeholder="Describe your symptoms..." className="min-h-[100px]" />

            <div className="flex gap-4">
              <Button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700">
                <Calendar className="h-4 w-4 mr-2" />
                Book Appointment
              </Button>
              <Button type="button" variant="outline" className="flex-1">
                Save as Draft
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Upcoming Appointments */}
      <Card>
        <CardHeader>
          <CardTitle>Your Upcoming Appointments</CardTitle>
          <CardDescription>Manage your scheduled appointments</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {appointments.map((appt) => (
            <div key={appt.id} className="flex flex-col gap-2 p-4 border rounded-lg">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <h4 className="font-medium">{appt.doctor}</h4>
                  <p className="text-sm text-gray-600">{appt.specialty} | {appt.type} Appointment</p>
                  <p className="text-sm text-gray-500">{appt.date}, {appt.time} {appt.type === "physical" ? `at ${appt.hospital}` : "(Virtual)"}</p>
                </div>
                <div className="flex gap-2">
                  {appt.type === "virtual" ? (
                    <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={() => handleJoinVirtual(appt)}>
                      <Video className="h-4 w-4 mr-1" /> Join
                    </Button>
                  ) : (
                    <Button size="sm" variant="outline">
                      <MapPin className="h-4 w-4 mr-1" /> Directions
                    </Button>
                  )}
                </div>
              </div>

              {/* Reschedule UI */}
              {reschedulingId === appt.id ? (
                <div className="mt-2 space-y-2 md:w-1/2">
                  <Input
                    type="date"
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    min={new Date().toISOString().split("T")[0]}
                  />
                  <Select value={newTime} onValueChange={setNewTime}>
                    <SelectTrigger><SelectValue placeholder="Select new time" /></SelectTrigger>
                    <SelectContent>
                      {timeSlots.map((time) => (
                        <SelectItem key={time} value={time}>{time}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => handleConfirmReschedule(appt.id)}>Confirm</Button>
                    <Button size="sm" variant="outline" onClick={() => setReschedulingId(null)}>Cancel</Button>
                  </div>
                </div>
              ) : (
                <div className="mt-2">
                  <Button size="sm" variant="outline" onClick={() => {
                    setReschedulingId(appt.id);
                    setNewDate(appt.date);
                    setNewTime(appt.time);
                  }}>Reschedule</Button>
                </div>
              )}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default AppointmentBooking;
