"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Building,
  Heart,
  Eye,
  TrendingUp,
  Calendar,
  MapPin,
  Phone,
  Mail,
  Edit,
} from "lucide-react";
import Link from "next/link";
import PropertyCard from "@/components/PropertyCard";

interface DashboardStats {
  totalListings: number;
  activeListings: number;
  savedProperties: number;
  totalViews: number;
  recentProperties: any[];
  recentActivity: any[];
}

export default function Dashboard() {
  const { data: session } = useSession();
  const [stats, setStats] = useState<DashboardStats>({
    totalListings: 0,
    activeListings: 0,
    savedProperties: 0,
    totalViews: 0,
    recentProperties: [],
    recentActivity: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await fetch("/api/user/dashboard");
      if (response.ok) {
        const data = await response.json();
        // Map the API response to our stats structure
        setStats({
          totalListings: data.stats?.totalProperties || 0,
          activeListings: data.stats?.approvedProperties || 0,
          savedProperties: data.stats?.totalFavorites || 0,
          totalViews: data.stats?.totalViews || 0,
          recentProperties: data.recentProperties || [],
          recentActivity: data.stats?.recentActivity || [],
        });
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: "My Listings",
      value: stats.totalListings,
      icon: Building,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
      href: "/dashboard/listings",
    },
    {
      title: "Active Listings",
      value: stats.activeListings,
      icon: TrendingUp,
      color: "text-green-600",
      bgColor: "bg-green-100",
      href: "/dashboard/listings?status=active",
    },
    {
      title: "Saved Properties",
      value: stats.savedProperties,
      icon: Heart,
      color: "text-red-600",
      bgColor: "bg-red-100",
      href: "/dashboard/favorites",
    },
    {
      title: "Total Views",
      value: stats.totalViews,
      icon: Eye,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
      href: "/dashboard/analytics",
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
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">
              Welcome back, {session?.user?.name || "User"}!
            </h1>
            <p className="text-blue-100">
              Manage your properties and explore new opportunities on Pakistan's premier real estate platform.
            </p>
          </div>
          <div className="hidden md:block">
            <Button asChild variant="secondary">
              <Link href="/dashboard/listings/new">
                <Building className="mr-2 h-4 w-4" />
                Add New Property
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Link key={index} href={stat.href}>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
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
            </Link>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Summary */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Profile Summary</CardTitle>
            <Button variant="outline" size="sm" asChild>
              <Link href="/dashboard/settings">
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
                <span className="text-lg font-medium text-gray-700">
                  {session?.user?.name?.charAt(0) || session?.user?.email?.charAt(0)}
                </span>
              </div>
              <div>
                <p className="font-medium text-gray-900">
                  {session?.user?.name || "User Name"}
                </p>
                <p className="text-sm text-gray-500">Property Owner</p>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center text-sm text-gray-600">
                <Mail className="h-4 w-4 mr-2" />
                {session?.user?.email}
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Phone className="h-4 w-4 mr-2" />
                +92 300 1234567
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <MapPin className="h-4 w-4 mr-2" />
                Lahore, Pakistan
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Calendar className="h-4 w-4 mr-2" />
                Member since {new Date().getFullYear()}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.recentActivity && stats.recentActivity.length > 0 ? (
                stats.recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-center space-x-3 text-sm">
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-gray-900">{activity.action}</p>
                      <p className="text-gray-500">{activity.time}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="space-y-4 text-sm text-gray-500">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    <div>
                      <p>Welcome to Zameen Khatta!</p>
                      <p className="text-xs text-gray-400">Just now</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                    <div>
                      <p>Profile created successfully</p>
                      <p className="text-xs text-gray-400">Today</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full justify-start" asChild>
              <Link href="/dashboard/listings/new">
                <Building className="mr-2 h-4 w-4" />
                Add New Property
              </Link>
            </Button>
            <Button variant="outline" className="w-full justify-start" asChild>
              <Link href="/dashboard/favorites">
                <Heart className="mr-2 h-4 w-4" />
                View Saved Properties
              </Link>
            </Button>
            <Button variant="outline" className="w-full justify-start" asChild>
              <Link href="/dashboard/settings">
                <Edit className="mr-2 h-4 w-4" />
                Update Profile
              </Link>
            </Button>
            <Button variant="outline" className="w-full justify-start" asChild>
              <Link href="/listings">
                <Eye className="mr-2 h-4 w-4" />
                Browse Properties
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Recent Properties */}
      {stats.recentProperties && stats.recentProperties.length > 0 && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Your Recent Properties</CardTitle>
            <Button variant="outline" size="sm" asChild>
              <Link href="/dashboard/listings">View All</Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {stats.recentProperties.slice(0, 3).map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
