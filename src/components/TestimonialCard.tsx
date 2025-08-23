import Image from "next/image";
import { Star } from "lucide-react";
import { Testimonial } from "@/types";

interface TestimonialCardProps {
  testimonial: Testimonial;
}

const TestimonialCard = ({ testimonial }: TestimonialCardProps) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 h-full hover:shadow-lg transition-all duration-300 hover-lift border border-gray-200">
      <div className="flex items-center mb-4">
        {[...Array(testimonial.rating)].map((_, i) => (
          <Star key={i} className="h-5 w-5 text-gray-900 fill-current" />
        ))}
      </div>

      <p className="text-gray-600 mb-6 italic">"{testimonial.content}"</p>

      <div className="flex items-center">
        <div className="relative h-12 w-12 rounded-full overflow-hidden mr-4">
          <Image
            src={testimonial.image}
            alt={testimonial.name}
            fill
            className="object-cover"
          />
        </div>
        <div>
          <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
          <p className="text-gray-600 text-sm">{testimonial.role}</p>
        </div>
      </div>
    </div>
  );
};

export default TestimonialCard;
