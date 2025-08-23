"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import BlogCard from "@/components/BlogCard";
import { blogPosts } from "@/lib/data";
import { BlogPost } from "@/types";

export default function BlogPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>(blogPosts);

  const categories = [
    "all",
    ...Array.from(new Set(blogPosts.map((post) => post.category))),
  ];

  const handleSearch = () => {
    let filtered = blogPosts;

    if (searchTerm) {
      filtered = filtered.filter(
        (post) =>
          post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    if (selectedCategory !== "all") {
      filtered = filtered.filter((post) => post.category === selectedCategory);
    }

    setFilteredPosts(filtered);
  };

  const resetFilters = () => {
    setSearchTerm("");
    setSelectedCategory("all");
    setFilteredPosts(blogPosts);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
            Real Estate Blog
          </h1>
          <p className="text-lg text-gray-600">
            Stay informed with the latest market insights, tips, and trends in
            Pakistan's real estate market.
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
                placeholder="Search articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border-gray-300 focus:border-gray-500"
              />
            </div>

            {/* Category Filters */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  variant={
                    selectedCategory === category ? "default" : "outline"
                  }
                  size="sm"
                  className={`capitalize ${
                    selectedCategory === category
                      ? "bg-gray-900 hover:bg-gray-800 text-white"
                      : "border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  {category === "all" ? "All Categories" : category}
                </Button>
              ))}
            </div>

            <div className="flex gap-2">
              <Button
                onClick={handleSearch}
                className="bg-gray-900 hover:bg-gray-800 text-white"
              >
                Search
              </Button>
              <Button
                onClick={resetFilters}
                variant="outline"
                className="border-gray-300 hover:bg-gray-50"
              >
                Reset
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Blog Posts */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            {filteredPosts.length} Articles Found
          </h2>
        </div>

        {filteredPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-500 mb-4">
              <Search className="h-16 w-16 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-semibold mb-2">No articles found</h3>
              <p>Try adjusting your search terms or category filters.</p>
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
