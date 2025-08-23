import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Mock analytics data - replace with real data from your analytics service
    const analyticsData = {
      userGrowth: [
        { month: "Jan", users: 120, properties: 45 },
        { month: "Feb", users: 180, properties: 62 },
        { month: "Mar", users: 240, properties: 89 },
        { month: "Apr", users: 320, properties: 124 },
        { month: "May", users: 410, properties: 156 },
        { month: "Jun", users: 520, properties: 198 },
      ],
      propertyTypes: [
        { name: "House", value: 35, color: "#0088FE" },
        { name: "Apartment", value: 25, color: "#00C49F" },
        { name: "Plot", value: 20, color: "#FFBB28" },
        { name: "Commercial", value: 15, color: "#FF8042" },
        { name: "Office", value: 5, color: "#8884D8" },
      ],
      revenue: [
        { month: "Jan", revenue: 45000, target: 50000 },
        { month: "Feb", revenue: 52000, target: 55000 },
        { month: "Mar", revenue: 48000, target: 60000 },
        { month: "Apr", revenue: 67000, target: 65000 },
        { month: "May", revenue: 73000, target: 70000 },
        { month: "Jun", revenue: 81000, target: 75000 },
      ],
      topCities: [
        { city: "Lahore", properties: 156, growth: 12.5 },
        { city: "Karachi", properties: 134, growth: 8.3 },
        { city: "Islamabad", properties: 98, growth: 15.2 },
        { city: "Rawalpindi", properties: 67, growth: 6.7 },
        { city: "Faisalabad", properties: 45, growth: -2.1 },
      ],
      stats: {
        totalViews: 245678,
        conversionRate: 3.2,
        avgTimeOnSite: 4.5,
        bounceRate: 32.1,
      },
    };

    return NextResponse.json(analyticsData);
  } catch (error) {
    console.error("Error fetching analytics:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
