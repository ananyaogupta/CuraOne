import React, { useState } from "react";
import { Search, MapPin, Star, Phone, Clock, Tag, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { getCoordinates, getNearbyLabs } from "@/utils/locationApi";

// Fixed USD to INR conversion rate
const USD_TO_INR = 83.5;

// Format INR using Indian number system
const formatINR = (amount: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);

// Sample test data
const commonTests = [
  {
    id: 1,
    name: "Complete Blood Count",
    category: "blood",
    preparationTime: "8 hours fasting",
    reportTime: "24 hours",
    prices: [
      { lab: "Lab A", price: 25, originalPrice: 30 },
      { lab: "Lab B", price: 28, originalPrice: 35 },
    ],
  },
  {
    id: 2,
    name: "Urine Routine",
    category: "urine",
    preparationTime: "No preparation",
    reportTime: "12 hours",
    prices: [
      { lab: "Lab A", price: 15, originalPrice: 18 },
      { lab: "Lab C", price: 14, originalPrice: 20 },
    ],
  },
  {
    id: 3,
    name: "Thyroid Profile",
    category: "hormone",
    preparationTime: "8 hours fasting",
    reportTime: "48 hours",
    prices: [
      { lab: "Lab B", price: 50, originalPrice: 60 },
      { lab: "Lab C", price: 48, originalPrice: 55 },
    ],
  },
];

const LabTesting = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [referralCode, setReferralCode] = useState("");
  const [cart, setCart] = useState<any[]>([]);
  const [city, setCity] = useState("");
  const [labResults, setLabResults] = useState<any[]>([]);
  const { toast } = useToast();

  const addToCart = (test: any, lab: string, price: number) => {
    const cartItem = {
      id: `${test.id}-${lab}`,
      testName: test.name,
      lab,
      price,
      originalPrice: test.prices.find((p: any) => p.lab === lab)?.originalPrice || price,
    };
    setCart([...cart, cartItem]);
    toast({ title: "Added to Cart", description: `${test.name} added from ${lab}` });
  };

  const applyReferralCode = () => {
    if (referralCode.trim()) {
      toast({ title: "Referral Code Applied!", description: "10% extra discount applied." });
    }
  };

  const getTotalPrice = () => cart.reduce((sum, item) => sum + item.price, 0);
  const getTotalSavings = () => cart.reduce((sum, item) => sum + (item.originalPrice - item.price), 0);

  const searchLabs = async () => {
    try {
      const { lat, lon } = await getCoordinates(city);
      const labs = await getNearbyLabs(lat, lon);
      setLabResults(labs);
      toast({ title: "Labs Found", description: `${labs.length} labs near ${city}` });
    } catch (err: any) {
      toast({ title: "Error", description: err.message });
    }
  };

  return (
    <div className="space-y-6">
      {/* Search Section */}
      <Card>
        <CardHeader>
          <CardTitle>Lab Testing & Diagnostics</CardTitle>
          <CardDescription>Compare prices and find labs near you</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search tests..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Test Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="blood">Blood Tests</SelectItem>
                <SelectItem value="urine">Urine Tests</SelectItem>
                <SelectItem value="hormone">Hormone Tests</SelectItem>
              </SelectContent>
            </Select>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Enter city..."
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button className="bg-blue-600 hover:bg-blue-700" onClick={searchLabs}>
              <Search className="h-4 w-4 mr-2" /> Search
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Lab Results */}
      {labResults.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Lab Centers Near {city}</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {labResults.map((lab) => (
              <Card key={lab.id}>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>{lab.name}</CardTitle>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-400" />
                      <span className="ml-1">{lab.rating || "—"}</span>
                    </div>
                  </div>
                  <CardDescription>{lab.address}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {lab.phone && (
                      <div className="flex items-center text-sm">
                        <Phone className="h-4 w-4 mr-2" />
                        {lab.phone}
                      </div>
                    )}
                    <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                      View Tests
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Referral Code */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Tag className="h-5 w-5 mr-2 text-green-600" />
            Have a Referral Code?
          </CardTitle>
        </CardHeader>
        <CardContent className="flex gap-4">
          <Input
            placeholder="Enter referral code..."
            value={referralCode}
            onChange={(e) => setReferralCode(e.target.value)}
            className="flex-1"
          />
          <Button onClick={applyReferralCode} className="bg-green-600 hover:bg-green-700">
            Apply Code
          </Button>
        </CardContent>
      </Card>

      {/* Tests */}
      <div className="lg:col-span-2 space-y-6">
        <h2 className="text-xl font-semibold mb-4">Popular Lab Tests</h2>
        {commonTests.map((test) => (
          <Card key={test.id}>
            <CardHeader>
              <CardTitle>{test.name}</CardTitle>
              <CardDescription>
                <Badge variant="secondary" className="mr-2">
                  {test.category}
                </Badge>
                {test.preparationTime} • Report: {test.reportTime}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {test.prices.map((p, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div>
                    <p className="font-medium">{p.lab}</p>
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold text-green-600">
                        {formatINR(p.price * USD_TO_INR)}
                      </span>
                      <span className="line-through text-sm text-gray-500">
                        {formatINR(p.originalPrice * USD_TO_INR)}
                      </span>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    className="bg-blue-600 hover:bg-blue-700"
                    onClick={() => addToCart(test, p.lab, p.price)}
                  >
                    <ShoppingCart className="h-4 w-4 mr-1" /> Add
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Cart */}
      <Card className="sticky top-4">
        <CardHeader>
          <CardTitle className="flex items-center">
            <ShoppingCart className="h-5 w-5 mr-2" />
            Your Cart ({cart.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {cart.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No tests in cart</p>
          ) : (
            <>
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between items-center border-b pb-3"
                >
                  <div>
                    <p className="font-medium">{item.testName}</p>
                    <p className="text-xs text-gray-600">{item.lab}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-green-600">
                      {formatINR(item.price * USD_TO_INR)}
                    </span>
                    <span className="line-through text-xs text-gray-500">
                      {formatINR(item.originalPrice * USD_TO_INR)}
                    </span>
                  </div>
                </div>
              ))}
              <div className="pt-3 border-t">
                <div className="flex justify-between">
                  <span>Total:</span>
                  <span className="font-bold text-lg">
                    {formatINR(getTotalPrice() * USD_TO_INR)}
                  </span>
                </div>
                <div className="flex justify-between text-green-600">
                  <span>You save:</span>
                  <span>{formatINR(getTotalSavings() * USD_TO_INR)}</span>
                </div>
                <Button className="w-full bg-green-600 hover:bg-green-700">
                  Proceed to Checkout
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default LabTesting;
