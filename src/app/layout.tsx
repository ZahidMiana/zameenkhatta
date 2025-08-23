import "./globals.css";
import type { Metadata } from "next";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Providers } from "@/components/Providers";
import dynamic from "next/dynamic";
import '@/lib/init'; // Initialize services

// Dynamically import WhatsApp component to avoid SSR issues
const WhatsAppFloat = dynamic(() => import("@/components/WhatsAppFloat"), {
  ssr: false,
});

export const metadata: Metadata = {
  title: "Zameen Khatta - Find Your Dream Property in Pakistan",
  description:
    "Discover premium properties and find your perfect home with Zameen Khatta. Browse exclusive listings, expert insights, and personalized service across Pakistan.",
  keywords:
    "real estate Pakistan, property Pakistan, buy home Pakistan, sell property Pakistan, Zameen Khatta",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50">
        <Providers>
          <Navigation />
          <main className="min-h-screen">{children}</main>
          <Footer />
          <WhatsAppFloat />
        </Providers>
      </body>
    </html>
  );
}
