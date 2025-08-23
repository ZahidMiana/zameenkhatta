"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Search,
  Heart,
  Eye,
  Share2,
  MapPin,
  Bed,
  Bath,
  Square,
  HeartOff,
} from "lucide-react";
import { toast } from "sonner";

interface Property {
  id: string;
  title: string;
  description: string;
  price: number;
  location: string;
  city: string;
  bedrooms: number;
  bathrooms: number;
  sqft: number;
  image: string;
  featured: boolean;
  type: string;
  purpose: string;
  createdAt: string;
  owner: {
    name: string;
    email: string;
  };
}

interface Favorite {
  id: string;
  property: Property;
  createdAt: string;
}

export default function FavoriteProperties() {
  const { data: session } = useSession();
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [purposeFilter, setPurposeFilter] = useState("ALL");
  const [priceFilter, setPriceFilter] = useState("ALL");
  const [selectedFavorite, setSelectedFavorite] = useState<Favorite | null>(null);
  const [isRemoveDialogOpen, setIsRemoveDialogOpen] = useState(false);

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    try {
      const response = await fetch("/api/user/favorites");
      if (response.ok) {
        const data = await response.json();
        setFavorites(data);
      } else {
        toast.error("Failed to fetch favorite properties");
      }
    } catch (error) {
      console.error("Error fetching favorites:", error);
      toast.error("Error fetching favorites");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFavorite = async (favoriteId: string) => {
    try {
      const response = await fetch(`/api/user/favorites/${favoriteId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setFavorites(favorites.filter(fav => fav.id !== favoriteId));
        toast.success("Property removed from favorites");
        setIsRemoveDialogOpen(false);
        setSelectedFavorite(null);
      } else {
        toast.error("Failed to remove from favorites");
      }
    } catch (error) {
      console.error("Error removing favorite:", error);
      toast.error("Error removing favorite");
    }
  };

  const handleShare = async (property: Property) => {
    try {
      await navigator.share({
        title: property.title,
        text: `Check out this property: ${property.title} in ${property.city}`,
        url: `${window.location.origin}/property/${property.id}`,
      });
    } catch (error) {
      // Fallback to copying to clipboard
      navigator.clipboard.writeText(`${window.location.origin}/property/${property.id}`);
      toast.success("Property link copied to clipboard");
    }
  };

  const filteredFavorites = favorites.filter(favorite => {
    const property = favorite.property;
    const matchesSearch = property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         property.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         property.city.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === "ALL" || property.type === typeFilter;
    const matchesPurpose = purposeFilter === "ALL" || property.purpose === purposeFilter;
    
    let matchesPrice = true;
    if (priceFilter !== "ALL") {
      const price = property.price;
      switch (priceFilter) {
        case "0-50":
          matchesPrice = price <= 5000000; // 50 Lakh
          break;
        case "50-100":
          matchesPrice = price > 5000000 && price <= 10000000; // 50 Lakh - 1 Crore
          break;
        case "100-200":
          matchesPrice = price > 10000000 && price <= 20000000; // 1-2 Crore
          break;
        case "200+":
          matchesPrice = price > 20000000; // 2+ Crore
          break;
      }
    }
    
    return matchesSearch && matchesType && matchesPurpose && matchesPrice;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Favorite Properties</h1>
          <p className="text-gray-600 mt-2">
            Properties you've saved for future reference and consideration.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Heart className="h-6 w-6 text-red-500" />
          <span className="text-2xl font-bold">{favorites.length}</span>
        </div>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardHeader>
          <CardTitle>Search and Filter Favorites</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search properties..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Property Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Types</SelectItem>
                <SelectItem value="house">House</SelectItem>
                <SelectItem value="apartment">Apartment</SelectItem>
                <SelectItem value="plot">Plot</SelectItem>
                <SelectItem value="commercial">Commercial</SelectItem>
              </SelectContent>
            </Select>
            <Select value={purposeFilter} onValueChange={setPurposeFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Purpose" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Purposes</SelectItem>
                <SelectItem value="sale">For Sale</SelectItem>
                <SelectItem value="rent">For Rent</SelectItem>
              </SelectContent>
            </Select>
            <Select value={priceFilter} onValueChange={setPriceFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Price Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Prices</SelectItem>
                <SelectItem value="0-50">Under 50 Lakh</SelectItem>
                <SelectItem value="50-100">50 Lakh - 1 Crore</SelectItem>
                <SelectItem value="100-200">1 - 2 Crore</SelectItem>
                <SelectItem value="200+">Above 2 Crore</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Favorites Grid */}
      <div>
        {filteredFavorites.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchTerm || typeFilter !== "ALL" || purposeFilter !== "ALL" || priceFilter !== "ALL"
                  ? "No properties match your filters"
                  : "No favorite properties yet"}
              </h3>
              <p className="text-gray-500 mb-6">
                {searchTerm || typeFilter !== "ALL" || purposeFilter !== "ALL" || priceFilter !== "ALL"
                  ? "Try adjusting your search filters to find properties"
                  : "Start browsing properties and save your favorites to see them here"}
              </p>
              <Button asChild>
                <Link href="/listings">
                  Browse Properties
                </Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredFavorites.map((favorite) => {
              const property = favorite.property;
              return (
                <Card key={favorite.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative h-48">
                    <Image
                      src={property.image}
                      alt={property.title}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute top-4 left-4">
                      <Badge variant={property.purpose === "sale" ? "default" : "secondary"}>
                        For {property.purpose === "sale" ? "Sale" : "Rent"}
                      </Badge>
                    </div>
                    {property.featured && (
                      <div className="absolute top-4 right-4">
                        <Badge className="bg-yellow-500 text-white">
                          Featured
                        </Badge>
                      </div>
                    )}
                    <div className="absolute bottom-4 right-4">
                      <Badge variant="outline" className="bg-white/90">
                        Saved {new Date(favorite.createdAt).toLocaleDateString()}
                      </Badge>
                    </div>
                  </div>
                  
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-semibold line-clamp-1">{property.title}</h3>
                      <div className="text-lg font-bold text-blue-600">
                        ₨{property.price.toLocaleString()}
                      </div>
                    </div>
                    
                    <div className="flex items-center text-gray-500 mb-3">
                      <MapPin className="w-4 h-4 mr-1" />
                      <span className="text-sm">{property.location}, {property.city}</span>
                    </div>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-600 mb-4">
                      <div className="flex items-center">
                        <Bed className="w-4 h-4 mr-1" />
                        {property.bedrooms} Beds
                      </div>
                      <div className="flex items-center">
                        <Bath className="w-4 h-4 mr-1" />
                        {property.bathrooms} Baths
                      </div>
                      <div className="flex items-center">
                        <Square className="w-4 h-4 mr-1" />
                        {property.sqft} sq ft
                      </div>
                    </div>

                    <div className="text-sm text-gray-500 mb-4">
                      <p>Owner: {property.owner.name}</p>
                      <p>Type: {property.type}</p>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline" asChild>
                          <Link href={`/property/${property.id}`}>
                            <Eye className="w-4 h-4 mr-1" />
                            View
                          </Link>
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleShare(property)}
                        >
                          <Share2 className="w-4 h-4 mr-1" />
                          Share
                        </Button>
                      </div>
                      
                      <Dialog open={isRemoveDialogOpen && selectedFavorite?.id === favorite.id} onOpenChange={setIsRemoveDialogOpen}>
                        <DialogTrigger asChild>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="text-red-600 hover:text-red-700"
                            onClick={() => setSelectedFavorite(favorite)}
                          >
                            <HeartOff className="w-4 h-4 mr-1" />
                            Remove
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Remove from Favorites</DialogTitle>
                            <DialogDescription>
                              Are you sure you want to remove "{property.title}" from your favorites?
                            </DialogDescription>
                          </DialogHeader>
                          <DialogFooter>
                            <Button variant="outline" onClick={() => setIsRemoveDialogOpen(false)}>
                              Cancel
                            </Button>
                            <Button 
                              variant="destructive" 
                              onClick={() => handleRemoveFavorite(favorite.id)}
                            >
                              Remove
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Summary Stats */}
      {filteredFavorites.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Favorites Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-blue-600">
                  {filteredFavorites.filter(f => f.property.purpose === "sale").length}
                </p>
                <p className="text-sm text-gray-600">For Sale</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-green-600">
                  {filteredFavorites.filter(f => f.property.purpose === "rent").length}
                </p>
                <p className="text-sm text-gray-600">For Rent</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-purple-600">
                  {filteredFavorites.filter(f => f.property.featured).length}
                </p>
                <p className="text-sm text-gray-600">Featured</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-orange-600">
                  ₨{Math.round(filteredFavorites.reduce((sum, f) => sum + f.property.price, 0) / filteredFavorites.length / 100000) / 10}L
                </p>
                <p className="text-sm text-gray-600">Avg. Price</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
