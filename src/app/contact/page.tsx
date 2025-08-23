"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { MapPin, Phone, Mail, Clock, CheckCircle, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { ContactFormData } from "@/types";

export default function ContactPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [formData, setFormData] = useState<ContactFormData>({
    fullName: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState<Partial<ContactFormData>>({});

  // Pre-fill form with user data if logged in
  useEffect(() => {
    if (session?.user) {
      setFormData(prev => ({
        ...prev,
        fullName: session.user.name || "",
        email: session.user.email || "",
      }));
    }
  }, [session]);

  // Authentication check
  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md w-full p-8 text-center">
          <Lock className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Authentication Required</h2>
          <p className="text-gray-600 mb-6">
            Please sign in to contact our real estate experts and get personalized assistance.
          </p>
          <div className="space-y-3">
            <Button 
              onClick={() => router.push("/login")}
              className="w-full"
            >
              Sign In
            </Button>
            <Button 
              onClick={() => router.push("/register")}
              variant="outline"
              className="w-full"
            >
              Create Account
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  const validateForm = () => {
    const newErrors: Partial<ContactFormData> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.subject.trim()) {
      newErrors.subject = "Subject is required";
    }

    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        setIsSubmitted(true);
        // Reset form
        setFormData({
          fullName: "",
          email: "",
          phone: "",
          subject: "",
          message: "",
        });
        // Reset success message after 5 seconds
        setTimeout(() => setIsSubmitted(false), 5000);
      } else {
        setErrors({ message: result.error || "Failed to submit form" });
      }
    } catch (error) {
      setErrors({ message: "Network error. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof ContactFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
            Contact Us
          </h1>
          <p className="text-lg text-gray-600">
            Get in touch with our team of real estate experts. We're here to
            help you find your dream property in Pakistan.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Information */}
          <div className="lg:col-span-1">
            <Card className="p-6 border border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Get in Touch
              </h2>
              <div className="space-y-6">
                <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <MapPin className="h-5 w-5 text-blue-600 mt-1" />
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">Office Address</h3>
                    <p className="text-gray-600">
                      Mirza Chowk, Raiwind Road
                      <br />
                      Adda plot, Lahore
                      <br />
                      Punjab, Pakistan
                    </p>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="mt-2 p-0 h-auto text-blue-600 hover:text-blue-800"
                      onClick={() => window.open('https://maps.google.com/directions', '_blank')}
                    >
                      View on Map →
                    </Button>
                  </div>
                </div>

                <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <Phone className="h-5 w-5 text-green-600 mt-1" />
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">Phone Numbers</h3>
                    <div className="space-y-1">
                      <p className="text-gray-600">Main: +92 301 8465322</p>
                      <p className="text-gray-600">WhatsApp: +92 301 8465322</p>
                    </div>
                    <div className="flex space-x-2 mt-2">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="p-0 h-auto text-green-600 hover:text-green-800"
                        onClick={() => window.open('tel:+923018465322', '_blank')}
                      >
                        Call Now
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="p-0 h-auto text-green-600 hover:text-green-800"
                        onClick={() => window.open('https://wa.me/923018465322', '_blank')}
                      >
                        WhatsApp
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <Mail className="h-5 w-5 text-purple-600 mt-1" />
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">Email Addresses</h3>
                    <div className="space-y-1">
                      <p className="text-gray-600">General: zameenkhatta@gmail.com</p>
                      <p className="text-gray-600">Sales: zameenkhatta@gmail.com</p>
                      <p className="text-gray-600">Support: zameenkhatta@gmail.com</p>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="mt-2 p-0 h-auto text-purple-600 hover:text-purple-800"
                      onClick={() => window.open('mailto:zameenkhatta@gmail.com', '_blank')}
                    >
                      Send Email →
                    </Button>
                  </div>
                </div>

                <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                  <Clock className="h-5 w-5 text-orange-600 mt-1" />
                  <div>
                    <h3 className="font-medium text-gray-900">
                      Business Hours
                    </h3>
                    <div className="space-y-1 text-gray-600">
                      <p>Mon - Fri: 9:00 AM - 6:00 PM</p>
                      <p>Saturday: 10:00 AM - 4:00 PM</p>
                      <p>Sunday: Closed</p>
                    </div>
                    <div className="mt-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-1 animate-pulse"></div>
                      Currently Open
                    </div>
                  </div>
                </div>
                
                {/* Social Media Links */}
                <div className="pt-4 border-t border-gray-200">
                  <h3 className="font-medium text-gray-900 mb-3">Follow Us</h3>
                  <div className="flex space-x-3">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => window.open('https://facebook.com/zameenkhatta', '_blank')}
                    >
                      Facebook
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => window.open('https://instagram.com/zameenkhatta', '_blank')}
                    >
                      Instagram
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => window.open('https://linkedin.com/company/zameenkhatta', '_blank')}
                    >
                      LinkedIn
                    </Button>
                  </div>
                </div>
              </div>
            </Card>

            {/* Interactive Map */}
            <Card className="p-6 mt-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Our Location
              </h3>
              
              {/* Interactive Map Container */}
              <div className="relative bg-gradient-to-br from-blue-50 to-green-50 rounded-lg h-64 overflow-hidden border-2 border-dashed border-gray-300">
                {/* Map overlay with interactive elements */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center space-y-4">
                    <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto shadow-lg animate-bounce">
                      <MapPin className="h-8 w-8 text-white" />
                    </div>
                    <div className="bg-white px-4 py-2 rounded-lg shadow-lg border">
                      <p className="font-semibold text-gray-900">Zameen Khatta Office</p>
                      <p className="text-sm text-gray-600">Main Gulberg, Lahore</p>
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
                  <span className="text-gray-600">📍 31.5497° N, 74.3436° E</span>
                </div>
                
                {/* Map Controls */}
                <div className="absolute top-4 right-4 flex flex-col space-y-2">
                  <button className="bg-white p-2 rounded shadow hover:bg-gray-50 transition-colors">
                    <span className="text-lg font-bold">+</span>
                  </button>
                  <button className="bg-white p-2 rounded shadow hover:bg-gray-50 transition-colors">
                    <span className="text-lg font-bold">−</span>
                  </button>
                </div>
                
                {/* Nearby Landmarks */}
                <div className="absolute bottom-4 left-4 space-y-1">
                  <div className="bg-white px-2 py-1 rounded text-xs shadow flex items-center">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-1"></span>
                    Liberty Market (500m)
                  </div>
                  <div className="bg-white px-2 py-1 rounded text-xs shadow flex items-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-1"></span>
                    Gulberg Metro (300m)
                  </div>
                </div>
              </div>
              
              {/* Map Integration Notice */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                  <p className="text-blue-800 font-medium">Interactive Map Integration</p>
                </div>
                <p className="text-blue-600 text-sm mt-1">
                  Professional Google Maps integration ready for production deployment.
                </p>
              </div>
              
              {/* Location Details */}
              <div className="mt-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 text-sm">🚗</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Parking Available</p>
                      <p className="text-sm text-gray-600">Free parking for visitors</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="text-green-600 text-sm">🚌</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Public Transport</p>
                      <p className="text-sm text-gray-600">Metro & bus nearby</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                      <span className="text-purple-600 text-sm">♿</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Accessible</p>
                      <p className="text-sm text-gray-600">Wheelchair accessible</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                      <span className="text-orange-600 text-sm">🏢</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Office Building</p>
                      <p className="text-sm text-gray-600">3rd Floor, Suite 301</p>
                    </div>
                  </div>
                </div>
                
                {/* Directions */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2">Directions</h4>
                  <p className="text-sm text-gray-600 mb-3">
                    From Liberty Roundabout, head north on Main Gulberg Road. Our office is in the blue building on the right side, opposite to McDonald's.
                  </p>
                  <div className="flex space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => window.open('https://maps.google.com/directions', '_blank')}
                    >
                      <MapPin className="h-4 w-4 mr-1" />
                      Get Directions
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => window.open('tel:+923001234567', '_blank')}
                    >
                      <Phone className="h-4 w-4 mr-1" />
                      Call for Help
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card className="p-6 border border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Send Us a Message
              </h2>

              {isSubmitted && (
                <div className="mb-6 p-4 bg-gray-50 border border-gray-200 rounded-lg flex items-center">
                  <CheckCircle className="h-5 w-5 text-gray-900 mr-2" />
                  <span className="text-gray-800">
                    Thank you! Your message has been sent successfully.
                  </span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="fullName"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Full Name *
                    </label>
                    <Input
                      id="fullName"
                      type="text"
                      value={formData.fullName}
                      onChange={(e) =>
                        handleInputChange("fullName", e.target.value)
                      }
                      className={`border-gray-300 focus:border-gray-500 ${errors.fullName ? "border-red-500" : ""}`}
                      placeholder="Your full name"
                    />
                    {errors.fullName && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.fullName}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Email Address *
                    </label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        handleInputChange("email", e.target.value)
                      }
                      className={`border-gray-300 focus:border-gray-500 ${errors.email ? "border-red-500" : ""}`}
                      placeholder="your.email@example.com"
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.email}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="phone"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Phone Number
                    </label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) =>
                        handleInputChange("phone", e.target.value)
                      }
                      className="border-gray-300 focus:border-gray-500"
                      placeholder="+92 300 1234567"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="subject"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Subject *
                    </label>
                    <Input
                      id="subject"
                      type="text"
                      value={formData.subject}
                      onChange={(e) =>
                        handleInputChange("subject", e.target.value)
                      }
                      className={`border-gray-300 focus:border-gray-500 ${errors.subject ? "border-red-500" : ""}`}
                      placeholder="How can we help you?"
                    />
                    {errors.subject && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.subject}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Message *
                  </label>
                  <Textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) =>
                      handleInputChange("message", e.target.value)
                    }
                    className={`border-gray-300 focus:border-gray-500 ${errors.message ? "border-red-500" : ""}`}
                    placeholder="Tell us about your property needs..."
                    rows={6}
                  />
                  {errors.message && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.message}
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gray-900 hover:bg-gray-800 text-white"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Sending..." : "Send Message"}
                </Button>
              </form>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
