import { Property, BlogPost, Testimonial } from "@/types";

export const featuredProperties: Property[] = [
  {
    id: "1",
    title: "Luxury Villa in DHA Phase 5",
    description: "Beautiful luxury villa in prime location",
    price: 85000000,
    location: "DHA Phase 5, Lahore",
    city: "Lahore",
    state: "Punjab",
    bedrooms: 5,
    bathrooms: 4,
    sqft: 4500,
    image: "https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=800",
    featured: true,
    type: "house",
    purpose: "SALE",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "2",
    title: "Modern Apartment in Clifton",
    price: 35000000,
    location: "Clifton Block 2, Karachi",
    city: "Karachi",
    state: "Sindh",
    bedrooms: 3,
    bathrooms: 2,
    sqft: 1800,
    image:
      "https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg?auto=compress&cs=tinysrgb&w=800",
    featured: true,
    type: "apartment",
  },
  {
    id: "3",
    title: "Family Home in F-10 Islamabad",
    price: 45000000,
    location: "F-10 Markaz, Islamabad",
    city: "Islamabad",
    state: "ICT",
    bedrooms: 4,
    bathrooms: 3,
    sqft: 3200,
    image:
      "https://images.pexels.com/photos/1974596/pexels-photo-1974596.jpeg?auto=compress&cs=tinysrgb&w=800",
    featured: true,
    type: "house",
  },
  {
    id: "4",
    title: "Penthouse in Emaar Canyon Views",
    price: 95000000,
    location: "Emaar Canyon Views, Islamabad",
    city: "Islamabad",
    state: "ICT",
    bedrooms: 4,
    bathrooms: 3,
    sqft: 3500,
    image:
      "https://images.pexels.com/photos/2581922/pexels-photo-2581922.jpeg?auto=compress&cs=tinysrgb&w=800",
    featured: true,
    type: "apartment",
  },
  {
    id: "5",
    title: "Townhouse in Bahria Town",
    price: 28000000,
    location: "Bahria Town Phase 4, Rawalpindi",
    city: "Rawalpindi",
    state: "Punjab",
    bedrooms: 3,
    bathrooms: 2,
    sqft: 2100,
    image:
      "https://images.pexels.com/photos/1438832/pexels-photo-1438832.jpeg?auto=compress&cs=tinysrgb&w=800",
    featured: true,
    type: "townhouse",
  },
  {
    id: "6",
    title: "Farmhouse in Multan Road",
    price: 65000000,
    location: "Multan Road, Lahore",
    city: "Lahore",
    state: "Punjab",
    bedrooms: 6,
    bathrooms: 5,
    sqft: 5500,
    image:
      "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=800",
    featured: true,
    type: "house",
  },
];

export const allProperties: Property[] = [
  ...featuredProperties,
  {
    id: "7",
    title: "Cozy Home in Gulberg",
    price: 22000000,
    location: "Gulberg III, Lahore",
    city: "Lahore",
    state: "Punjab",
    bedrooms: 3,
    bathrooms: 2,
    sqft: 1800,
    image:
      "https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=800",
    featured: false,
    type: "house",
  },
  {
    id: "8",
    title: "Studio Apartment in Blue Area",
    price: 18000000,
    location: "Blue Area, Islamabad",
    city: "Islamabad",
    state: "ICT",
    bedrooms: 1,
    bathrooms: 1,
    sqft: 800,
    image:
      "https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=800",
    featured: false,
    type: "apartment",
  },
];

export const blogPosts: BlogPost[] = [
  {
    id: "1",
    title: "Top 10 Property Buying Tips for First-Time Buyers in Pakistan",
    excerpt:
      "Navigate Pakistan's property market with confidence using these expert tips and insights.",
    content: "Full blog content here...",
    author: "Ahmed Hassan",
    publishDate: "2024-01-15",
    category: "Buying Tips",
    image:
      "https://images.pexels.com/photos/1370704/pexels-photo-1370704.jpeg?auto=compress&cs=tinysrgb&w=800",
    readTime: "5 min read",
  },
  {
    id: "2",
    title: "Pakistan Real Estate Market Trends: What to Expect in 2024",
    excerpt:
      "Discover the latest trends and predictions for Pakistan's real estate market in the upcoming year.",
    content: "Full blog content here...",
    author: "Fatima Khan",
    publishDate: "2024-01-10",
    category: "Market Analysis",
    image:
      "https://images.pexels.com/photos/590020/pexels-photo-590020.jpeg?auto=compress&cs=tinysrgb&w=800",
    readTime: "7 min read",
  },
  {
    id: "3",
    title: "How to Stage Your Property for Quick Sale in Pakistan",
    excerpt:
      "Learn professional staging techniques to make your property more appealing to Pakistani buyers.",
    content: "Full blog content here...",
    author: "Sara Ali",
    publishDate: "2024-01-05",
    category: "Selling Tips",
    image:
      "https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=800",
    readTime: "6 min read",
  },
  {
    id: "4",
    title: "Investment Properties in Pakistan: A Beginner's Guide",
    excerpt:
      "Everything you need to know about investing in Pakistani real estate for rental income.",
    content: "Full blog content here...",
    author: "Muhammad Ali",
    publishDate: "2023-12-28",
    category: "Investment",
    image:
      "https://images.pexels.com/photos/1438832/pexels-photo-1438832.jpeg?auto=compress&cs=tinysrgb&w=800",
    readTime: "8 min read",
  },
  {
    id: "5",
    title: "Understanding Property Financing Options in Pakistan",
    excerpt:
      "A comprehensive guide to different financing options and how to secure the best rates in Pakistan.",
    content: "Full blog content here...",
    author: "Ayesha Malik",
    publishDate: "2023-12-20",
    category: "Financing",
    image:
      "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=800",
    readTime: "10 min read",
  },
  {
    id: "6",
    title: "Luxury Property Features That Add Value in Pakistan",
    excerpt:
      "Discover which luxury amenities provide the best return on investment in Pakistani properties.",
    content: "Full blog content here...",
    author: "Hassan Sheikh",
    publishDate: "2023-12-15",
    category: "Luxury Market",
    image:
      "https://images.pexels.com/photos/2581922/pexels-photo-2581922.jpeg?auto=compress&cs=tinysrgb&w=800",
    readTime: "6 min read",
  },
];

export const testimonials: Testimonial[] = [
  {
    id: "1",
    name: "Amna Shahid",
    role: "Property Buyer",
    content:
      "Zameen Khatta made our dream home purchase in Lahore seamless. Their expertise and dedication exceeded our expectations.",
    rating: 5,
    image:
      "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400",
  },
  {
    id: "2",
    name: "Tariq Ahmed",
    role: "Property Investor",
    content:
      "Outstanding service and market knowledge. They helped me build a profitable real estate portfolio across Pakistan.",
    rating: 5,
    image:
      "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=400",
  },
  {
    id: "3",
    name: "Sadia Khan",
    role: "Property Seller",
    content:
      "Sold our property in Islamabad above asking price in just three weeks. Their marketing strategy was incredibly effective.",
    rating: 5,
    image:
      "https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=400",
  },
  {
    id: "4",
    name: "Omar Farooq",
    role: "First-Time Buyer",
    content:
      "Patient, knowledgeable, and truly cared about finding us the perfect home in Karachi within our budget.",
    rating: 5,
    image:
      "https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=400",
  },
];
