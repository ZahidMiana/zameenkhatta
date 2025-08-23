import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get dashboard statistics
    const [
      totalUsers,
      totalProperties,
      pendingApprovals,
      totalBlogPosts,
      totalTestimonials,
      activeListings,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.property.count(),
      prisma.property.count({ where: { approved: false } }),
      prisma.blogPost.count(),
      prisma.testimonial.count(),
      prisma.property.count({ where: { approved: true } }),
    ]);

    // Calculate monthly growth (simplified calculation)
    const currentDate = new Date();
    const lastMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1);
    
    const [currentMonthProperties, lastMonthProperties] = await Promise.all([
      prisma.property.count({
        where: {
          createdAt: {
            gte: new Date(currentDate.getFullYear(), currentDate.getMonth(), 1),
          },
        },
      }),
      prisma.property.count({
        where: {
          createdAt: {
            gte: lastMonth,
            lt: new Date(currentDate.getFullYear(), currentDate.getMonth(), 1),
          },
        },
      }),
    ]);

    const monthlyGrowth = lastMonthProperties > 0 
      ? Math.round(((currentMonthProperties - lastMonthProperties) / lastMonthProperties) * 100)
      : 0;

    // Simulate total revenue (you can implement actual revenue calculation)
    const totalRevenue = totalProperties * 50000; // Example calculation

    const stats = {
      totalUsers,
      totalProperties,
      pendingApprovals,
      totalBlogPosts,
      totalTestimonials,
      totalRevenue,
      monthlyGrowth,
      activeListings,
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error("Dashboard stats error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
