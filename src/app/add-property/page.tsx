"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function AddPropertyRedirect() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the proper property creation page
    router.replace("/dashboard/listings/new");
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Redirecting to Property Listing...
        </h2>
        <p className="text-gray-600">
          Taking you to the property submission form
        </p>
      </div>
    </div>
  );
}
