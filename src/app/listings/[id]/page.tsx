"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { 
  ArrowLeft, 
  Bed, 
  Bath, 
  Square, 
  MapPin, 
  Heart,
  Share2,
  Phone,
  Mail,
  Calendar,
  Home,
  Car,
  TreePine,
  Wifi,
  Shield,
  Dumbbell,
  Camera
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { allProperties } from "@/lib/data";
import { Property } from "@/types";

export default function PropertyDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session, status } = useSession();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  
  // Contact form state
  const [inquiryForm, setInquiryForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    contactMethod: "Email",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    if (params.id) {
      // Find property by ID
      const foundProperty = allProperties.find(p => p.id === params.id);
      if (foundProperty) {
        setProperty(foundProperty);
      }
      setLoading(false);
    }
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Property Not Found</h1>
          <p className="text-gray-600 mb-6">The property you're looking for doesn't exist.</p>
          <Button onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  const formatPrice = (price: number) => {
    if (price >= 10000000) {
      return `PKR ${(price / 10000000).toFixed(1)} Crore`;
    } else if (price >= 100000) {
      return `PKR ${(price / 100000).toFixed(1)} Lakh`;
    } else {
      return new Intl.NumberFormat("en-PK", {
        style: "currency",
        currency: "PKR",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(price);
    }
  };

  // Sample images array with proper fallbacks
  const propertyImages = [
    property?.image || "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&h=600&fit=crop", 
    "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=800&h=600&fit=crop",
  ];

  const amenities = [
    { icon: Car, name: "Parking" },
    { icon: TreePine, name: "Garden" },
    { icon: Wifi, name: "WiFi" },
    { icon: Shield, name: "Security" },
    { icon: Dumbbell, name: "Gym" },
    { icon: Home, name: "Furnished" },
  ];

  const handleContactAgent = () => {
    // Check authentication first
    if (!session) {
      router.push('/login?error=login_required&returnUrl=' + encodeURIComponent(window.location.pathname));
      return;
    }
    // Open phone dialer with real agent number
    window.location.href = 'tel:+923018465322';
  };

  const handleSendMessage = () => {
    // Check authentication first
    if (!session) {
      router.push('/login?error=login_required&returnUrl=' + encodeURIComponent(window.location.pathname));
      return;
    }
    // Scroll to contact form
    document.getElementById('contact-section')?.scrollIntoView({ 
      behavior: 'smooth' 
    });
  };

  const handleScheduleViewing = () => {
    // Check authentication first
    if (!session) {
      router.push('/login?error=login_required&returnUrl=' + encodeURIComponent(window.location.pathname));
      return;
    }
    // Create a scheduling form popup or redirect
    const schedulingForm = {
      property: property.title,
      propertyId: property.id,
      userMessage: `I would like to schedule a viewing for "${property.title}" located at ${property.location}.`
    };
    
    // For now, we'll show an alert with scheduling info
    const message = `Viewing Request for: ${property.title}\n\nWe'll contact you within 24 hours to confirm your viewing appointment.\n\nProperty: ${property.title}\nLocation: ${property.location}\nPrice: ${formatPrice(property.price)}`;
    
    if (confirm(message + "\n\nWould you like to proceed?")) {
      // In real app, this would submit to an API
      alert("✅ Viewing request submitted! We'll contact you soon to confirm the appointment.");
    }
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
    // In real app, this would make an API call to save/remove favorite
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: property.title,
        text: `Check out this amazing property: ${property.title}`,
        url: window.location.href,
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  const handleInquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!property) return;
    
    setIsSubmitting(true);
    setSubmitError("");
    
    try {
      const response = await fetch("/api/property/inquiry", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...inquiryForm,
          propertyId: property.id,
          propertyTitle: property.title,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        setSubmitSuccess(true);
        setInquiryForm({
          fullName: "",
          email: "",
          phone: "",
          contactMethod: "Email",
          message: "",
        });
        // Reset success message after 5 seconds
        setTimeout(() => setSubmitSuccess(false), 5000);
      } else {
        setSubmitError(result.error || "Failed to submit inquiry");
      }
    } catch (error) {
      setSubmitError("Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setInquiryForm(prev => ({ ...prev, [field]: value }));
    if (submitError) setSubmitError("");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Listings
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Image Gallery */}
            <Card>
              <CardContent className="p-0">
                <div className="relative h-96 bg-gray-200 rounded-t-lg overflow-hidden">
                  <Image
                    src={propertyImages[selectedImageIndex]}
                    alt={property.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-gray-900 text-white">
                      {property.type.charAt(0).toUpperCase() + property.type.slice(1)}
                    </Badge>
                  </div>
                  <div className="absolute top-4 right-4 flex space-x-2">
                    <Button
                      size="sm"
                      variant={isFavorite ? "default" : "secondary"}
                      onClick={toggleFavorite}
                    >
                      <Heart className={`h-4 w-4 ${isFavorite ? 'fill-current' : ''}`} />
                    </Button>
                    <Button size="sm" variant="secondary" onClick={handleShare}>
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                {/* Thumbnail Gallery */}
                <div className="p-4">
                  <div className="grid grid-cols-4 gap-2">
                    {propertyImages.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImageIndex(index)}
                        className={`relative h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                          selectedImageIndex === index ? 'border-gray-900' : 'border-gray-200'
                        }`}
                      >
                        <Image
                          src={image}
                          alt={`Property view ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Property Details */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-2xl font-bold text-gray-900">
                      {property.title}
                    </CardTitle>
                    <div className="flex items-center text-gray-600 mt-2">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span>{property.location}, {property.city}, {property.state}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-gray-900">
                      {formatPrice(property.price)}
                    </div>
                    <Badge variant="secondary">
                      {property.purpose === 'SALE' ? 'For Sale' : 'For Rent'}
                    </Badge>
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                <Tabs defaultValue="overview" className="w-full">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="details">Details</TabsTrigger>
                    <TabsTrigger value="amenities">Amenities</TabsTrigger>
                    <TabsTrigger value="location">Location</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="overview" className="space-y-6">
                    <div className="grid grid-cols-3 gap-6">
                      <div className="flex items-center space-x-2">
                        <Bed className="h-5 w-5 text-gray-600" />
                        <span className="font-semibold">{property.bedrooms}</span>
                        <span className="text-gray-600">Bedrooms</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Bath className="h-5 w-5 text-gray-600" />
                        <span className="font-semibold">{property.bathrooms}</span>
                        <span className="text-gray-600">Bathrooms</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Square className="h-5 w-5 text-gray-600" />
                        <span className="font-semibold">{property.sqft.toLocaleString()}</span>
                        <span className="text-gray-600">Sqft</span>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold mb-3">Description</h3>
                      <p className="text-gray-600 leading-relaxed">
                        {property.description || "This beautiful property offers modern living with excellent amenities and a prime location. Perfect for families looking for comfort and convenience. The property features spacious rooms, modern fixtures, and is located in a peaceful neighborhood with easy access to schools, shopping centers, and public transportation."}
                      </p>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="details" className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="font-semibold">Property Type:</span>
                        <span className="ml-2 text-gray-600">{property.type}</span>
                      </div>
                      <div>
                        <span className="font-semibold">Purpose:</span>
                        <span className="ml-2 text-gray-600">{property.purpose}</span>
                      </div>
                      <div>
                        <span className="font-semibold">Bedrooms:</span>
                        <span className="ml-2 text-gray-600">{property.bedrooms}</span>
                      </div>
                      <div>
                        <span className="font-semibold">Bathrooms:</span>
                        <span className="ml-2 text-gray-600">{property.bathrooms}</span>
                      </div>
                      <div>
                        <span className="font-semibold">Area:</span>
                        <span className="ml-2 text-gray-600">{property.sqft.toLocaleString()} sqft</span>
                      </div>
                      <div>
                        <span className="font-semibold">City:</span>
                        <span className="ml-2 text-gray-600">{property.city}</span>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="amenities">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {amenities.map((amenity, index) => (
                        <div key={index} className="flex items-center space-x-2 p-2 rounded-lg bg-gray-50">
                          <amenity.icon className="h-5 w-5 text-gray-600" />
                          <span className="text-gray-700">{amenity.name}</span>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="location">
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-semibold mb-2">Address</h3>
                        <p className="text-gray-600 text-lg">{property.location}, {property.city}, {property.state}</p>
                      </div>
                      
                      {/* Interactive Map */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Location Map</h3>
                        <div className="h-80 bg-gradient-to-br from-blue-50 to-green-50 rounded-lg border-2 border-dashed border-gray-300 relative overflow-hidden">
                          {/* Map overlay with interactive elements */}
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="text-center space-y-4">
                              <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto shadow-lg animate-bounce">
                                <MapPin className="h-8 w-8 text-white" />
                              </div>
                              <div className="bg-white px-4 py-2 rounded-lg shadow-lg border">
                                <p className="font-semibold text-gray-900">{property.title}</p>
                                <p className="text-sm text-gray-600">{property.location}</p>
                              </div>
                            </div>
                          </div>
                          
                          {/* Map Grid Pattern */}
                          <div className="absolute inset-0 opacity-20">
                            <div className="grid grid-cols-8 grid-rows-6 h-full w-full">
                              {Array.from({ length: 48 }).map((_, i) => (
                                <div key={i} className="border border-gray-300"></div>
                              ))}
                            </div>
                          </div>
                          
                          {/* Coordinates Display */}
                          <div className="absolute top-4 left-4 bg-white px-3 py-1 rounded-md shadow text-sm">
                            <span className="text-gray-600">📍 Lat: 31.5204, Lng: 74.3587</span>
                          </div>
                          
                          {/* Map Controls */}
                          <div className="absolute top-4 right-4 flex flex-col space-y-2">
                            <button className="bg-white p-2 rounded shadow hover:bg-gray-50 transition-colors">
                              <span className="text-lg">+</span>
                            </button>
                            <button className="bg-white p-2 rounded shadow hover:bg-gray-50 transition-colors">
                              <span className="text-lg">−</span>
                            </button>
                          </div>
                        </div>
                        
                        {/* Map Integration Notice */}
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                          <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                            <p className="text-blue-800 font-medium">Interactive Map Integration</p>
                          </div>
                          <p className="text-blue-600 text-sm mt-1">
                            Real Google Maps/OpenStreetMap integration would be implemented here for production use.
                          </p>
                        </div>
                      </div>
                      
                      {/* Nearby Places */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Nearby Places</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                              <span className="text-green-600 text-sm">🏫</span>
                            </div>
                            <div>
                              <p className="font-medium">Schools</p>
                              <p className="text-sm text-gray-600">5 schools within 2km</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                              <span className="text-blue-600 text-sm">🏥</span>
                            </div>
                            <div>
                              <p className="font-medium">Hospitals</p>
                              <p className="text-sm text-gray-600">3 hospitals within 3km</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                              <span className="text-purple-600 text-sm">🛒</span>
                            </div>
                            <div>
                              <p className="font-medium">Shopping</p>
                              <p className="text-sm text-gray-600">2 malls within 1km</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                            <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                              <span className="text-orange-600 text-sm">🚌</span>
                            </div>
                            <div>
                              <p className="font-medium">Transport</p>
                              <p className="text-sm text-gray-600">Bus stop 200m away</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Agent */}
            <Card>
              <CardHeader>
                <CardTitle>Contact Agent</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                    <span className="font-semibold text-gray-600">AG</span>
                  </div>
                  <div>
                    <p className="font-semibold">Property Agent</p>
                    <p className="text-sm text-gray-600">Real Estate Professional</p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Button className="w-full" onClick={handleContactAgent}>
                    <Phone className="h-4 w-4 mr-2" />
                    Call Agent
                  </Button>
                  <Button variant="outline" className="w-full" onClick={handleSendMessage}>
                    <Mail className="h-4 w-4 mr-2" />
                    Send Message
                  </Button>
                  <Button variant="outline" className="w-full" onClick={handleScheduleViewing}>
                    <Calendar className="h-4 w-4 mr-2" />
                    Schedule Viewing
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Similar Properties */}
            <Card>
              <CardHeader>
                <CardTitle>Similar Properties</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {allProperties
                    .filter(p => p.id !== property.id && p.type === property.type)
                    .slice(0, 3)
                    .map((similarProperty) => (
                      <Link key={similarProperty.id} href={`/listings/${similarProperty.id}`}>
                        <div className="flex space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                          <div className="relative w-16 h-16 rounded-lg overflow-hidden">
                            <Image
                              src={similarProperty.image}
                              alt={similarProperty.title}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="flex-1">
                            <p className="font-semibold text-sm">{similarProperty.title}</p>
                            <p className="text-xs text-gray-600">{similarProperty.location}</p>
                            <p className="text-sm font-bold text-gray-900">
                              {formatPrice(similarProperty.price)}
                            </p>
                          </div>
                        </div>
                      </Link>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Contact Form Section */}
      <div id="contact-section" className="bg-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Interested in this property?
            </h2>
            <p className="text-gray-600">
              Fill out the form below and we'll get back to you as soon as possible.
            </p>
          </div>
          
          <Card>
            <CardContent className="p-6">
              {submitSuccess && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-green-800 text-sm font-medium">
                    ✅ Thank you! Your inquiry has been sent successfully. We'll contact you within 24 hours.
                  </p>
                </div>
              )}
              
              {submitError && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-800 text-sm">{submitError}</p>
                </div>
              )}
              
              <form onSubmit={handleInquirySubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={inquiryForm.fullName}
                    onChange={(e) => handleInputChange("fullName", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                    placeholder="Enter your full name"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={inquiryForm.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                    placeholder="Enter your email"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={inquiryForm.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                    placeholder="Enter your phone number"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Preferred Contact Method
                  </label>
                  <select 
                    value={inquiryForm.contactMethod}
                    onChange={(e) => handleInputChange("contactMethod", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                  >
                    <option value="Email">Email</option>
                    <option value="Phone">Phone</option>
                    <option value="WhatsApp">WhatsApp</option>
                  </select>
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message *
                  </label>
                  <textarea
                    rows={4}
                    value={inquiryForm.message}
                    onChange={(e) => handleInputChange("message", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                    placeholder={`I'm interested in ${property.title}. Please contact me with more information.`}
                    required
                  ></textarea>
                </div>
                
                <div className="md:col-span-2">
                  <Button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full bg-gray-900 hover:bg-gray-800 disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        Sending Inquiry...
                      </>
                    ) : (
                      <>
                        <Mail className="h-4 w-4 mr-2" />
                        Send Inquiry
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
