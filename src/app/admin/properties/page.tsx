"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import { Search, Eye, Edit, Trash2, Check, X, Star } from "lucide-react";
import { toast } from "sonner";

interface Property {
  id: string;
  title: string;
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
  user?: {
    name?: string;
    email: string;
  };
}

export default function PropertyManagement() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      const response = await fetch("/api/admin/properties");
      if (response.ok) {
        const data = await response.json();
        setProperties(data);
      } else {
        toast.error("Failed to fetch properties");
      }
    } catch (error) {
      console.error("Error fetching properties:", error);
      toast.error("Error fetching properties");
    } finally {
      setLoading(false);
    }
  };

  const handleApproval = async (propertyId: string, approved: boolean) => {
    try {
      const response = await fetch(`/api/admin/properties/${propertyId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ approved }),
      });

      if (response.ok) {
        setProperties(properties.map(property => 
          property.id === propertyId ? { ...property, approved } : property
        ));
        toast.success(`Property ${approved ? "approved" : "rejected"}`);
      } else {
        toast.error("Failed to update property status");
      }
    } catch (error) {
      console.error("Error updating property:", error);
      toast.error("Error updating property");
    }
  };

  const handleFeatured = async (propertyId: string, featured: boolean) => {
    try {
      const response = await fetch(`/api/admin/properties/${propertyId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ featured }),
      });

      if (response.ok) {
        setProperties(properties.map(property => 
          property.id === propertyId ? { ...property, featured } : property
        ));
        toast.success(`Property ${featured ? "featured" : "unfeatured"}`);
      } else {
        toast.error("Failed to update property status");
      }
    } catch (error) {
      console.error("Error updating property:", error);
      toast.error("Error updating property");
    }
  };

  const handleDeleteProperty = async (propertyId: string) => {
    try {
      const response = await fetch(`/api/admin/properties/${propertyId}`, {
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
                         (statusFilter === "PENDING" && !property.approved);
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
          <h1 className="text-3xl font-bold text-gray-900">Property Management</h1>
          <p className="text-gray-600 mt-2">
            Manage property listings, approvals, and featured status.
          </p>
        </div>
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

      {/* Properties Table */}
      <Card>
        <CardHeader>
          <CardTitle>Properties ({filteredProperties.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Property</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Owner</TableHead>
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
                          <p className="text-sm text-gray-500">
                            {property.bedrooms}bed • {property.bathrooms}bath • {property.sqft}sqft
                          </p>
                          {property.featured && (
                            <Badge variant="secondary" className="text-xs">
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
                      <div>
                        <p className="font-medium">{property.city}</p>
                        <p className="text-sm text-gray-500">{property.location}</p>
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
                      <div>
                        <p className="font-medium">
                          {property.user?.name || "Unknown"}
                        </p>
                        <p className="text-sm text-gray-500">
                          {property.user?.email}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-1">
                        {!property.approved && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-green-600 hover:text-green-700"
                            onClick={() => handleApproval(property.id, true)}
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                        )}
                        {property.approved && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-red-600 hover:text-red-700"
                            onClick={() => handleApproval(property.id, false)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="outline"
                          className={property.featured ? "text-yellow-600" : "text-gray-600"}
                          onClick={() => handleFeatured(property.id, !property.featured)}
                        >
                          <Star className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4" />
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
        </CardContent>
      </Card>
    </div>
  );
}
