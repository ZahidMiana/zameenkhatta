"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Users,
  Building,
  FileText,
  MessageSquare,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Activity,
} from "lucide-react";

interface DashboardStats {
  totalUsers: number;
  totalProperties: number;
  pendingApprovals: number;
  totalBlogPosts: number;
  totalTestimonials: number;
  totalRevenue: number;
  monthlyGrowth: number;
  activeListings: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalProperties: 0,
    pendingApprovals: 0,
    totalBlogPosts: 0,
    totalTestimonials: 0,
    totalRevenue: 0,
    monthlyGrowth: 0,
    activeListings: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const response = await fetch("/api/admin/dashboard");
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: "Total Users",
      value: stats.totalUsers,
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Total Properties",
      value: stats.totalProperties,
      icon: Building,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Pending Approvals",
      value: stats.pendingApprovals,
      icon: Activity,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
    },
    {
      title: "Blog Posts",
      value: stats.totalBlogPosts,
      icon: FileText,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      title: "Testimonials",
      value: stats.totalTestimonials,
      icon: MessageSquare,
      color: "text-pink-600",
      bgColor: "bg-pink-100",
    },
    {
      title: "Total Revenue",
      value: `₨${stats.totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: "text-emerald-600",
      bgColor: "bg-emerald-100",
    },
    {
      title: "Monthly Growth",
      value: `${stats.monthlyGrowth > 0 ? '+' : ''}${stats.monthlyGrowth}%`,
      icon: stats.monthlyGrowth > 0 ? TrendingUp : TrendingDown,
      color: stats.monthlyGrowth > 0 ? "text-green-600" : "text-red-600",
      bgColor: stats.monthlyGrowth > 0 ? "bg-green-100" : "bg-red-100",
    },
    {
      title: "Active Listings",
      value: stats.activeListings,
      icon: Building,
      color: "text-indigo-600",
      bgColor: "bg-indigo-100",
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="text-gray-600 mt-2">
          Welcome to your admin panel. Here's what's happening with your platform.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-full ${stat.bgColor}`}>
                    <Icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button className="w-full justify-start" asChild>
              <a href="/admin/properties?status=pending">
                <Activity className="mr-2 h-4 w-4" />
                Review Pending Properties ({stats.pendingApprovals})
              </a>
            </Button>
            <Button variant="outline" className="w-full justify-start" asChild>
              <a href="/admin/users">
                <Users className="mr-2 h-4 w-4" />
                Manage Users
              </a>
            </Button>
            <Button variant="outline" className="w-full justify-start" asChild>
              <a href="/admin/blog/new">
                <FileText className="mr-2 h-4 w-4" />
                Create New Blog Post
              </a>
            </Button>
            <Button variant="outline" className="w-full justify-start" asChild>
              <a href="/admin/analytics">
                <TrendingUp className="mr-2 h-4 w-4" />
                View Analytics
              </a>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 text-sm">
              <div className="flex items-center justify-between border-b pb-2">
                <span>New property submitted</span>
                <span className="text-gray-500">2 hours ago</span>
              </div>
              <div className="flex items-center justify-between border-b pb-2">
                <span>User registration</span>
                <span className="text-gray-500">4 hours ago</span>
              </div>
              <div className="flex items-center justify-between border-b pb-2">
                <span>Blog post published</span>
                <span className="text-gray-500">1 day ago</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Property approved</span>
                <span className="text-gray-500">2 days ago</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
