import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      fullName, 
      email, 
      phone, 
      contactMethod, 
      message, 
      propertyId, 
      propertyTitle 
    } = body;

    // Validate required fields
    if (!fullName || !email || !message) {
      return NextResponse.json(
        { error: "Name, email, and message are required" },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Please enter a valid email address" },
        { status: 400 }
      );
    }

    // Create property inquiry
    const inquiry = await prisma.contact.create({
      data: {
        fullName,
        email,
        phone: phone || null,
        subject: `Property Inquiry: ${propertyTitle || 'Property'}`,
        message: `Property ID: ${propertyId || 'N/A'}\nContact Method: ${contactMethod || 'Email'}\n\nMessage:\n${message}`,
        status: "NEW",
        createdAt: new Date(),
      },
    });

    console.log("Property inquiry submitted:", {
      id: inquiry.id,
      fullName,
      email,
      propertyId,
      propertyTitle,
    });

    return NextResponse.json({
      success: true,
      message: "Thank you for your inquiry! Our agent will contact you within 24 hours.",
      inquiryId: inquiry.id,
    });
  } catch (error) {
    console.error("Error submitting property inquiry:", error);
    return NextResponse.json(
      { error: "Failed to submit inquiry. Please try again." },
      { status: 500 }
    );
  }
}
