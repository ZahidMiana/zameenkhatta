import Image from "next/image";
import Link from "next/link";
import { Bed, Bath, Square, MapPin } from "lucide-react";
import { Property } from "@/types";
import { Button } from "@/components/ui/button";

interface PropertyCardProps {
  property: Property;
}

const PropertyCard = ({ property }: PropertyCardProps) => {
  const formatPrice = (price: number) => {
    if (price >= 10000000) {
      return `PKR ${(price / 10000000).toFixed(1)} Crore`;
    } else if (price >= 100000) {
      return `PKR ${(price / 100000).toFixed(1)} Lakh`;
    } else {
      return new Intl.NumberFormat("en-PK", {
        style: "currency",
        currency: "PKR",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(price);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 group hover-lift border border-gray-200">
      <div className="relative h-48 overflow-hidden">
        <Image
          src={property.image}
          alt={property.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-4 left-4">
          <span className="bg-gray-900 text-white px-2 py-1 rounded-full text-xs font-semibold">
            {property.type.charAt(0).toUpperCase() + property.type.slice(1)}
          </span>
        </div>
      </div>

      <div className="p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          {property.title}
        </h3>
        <div className="flex items-center text-gray-600 mb-2">
          <MapPin className="h-4 w-4 mr-1" />
          <span className="text-sm">{property.location}</span>
        </div>

        <div className="flex items-center justify-between mb-4">
          <span className="text-2xl font-bold text-gray-900">
            {formatPrice(property.price)}
          </span>
        </div>

        <div className="flex items-center justify-between text-gray-600 mb-4">
          <div className="flex items-center">
            <Bed className="h-4 w-4 mr-1" />
            <span className="text-sm">{property.bedrooms} beds</span>
          </div>
          <div className="flex items-center">
            <Bath className="h-4 w-4 mr-1" />
            <span className="text-sm">{property.bathrooms} baths</span>
          </div>
          <div className="flex items-center">
            <Square className="h-4 w-4 mr-1" />
            <span className="text-sm">
              {property.sqft.toLocaleString()} sqft
            </span>
          </div>
        </div>

        <Button
          asChild
          className="w-full bg-gray-900 hover:bg-gray-800 text-white"
        >
          <Link href={`/listings/${property.id}`}>View Details</Link>
        </Button>
      </div>
    </div>
  );
};

export default PropertyCard;
