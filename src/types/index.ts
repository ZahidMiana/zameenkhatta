export interface Property {
  id: string;
  title: string;
  description?: string;
  price: number;
  location: string;
  city: string;
  state: string;
  bedrooms: number;
  bathrooms: number;
  sqft: number;
  image: string;
  images?: string;
  featured: boolean;
  approved?: boolean;
  type: "house" | "apartment" | "condo" | "townhouse" | "plot" | "commercial" | "office";
  purpose?: "SALE" | "RENT";
  coordinates?: {
    lat: number;
    lng: number;
  };
  userId?: string;
  user?: {
    id: string;
    name?: string;
    email: string;
    phone?: string;
  };
  createdAt?: string;
  updatedAt?: string;
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  publishDate: string;
  category: string;
  image: string;
  readTime: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  content: string;
  rating: number;
  image: string;
}

export interface ContactFormData {
  fullName: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

export interface User {
  id: string;
  name?: string;
  email: string;
  password: string; // required for credentials
  image?: string;
  role: "USER" | "ADMIN";
  createdAt: string;
  updatedAt: string;
}

export type SafeUser = Omit<User, "password" | "createdAt" | "updatedAt">;

export interface AuthSession {
  user: SafeUser;
  expires: string;
}
