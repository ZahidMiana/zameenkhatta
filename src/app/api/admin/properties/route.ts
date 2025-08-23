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

    const properties = await prisma.property.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    // Add mock user data for now
    const propertiesWithUsers = properties.map(property => ({
      ...property,
      user: {
        name: "John Doe",
        email: "user@example.com",
      },
    }));

    return NextResponse.json(propertiesWithUsers);
  } catch (error) {
    console.error("Error fetching properties:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
