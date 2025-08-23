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

    // Get users
    const users = await prisma.user.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    // Add mock property counts for now
    const usersWithCounts = users.map((user) => ({
      ...user,
      _count: {
        properties: Math.floor(Math.random() * 5), // Mock data for now
      },
    }));

    return NextResponse.json(usersWithCounts);
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
