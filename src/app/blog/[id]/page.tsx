"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  User, 
  Tag,
  Share2,
  BookOpen,
  ThumbsUp,
  MessageCircle,
  Eye
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { blogPosts } from "@/lib/data";
import { BlogPost } from "@/types";

export default function BlogDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);

  useEffect(() => {
    if (params.id) {
      // Find blog post by ID
      const foundPost = blogPosts.find(p => p.id === params.id);
      if (foundPost) {
        setPost(foundPost);
        // Get related posts from same category
        const related = blogPosts
          .filter(p => p.id !== foundPost.id && p.category === foundPost.category)
          .slice(0, 3);
        setRelatedPosts(related);
      }
      setLoading(false);
    }
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Article Not Found</h1>
          <p className="text-gray-600 mb-6">The article you're looking for doesn't exist.</p>
          <Button onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: post.title,
        text: post.excerpt,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Article link copied to clipboard!");
    }
  };

  // Generate full article content (in real app, this would come from CMS)
  const fullContent = `
    ${post.content}
    
    ## Understanding the Current Market
    
    The Pakistani real estate market continues to evolve with changing demographics, economic conditions, and infrastructure development. Understanding these trends is crucial for making informed investment decisions.
    
    ### Key Market Indicators
    
    1. **Property Values**: Consistent growth in major urban centers
    2. **Infrastructure Development**: New projects enhancing connectivity
    3. **Government Policies**: Supportive regulations for property investment
    4. **Economic Stability**: Improving investor confidence
    
    ## Investment Opportunities
    
    Pakistan's real estate sector presents numerous opportunities for both local and international investors. From residential properties in growing cities to commercial developments in business districts, the market offers diverse investment avenues.
    
    ### Recommended Areas for Investment
    
    - **Lahore**: Established market with steady growth
    - **Karachi**: Commercial hub with high rental yields
    - **Islamabad**: Premium properties with strong appreciation
    - **Faisalabad**: Emerging market with growth potential
    
    ## Future Outlook
    
    The future of Pakistan's real estate market looks promising with continued urbanization, infrastructure development, and economic growth. Investors who position themselves strategically today can benefit from long-term appreciation and rental income.
    
    ## Conclusion
    
    Whether you're a first-time buyer or an experienced investor, staying informed about market trends and working with knowledgeable professionals is essential for success in Pakistan's dynamic real estate market.
  `;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Blog
          </Button>
        </div>
      </div>

      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Article Header */}
        <header className="mb-8">
          <div className="mb-4">
            <Badge variant="secondary" className="mb-4">
              <Tag className="h-3 w-3 mr-1" />
              {post.category}
            </Badge>
          </div>
          
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            {post.title}
          </h1>
          
          <div className="flex flex-wrap items-center text-gray-600 mb-6 space-y-2 md:space-y-0">
            <div className="flex items-center mr-6">
              <User className="h-4 w-4 mr-2" />
              <span>By {post.author}</span>
            </div>
            <div className="flex items-center mr-6">
              <Calendar className="h-4 w-4 mr-2" />
              <span>{new Date(post.publishDate).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}</span>
            </div>
            <div className="flex items-center mr-6">
              <Clock className="h-4 w-4 mr-2" />
              <span>{post.readTime}</span>
            </div>
            <div className="flex items-center">
              <Eye className="h-4 w-4 mr-2" />
              <span>2.1k views</span>
            </div>
          </div>

          <p className="text-xl text-gray-600 leading-relaxed mb-8">
            {post.excerpt}
          </p>

          {/* Share Button */}
          <div className="flex items-center space-x-4 mb-8">
            <Button onClick={handleShare} variant="outline" size="sm">
              <Share2 className="h-4 w-4 mr-2" />
              Share Article
            </Button>
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <button className="flex items-center space-x-1 hover:text-gray-700 transition-colors">
                <ThumbsUp className="h-4 w-4" />
                <span>124</span>
              </button>
              <button className="flex items-center space-x-1 hover:text-gray-700 transition-colors">
                <MessageCircle className="h-4 w-4" />
                <span>18</span>
              </button>
            </div>
          </div>
        </header>

        {/* Featured Image */}
        <div className="relative h-64 md:h-80 lg:h-96 mb-8 rounded-lg overflow-hidden">
          <Image
            src={post.image}
            alt={post.title}
            fill
            className="object-cover"
          />
        </div>

        {/* Article Content */}
        <div className="prose prose-lg max-w-none">
          <div className="text-gray-700 leading-relaxed space-y-6">
            {fullContent.split('\n\n').map((paragraph, index) => {
              if (paragraph.startsWith('##')) {
                return (
                  <h2 key={index} className="text-2xl font-bold text-gray-900 mt-8 mb-4">
                    {paragraph.replace('## ', '')}
                  </h2>
                );
              } else if (paragraph.startsWith('###')) {
                return (
                  <h3 key={index} className="text-xl font-semibold text-gray-900 mt-6 mb-3">
                    {paragraph.replace('### ', '')}
                  </h3>
                );
              } else if (paragraph.includes('1. **') || paragraph.includes('- **')) {
                // Handle lists
                const listItems = paragraph.split('\n').filter(line => line.trim());
                return (
                  <ul key={index} className="list-disc list-inside space-y-2 ml-4">
                    {listItems.map((item, itemIndex) => (
                      <li key={itemIndex} className="text-gray-700">
                        {item.replace(/^\d+\.\s*/, '').replace(/^-\s*/, '')}
                      </li>
                    ))}
                  </ul>
                );
              } else if (paragraph.trim()) {
                return (
                  <p key={index} className="text-gray-700 text-lg leading-relaxed">
                    {paragraph}
                  </p>
                );
              }
              return null;
            })}
          </div>
        </div>

        {/* Article Footer */}
        <footer className="mt-12 pt-8 border-t border-gray-200">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                <span className="font-semibold text-gray-600">
                  {post.author.charAt(0)}
                </span>
              </div>
              <div>
                <p className="font-semibold text-gray-900">{post.author}</p>
                <p className="text-gray-600 text-sm">Real Estate Expert</p>
              </div>
            </div>
            <Button onClick={handleShare} variant="outline">
              <Share2 className="h-4 w-4 mr-2" />
              Share Article
            </Button>
          </div>
        </footer>
      </article>

      {/* Related Articles */}
      {relatedPosts.length > 0 && (
        <section className="bg-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Related Articles
              </h2>
              <p className="text-gray-600">
                More insights from our real estate experts
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedPosts.map((relatedPost) => (
                <Card key={relatedPost.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
                  <div className="relative h-48">
                    <Image
                      src={relatedPost.image}
                      alt={relatedPost.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <CardContent className="p-6">
                    <div className="flex items-center text-sm text-gray-500 mb-3">
                      <Calendar className="mr-1 h-4 w-4" />
                      <span className="mr-4">
                        {new Date(relatedPost.publishDate).toLocaleDateString()}
                      </span>
                      <Clock className="mr-1 h-4 w-4" />
                      <span>{relatedPost.readTime}</span>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3 line-clamp-2">
                      {relatedPost.title}
                    </h3>
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {relatedPost.excerpt}
                    </p>
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/blog/${relatedPost.id}`}>
                        <BookOpen className="mr-1 h-4 w-4" />
                        Read More
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Newsletter CTA */}
      <section className="bg-gray-900 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Stay Updated with Real Estate Insights
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Subscribe to our newsletter for the latest market trends and expert advice.
          </p>
          <Button asChild className="bg-white text-gray-900 hover:bg-gray-100">
            <Link href="/#newsletter">
              Subscribe to Newsletter
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
