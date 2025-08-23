"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
import { Star, Plus, Edit, Trash2, Search } from "lucide-react";
import { toast } from "sonner";

interface Testimonial {
  id: string;
  name: string;
  role: string;
  content: string;
  rating: number;
  image: string;
  createdAt: string;
}

export default function TestimonialManagement() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTestimonial, setSelectedTestimonial] = useState<Testimonial | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    name: "",
    role: "",
    content: "",
    rating: 5,
    image: "",
  });

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      const response = await fetch("/api/admin/testimonials");
      if (response.ok) {
        const data = await response.json();
        setTestimonials(data);
      } else {
        toast.error("Failed to fetch testimonials");
      }
    } catch (error) {
      console.error("Error fetching testimonials:", error);
      toast.error("Error fetching testimonials");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTestimonial = async (testimonialId: string) => {
    try {
      const response = await fetch(`/api/admin/testimonials/${testimonialId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setTestimonials(testimonials.filter(testimonial => testimonial.id !== testimonialId));
        toast.success("Testimonial deleted successfully");
        setIsDeleteDialogOpen(false);
        setSelectedTestimonial(null);
      } else {
        toast.error("Failed to delete testimonial");
      }
    } catch (error) {
      console.error("Error deleting testimonial:", error);
      toast.error("Error deleting testimonial");
    }
  };

  const handleEditTestimonial = async () => {
    if (!selectedTestimonial) return;

    try {
      const response = await fetch(`/api/admin/testimonials/${selectedTestimonial.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editForm),
      });

      if (response.ok) {
        const updatedTestimonial = await response.json();
        setTestimonials(testimonials.map(testimonial => 
          testimonial.id === selectedTestimonial.id ? updatedTestimonial : testimonial
        ));
        toast.success("Testimonial updated successfully");
        setIsEditDialogOpen(false);
        setSelectedTestimonial(null);
      } else {
        toast.error("Failed to update testimonial");
      }
    } catch (error) {
      console.error("Error updating testimonial:", error);
      toast.error("Error updating testimonial");
    }
  };

  const openEditDialog = (testimonial: Testimonial) => {
    setSelectedTestimonial(testimonial);
    setEditForm({
      name: testimonial.name,
      role: testimonial.role,
      content: testimonial.content,
      rating: testimonial.rating,
      image: testimonial.image,
    });
    setIsEditDialogOpen(true);
  };

  const filteredTestimonials = testimonials.filter(testimonial =>
    testimonial.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    testimonial.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
    testimonial.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating ? "text-yellow-400 fill-current" : "text-gray-300"
        }`}
      />
    ));
  };

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
          <h1 className="text-3xl font-bold text-gray-900">Testimonial Management</h1>
          <p className="text-gray-600 mt-2">
            Manage customer testimonials and reviews.
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Testimonial
        </Button>
      </div>

      {/* Search */}
      <Card>
        <CardHeader>
          <CardTitle>Search Testimonials</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search by name, role, or content..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Testimonials Table */}
      <Card>
        <CardHeader>
          <CardTitle>Testimonials ({filteredTestimonials.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Testimonial</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTestimonials.map((testimonial) => (
                  <TableRow key={testimonial.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <div className="relative w-10 h-10 rounded-full overflow-hidden">
                          <Image
                            src={testimonial.image}
                            alt={testimonial.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-medium">{testimonial.name}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{testimonial.role}</Badge>
                    </TableCell>
                    <TableCell>
                      <p className="line-clamp-2 max-w-md">{testimonial.content}</p>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        {renderStars(testimonial.rating)}
                        <span className="ml-2 text-sm text-gray-600">
                          ({testimonial.rating}/5)
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {new Date(testimonial.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => openEditDialog(testimonial)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Dialog open={isDeleteDialogOpen && selectedTestimonial?.id === testimonial.id} onOpenChange={setIsDeleteDialogOpen}>
                          <DialogTrigger asChild>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="text-red-600 hover:text-red-700"
                              onClick={() => setSelectedTestimonial(testimonial)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Delete Testimonial</DialogTitle>
                              <DialogDescription>
                                Are you sure you want to delete the testimonial from {testimonial.name}? 
                                This action cannot be undone.
                              </DialogDescription>
                            </DialogHeader>
                            <DialogFooter>
                              <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                                Cancel
                              </Button>
                              <Button 
                                variant="destructive" 
                                onClick={() => handleDeleteTestimonial(testimonial.id)}
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

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Testimonial</DialogTitle>
            <DialogDescription>
              Update the testimonial details below.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Name</label>
              <Input
                value={editForm.name}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                placeholder="Customer name"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Role</label>
              <Input
                value={editForm.role}
                onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
                placeholder="Customer role"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Content</label>
              <Textarea
                value={editForm.content}
                onChange={(e) => setEditForm({ ...editForm, content: e.target.value })}
                placeholder="Testimonial content"
                rows={3}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Rating (1-5)</label>
              <Input
                type="number"
                min="1"
                max="5"
                value={editForm.rating}
                onChange={(e) => setEditForm({ ...editForm, rating: parseInt(e.target.value) })}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Image URL</label>
              <Input
                value={editForm.image}
                onChange={(e) => setEditForm({ ...editForm, image: e.target.value })}
                placeholder="Image URL"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditTestimonial}>
              Update Testimonial
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
