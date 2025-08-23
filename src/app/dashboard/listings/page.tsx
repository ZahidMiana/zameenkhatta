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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
  Plus,
  Eye,
  Edit,
  Trash2,
  Star,
  Calendar,
  MapPin,
  Bed,
  Bath,
  Square,
  Building,
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
  approved: boolean;
  type: string;
  purpose: string;
  createdAt: string;
  views?: number;
}

export default function MyListings() {
  const { data: session } = useSession();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  useEffect(() => {
    fetchMyProperties();
  }, []);

  const fetchMyProperties = async () => {
    try {
      const response = await fetch("/api/user/properties");
      if (response.ok) {
        const data = await response.json();
        setProperties(data);
      } else {
        toast.error("Failed to fetch your properties");
      }
    } catch (error) {
      console.error("Error fetching properties:", error);
      toast.error("Error fetching properties");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProperty = async (propertyId: string) => {
    try {
      const response = await fetch(`/api/user/properties/${propertyId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setProperties(properties.filter(property => property.id !== propertyId));
        toast.success("Property deleted successfully");
        setIsDeleteDialogOpen(false);
        setSelectedProperty(null);
      } else {
        toast.error("Failed to delete property");
      }
    } catch (error) {
      console.error("Error deleting property:", error);
      toast.error("Error deleting property");
    }
  };

  const filteredProperties = properties.filter(property => {
    const matchesSearch = property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         property.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "ALL" || 
                         (statusFilter === "APPROVED" && property.approved) ||
                         (statusFilter === "PENDING" && !property.approved) ||
                         (statusFilter === "FEATURED" && property.featured);
    const matchesType = typeFilter === "ALL" || property.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
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
          <h1 className="text-3xl font-bold text-gray-900">My Property Listings</h1>
          <p className="text-gray-600 mt-2">
            Manage and track your property listings on Zameen Khatta.
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/listings/new">
            <Plus className="mr-2 h-4 w-4" />
            Add New Property
          </Link>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Listings</p>
                <p className="text-2xl font-bold">{properties.length}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <Eye className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Approved</p>
                <p className="text-2xl font-bold">
                  {properties.filter(p => p.approved).length}
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <Star className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending Review</p>
                <p className="text-2xl font-bold">
                  {properties.filter(p => !p.approved).length}
                </p>
              </div>
              <div className="p-3 bg-orange-100 rounded-full">
                <Calendar className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Featured</p>
                <p className="text-2xl font-bold">
                  {properties.filter(p => p.featured).length}
                </p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <Star className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardHeader>
          <CardTitle>Search and Filter Properties</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 flex-col sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by title or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Status</SelectItem>
                <SelectItem value="APPROVED">Approved</SelectItem>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="FEATURED">Featured</SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Types</SelectItem>
                <SelectItem value="house">House</SelectItem>
                <SelectItem value="apartment">Apartment</SelectItem>
                <SelectItem value="plot">Plot</SelectItem>
                <SelectItem value="commercial">Commercial</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Properties Grid/Table */}
      <Card>
        <CardHeader>
          <CardTitle>Your Properties ({filteredProperties.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredProperties.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Building className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No properties found</h3>
              <p className="text-gray-500 mb-6">
                {searchTerm || statusFilter !== "ALL" || typeFilter !== "ALL"
                  ? "Try adjusting your search filters"
                  : "Get started by adding your first property listing"}
              </p>
              <Button asChild>
                <Link href="/dashboard/listings/new">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Your First Property
                </Link>
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Property</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Views</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProperties.map((property) => (
                    <TableRow key={property.id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <div className="relative w-16 h-12 rounded overflow-hidden">
                            <Image
                              src={property.image}
                              alt={property.title}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div>
                            <p className="font-medium line-clamp-1">{property.title}</p>
                            <div className="flex items-center space-x-2 text-sm text-gray-500">
                              <span className="flex items-center">
                                <Bed className="w-3 h-3 mr-1" />
                                {property.bedrooms}
                              </span>
                              <span className="flex items-center">
                                <Bath className="w-3 h-3 mr-1" />
                                {property.bathrooms}
                              </span>
                              <span className="flex items-center">
                                <Square className="w-3 h-3 mr-1" />
                                {property.sqft}
                              </span>
                            </div>
                            {property.featured && (
                              <Badge variant="secondary" className="text-xs mt-1">
                                <Star className="w-3 h-3 mr-1" />
                                Featured
                              </Badge>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">
                        ₨{property.price.toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 mr-1 text-gray-400" />
                          <div>
                            <p className="font-medium">{property.city}</p>
                            <p className="text-sm text-gray-500">{property.location}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {property.type}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={property.approved ? "default" : "secondary"}>
                          {property.approved ? "Approved" : "Pending"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Eye className="w-4 h-4 mr-1 text-gray-400" />
                          {property.views || 0}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline" asChild>
                            <Link href={`/property/${property.id}`}>
                              <Eye className="h-4 w-4" />
                            </Link>
                          </Button>
                          <Button size="sm" variant="outline" asChild>
                            <Link href={`/dashboard/listings/${property.id}/edit`}>
                              <Edit className="h-4 w-4" />
                            </Link>
                          </Button>
                          <Dialog open={isDeleteDialogOpen && selectedProperty?.id === property.id} onOpenChange={setIsDeleteDialogOpen}>
                            <DialogTrigger asChild>
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="text-red-600 hover:text-red-700"
                                onClick={() => setSelectedProperty(property)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Delete Property</DialogTitle>
                                <DialogDescription>
                                  Are you sure you want to delete "{property.title}"? 
                                  This action cannot be undone.
                                </DialogDescription>
                              </DialogHeader>
                              <DialogFooter>
                                <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                                  Cancel
                                </Button>
                                <Button 
                                  variant="destructive" 
                                  onClick={() => handleDeleteProperty(property.id)}
                                >
                                  Delete
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
