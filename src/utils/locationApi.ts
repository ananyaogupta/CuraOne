import axios from "axios";

// Get coordinates for city name
export async function getCoordinates(city: string) {
  const res = await axios.get("https://nominatim.openstreetmap.org/search", {
    params: {
      q: city,
      format: "json",
      limit: 1,
    },
  });

  if (res.data.length === 0) throw new Error("Location not found");

  return {
    lat: res.data[0].lat,
    lon: res.data[0].lon,
  };
}

// Get hospitals around coordinates using Overpass API
export async function getNearbyHospitals(lat: string, lon: string) {
  const query = `[out:json];node["amenity"="hospital"](around:5000,${lat},${lon});out;`;
  const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`;

  const res = await axios.get(url);

  return res.data.elements.map((el: any) => ({
    id: el.id,
    name: el.tags?.name || "Unnamed Hospital",
    address: el.tags?.["addr:full"] || "No address available",
    rating: null,
    phone: null,
    specialties: [],
    location: { lat: el.lat, lon: el.lon }
  }));
}
// Get labs around coordinates using Overpass API
export async function getNearbyLabs(lat: string, lon: string) {
  const query = `
    [out:json];
    (
      node["healthcare"="laboratory"](around:5000,${lat},${lon});
      node["amenity"="doctors"](around:5000,${lat},${lon});
      node["amenity"="clinic"](around:5000,${lat},${lon});
      node["medical"="laboratory"](around:5000,${lat},${lon});
    );
    out;
  `;

  const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`;
  const res = await axios.get(url);

  return res.data.elements.map((el: any) => ({
    id: el.id,
    name: el.tags?.name || "Unnamed Lab",
    address: el.tags?.["addr:full"] || el.tags?.["addr:street"] || "No address available",
    phone: el.tags?.phone || null,
    rating: null, // You could randomly generate or fetch from a database
    location: { lat: el.lat, lon: el.lon }
  }));
}
