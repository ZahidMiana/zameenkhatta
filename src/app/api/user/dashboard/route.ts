import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Get user's properties
    const properties = await prisma.property.findMany({
      where: { userId: user.id },
    });

    // Calculate statistics
    const totalProperties = properties.length;
    const approvedProperties = properties.filter(p => p.approved).length;
    const pendingProperties = properties.filter(p => !p.approved).length;
    const featuredProperties = properties.filter(p => p.featured).length;

    // Get recent properties (last 5)
    const recentProperties = properties
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5);

    // Create recent activity data
    const recentActivity = [
      {
        action: "Profile created",
        time: new Date(user.createdAt).toLocaleDateString(),
      },
      ...(properties.length > 0 ? [
        {
          action: "First property listed",
          time: new Date(properties[0].createdAt).toLocaleDateString(),
        }
      ] : []),
      ...(approvedProperties > 0 ? [
        {
          action: `${approvedProperties} properties approved`,
          time: "Recently",
        }
      ] : []),
    ];

    const stats = {
      totalProperties,
      approvedProperties,
      pendingProperties,
      featuredProperties,
      totalFavorites: 0, // Will implement when favorites model is working
      totalViews: 0, // Placeholder for future views feature
      recentActivity,
    };

    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
      },
      stats,
      recentProperties,
    });
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    return NextResponse.json(
      { error: "Failed to fetch dashboard data" },
      { status: 500 }
    );
  }
}
