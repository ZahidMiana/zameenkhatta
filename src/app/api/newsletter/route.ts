import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    // Validate email
    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Please enter a valid email address" },
        { status: 400 }
      );
    }

    // Check if email already exists
    const existingSubscription = await prisma.newsletter.findUnique({
      where: { email },
    });

    if (existingSubscription) {
      if (existingSubscription.active) {
        return NextResponse.json(
          { error: "This email is already subscribed to our newsletter" },
          { status: 400 }
        );
      } else {
        // Reactivate existing subscription
        await prisma.newsletter.update({
          where: { email },
          data: { active: true, updatedAt: new Date() },
        });
        return NextResponse.json({
          success: true,
          message: "Welcome back! Your newsletter subscription has been reactivated.",
        });
      }
    }

    // Create new subscription
    await prisma.newsletter.create({
      data: {
        email,
        active: true,
      },
    });

    console.log("New newsletter subscription:", email);

    return NextResponse.json({
      success: true,
      message: "Thank you for subscribing to our newsletter!",
    });
  } catch (error) {
    console.error("Newsletter subscription error:", error);
    return NextResponse.json(
      { error: "Failed to subscribe. Please try again." },
      { status: 500 }
    );
  }
}
