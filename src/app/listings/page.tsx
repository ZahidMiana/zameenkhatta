"use client";

import { useState } from "react";
import { Search, Filter, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import PropertyCard from "@/components/PropertyCard";
import { allProperties } from "@/lib/data";
import { Property } from "@/types";

export default function ListingsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [priceRange, setPriceRange] = useState("all");
  const [propertyType, setPropertyType] = useState("all");
  const [bedrooms, setBedrooms] = useState("all");
  const [filteredProperties, setFilteredProperties] =
    useState<Property[]>(allProperties);

  const handleSearch = () => {
    let filtered = allProperties;

    // Search by title or location
    if (searchTerm) {
      filtered = filtered.filter(
        (property) =>
          property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          property.location.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    // Filter by price range (in PKR)
    if (priceRange !== "all") {
      const [min, max] = priceRange.split("-").map(Number);
      filtered = filtered.filter((property) => {
        if (max) {
          return property.price >= min && property.price <= max;
        } else {
          return property.price >= min;
        }
      });
    }

    // Filter by property type
    if (propertyType !== "all") {
      filtered = filtered.filter((property) => property.type === propertyType);
    }

    // Filter by bedrooms
    if (bedrooms !== "all") {
      const bedroomCount = parseInt(bedrooms);
      filtered = filtered.filter(
        (property) => property.bedrooms >= bedroomCount,
      );
    }

    setFilteredProperties(filtered);
  };

  const resetFilters = () => {
    setSearchTerm("");
    setPriceRange("all");
    setPropertyType("all");
    setBedrooms("all");
    setFilteredProperties(allProperties);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
            Property Listings
          </h1>
          <p className="text-lg text-gray-600">
            Discover your perfect property from our extensive collection of
            premium properties across Pakistan.
          </p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search by location or property name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border-gray-300 focus:border-gray-500"
              />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-4">
              <Select value={priceRange} onValueChange={setPriceRange}>
                <SelectTrigger className="w-40 border-gray-300">
                  <SelectValue placeholder="Price Range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Prices</SelectItem>
                  <SelectItem value="0-20000000">Under 2 Crore</SelectItem>
                  <SelectItem value="20000000-50000000">2-5 Crore</SelectItem>
                  <SelectItem value="50000000-100000000">5-10 Crore</SelectItem>
                  <SelectItem value="100000000">10+ Crore</SelectItem>
                </SelectContent>
              </Select>

              <Select value={propertyType} onValueChange={setPropertyType}>
                <SelectTrigger className="w-40 border-gray-300">
                  <SelectValue placeholder="Property Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="house">House</SelectItem>
                  <SelectItem value="apartment">Apartment</SelectItem>
                  <SelectItem value="condo">Condo</SelectItem>
                  <SelectItem value="townhouse">Townhouse</SelectItem>
                </SelectContent>
              </Select>

              <Select value={bedrooms} onValueChange={setBedrooms}>
                <SelectTrigger className="w-40 border-gray-300">
                  <SelectValue placeholder="Bedrooms" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Any Bedrooms</SelectItem>
                  <SelectItem value="1">1+ Bedrooms</SelectItem>
                  <SelectItem value="2">2+ Bedrooms</SelectItem>
                  <SelectItem value="3">3+ Bedrooms</SelectItem>
                  <SelectItem value="4">4+ Bedrooms</SelectItem>
                  <SelectItem value="5">5+ Bedrooms</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={handleSearch}
                className="flex items-center gap-2 bg-gray-900 hover:bg-gray-800 text-white"
              >
                <Filter className="h-4 w-4" />
                Search
              </Button>
              <Button
                onClick={resetFilters}
                variant="outline"
                className="flex items-center gap-2 border-gray-300 hover:bg-gray-50"
              >
                <SlidersHorizontal className="h-4 w-4" />
                Reset
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            {filteredProperties.length} Properties Found
          </h2>
        </div>

        {filteredProperties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProperties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-500 mb-4">
              <Search className="h-16 w-16 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-semibold mb-2">
                No properties found
              </h3>
              <p>
                Try adjusting your search criteria or filters to find more
                properties.
              </p>
            </div>
            <Button
              onClick={resetFilters}
              variant="outline"
              className="border-gray-300 hover:bg-gray-50"
            >
              Clear All Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
