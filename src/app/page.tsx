"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle,
  Users,
  Award,
  TrendingUp,
  Shield,
  Search,
  MapPin,
  Calendar,
  Clock,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import PropertyCard from "@/components/PropertyCard";
import TestimonialCard from "@/components/TestimonialCard";
import { featuredProperties, testimonials, blogPosts } from "@/lib/data";

export default function Home() {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [searchData, setSearchData] = useState({
    city: "",
    propertyType: "",
    priceRange: "",
  });

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsSubscribed(true);
      setEmail("");
      setTimeout(() => setIsSubscribed(false), 3000);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Redirect to listings page with search parameters
    const params = new URLSearchParams();
    if (searchData.city) params.append("city", searchData.city);
    if (searchData.propertyType) params.append("type", searchData.propertyType);
    if (searchData.priceRange) params.append("price", searchData.priceRange);
    
    window.location.href = `/listings?${params.toString()}`;
  };

  const cities = [
    {
      name: "Lahore",
      image: "https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=800",
      properties: "1,200+ Properties"
    },
    {
      name: "Karachi", 
      image: "https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg?auto=compress&cs=tinysrgb&w=800",
      properties: "950+ Properties"
    },
    {
      name: "Islamabad",
      image: "https://images.pexels.com/photos/1974596/pexels-photo-1974596.jpeg?auto=compress&cs=tinysrgb&w=800", 
      properties: "800+ Properties"
    },
    {
      name: "Rawalpindi",
      image: "https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=800",
      properties: "600+ Properties"
    },
    {
      name: "Faisalabad",
      image: "https://images.pexels.com/photos/1370704/pexels-photo-1370704.jpeg?auto=compress&cs=tinysrgb&w=800",
      properties: "450+ Properties"
    },
    {
      name: "Multan",
      image: "https://images.pexels.com/photos/590020/pexels-photo-590020.jpeg?auto=compress&cs=tinysrgb&w=800",
      properties: "300+ Properties"
    }
  ];

  const valuePropositions = [
    {
      icon: <Users className="h-8 w-8 text-gray-900" />,
      title: "Expert Agents",
      description:
        "Our experienced agents provide personalized service and deep market knowledge of Pakistan's real estate landscape.",
    },
    {
      icon: <Award className="h-8 w-8 text-gray-900" />,
      title: "Premium Properties",
      description:
        "Access to exclusive properties and off-market opportunities across major cities in Pakistan.",
    },
    {
      icon: <TrendingUp className="h-8 w-8 text-gray-900" />,
      title: "Market Insights",
      description:
        "Stay ahead with our comprehensive analysis of Pakistan's property market and investment guidance.",
    },
    {
      icon: <Shield className="h-8 w-8 text-gray-900" />,
      title: "Trusted Service",
      description:
        "Transparent processes, honest communication, and dedicated support throughout your property journey.",
    },
  ];

  return (
    <div className="overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center gradient-dark">
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30"
          style={{
            backgroundImage:
              "url(https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=1920)",
          }}
        ></div>

        <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            Find Your Dream Property
          </h1>
          <p className="text-xl sm:text-2xl text-gray-200 mb-8 max-w-2xl mx-auto">
            Discover premium properties across Pakistan with Zameen Khatta. Your
            perfect home awaits in the heart of Pakistan.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Button
              asChild
              size="lg"
              className="bg-white text-gray-900 hover:bg-gray-100 px-8 py-3"
            >
              <Link href="/listings">
                Browse Properties <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-gray-900 px-8 py-3"
            >
              <Link href="/contact">Contact Us</Link>
            </Button>
            <Button
              asChild
              size="lg"
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-3"
            >
              <Link href="/dashboard/listings/new">
                <Plus className="mr-2 h-5 w-5" />
                Post Your Property
              </Link>
            </Button>
          </div>

          {/* Advanced Search Bar */}
          <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6 mt-8">
            <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">City</label>
                <Select value={searchData.city} onValueChange={(value) => setSearchData({...searchData, city: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select City" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="lahore">Lahore</SelectItem>
                    <SelectItem value="karachi">Karachi</SelectItem>
                    <SelectItem value="islamabad">Islamabad</SelectItem>
                    <SelectItem value="rawalpindi">Rawalpindi</SelectItem>
                    <SelectItem value="faisalabad">Faisalabad</SelectItem>
                    <SelectItem value="multan">Multan</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Property Type</label>
                <Select value={searchData.propertyType} onValueChange={(value) => setSearchData({...searchData, propertyType: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Property Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="house">House</SelectItem>
                    <SelectItem value="apartment">Apartment</SelectItem>
                    <SelectItem value="plot">Plot</SelectItem>
                    <SelectItem value="commercial">Commercial</SelectItem>
                    <SelectItem value="office">Office</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Price Range</label>
                <Select value={searchData.priceRange} onValueChange={(value) => setSearchData({...searchData, priceRange: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Price Range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0-20000000">Under 2 Crore</SelectItem>
                    <SelectItem value="20000000-50000000">2-5 Crore</SelectItem>
                    <SelectItem value="50000000-100000000">5-10 Crore</SelectItem>
                    <SelectItem value="100000000-999999999">Above 10 Crore</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">&nbsp;</label>
                <Button type="submit" className="w-full bg-gray-900 hover:bg-gray-800">
                  <Search className="mr-2 h-4 w-4" />
                  Search Properties
                </Button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Cities/Locations Carousel */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Explore Properties by City
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover amazing properties across Pakistan's major cities and find your perfect location.
            </p>
          </div>

          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full max-w-6xl mx-auto"
          >
            <CarouselContent className="-ml-1">
              {cities.map((city, index) => (
                <CarouselItem key={index} className="pl-1 md:basis-1/2 lg:basis-1/3">
                  <Card className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow duration-300">
                    <div className="relative h-48">
                      <Image
                        src={city.image}
                        alt={city.name}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-30 flex items-end">
                        <div className="p-6 text-white">
                          <h3 className="text-2xl font-bold mb-1">{city.name}</h3>
                          <p className="text-gray-200 flex items-center">
                            <MapPin className="mr-1 h-4 w-4" />
                            {city.properties}
                          </p>
                        </div>
                      </div>
                    </div>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Featured Properties
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Explore our handpicked selection of premium properties in Pakistan
              <code>&#39;</code>s most desirable locations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {featuredProperties.slice(0, 6).map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>

          <div className="text-center">
            <Button
              asChild
              size="lg"
              className="bg-gray-900 hover:bg-gray-800 text-white"
            >
              <Link href="/listings">
                View All Properties <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Zameen Khatta
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We're committed to providing exceptional service and expertise in
              Pakistan's real estate market.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {valuePropositions.map((item, index) => (
              <div
                key={index}
                className="text-center p-6 rounded-lg hover:shadow-lg transition-all duration-300 hover-lift bg-gray-50 hover:bg-white border border-gray-200"
              >
                <div className="flex justify-center mb-4">{item.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {item.title}
                </h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              What Our Clients Say
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Don't just take our word for it. Here's what our satisfied clients
              have to say about their experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {testimonials.map((testimonial) => (
              <TestimonialCard key={testimonial.id} testimonial={testimonial} />
            ))}
          </div>
        </div>
      </section>

      {/* Blog/News Preview Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Latest News & Insights
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Stay informed with the latest trends, tips, and market insights from Pakistan's real estate experts.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {blogPosts.slice(0, 3).map((post) => (
              <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <div className="relative h-48">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <CardContent className="p-6">
                  <div className="flex items-center text-sm text-gray-500 mb-3">
                    <Calendar className="mr-1 h-4 w-4" />
                    <span className="mr-4">{new Date(post.publishDate).toLocaleDateString()}</span>
                    <Clock className="mr-1 h-4 w-4" />
                    <span>{post.readTime}</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3 line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">By {post.author}</span>
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/blog/${post.id}`}>
                        Read More <ArrowRight className="ml-1 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center">
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white"
            >
              <Link href="/blog">
                View All Articles <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="py-16 bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Stay Updated with Pakistan's Property Market
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Get the latest property listings, market trends, and exclusive
            opportunities from across Pakistan delivered to your inbox.
          </p>

          {!isSubscribed ? (
            <form
              onSubmit={handleNewsletterSubmit}
              className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto"
            >
              <Input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="flex-1 bg-white border-white text-gray-900 placeholder-gray-500"
              />
              <Button
                type="submit"
                variant="secondary"
                size="lg"
                className="bg-white text-gray-900 hover:bg-gray-100"
              >
                Subscribe
              </Button>
            </form>
          ) : (
            <div className="flex items-center justify-center space-x-2 text-white">
              <CheckCircle className="h-6 w-6 text-gray-300" />
              <span className="text-lg font-semibold">
                Thank you for subscribing!
              </span>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
