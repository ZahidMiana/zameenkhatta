import Image from "next/image";
import Link from "next/link";
import { Calendar, User, Clock } from "lucide-react";
import { BlogPost } from "@/types";
import { Button } from "@/components/ui/button";

interface BlogCardProps {
  post: BlogPost;
}

const BlogCard = ({ post }: BlogCardProps) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 hover-lift border border-gray-200">
      <div className="relative h-48 overflow-hidden">
        <Image
          src={post.image}
          alt={post.title}
          fill
          className="object-cover hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-4 left-4">
          <span className="bg-gray-900 text-white px-2 py-1 rounded-full text-xs font-semibold">
            {post.category}
          </span>
        </div>
      </div>

      <div className="p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-2">
          {post.title}
        </h3>

        <div className="flex items-center text-gray-600 text-sm mb-3 space-x-4">
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-1" />
            <span>{formatDate(post.publishDate)}</span>
          </div>
          <div className="flex items-center">
            <User className="h-4 w-4 mr-1" />
            <span>{post.author}</span>
          </div>
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-1" />
            <span>{post.readTime}</span>
          </div>
        </div>

        <p className="text-gray-600 mb-4 line-clamp-3">{post.excerpt}</p>

        <Button
          asChild
          variant="outline"
          className="w-full hover:bg-gray-50 hover:border-gray-900 border-gray-300"
        >
          <Link href={`/blog/${post.id}`}>Read More</Link>
        </Button>
      </div>
    </div>
  );
};

export default BlogCard;
