export type Category = "streetwear" | "drip" | "hype" | "legacy" | "iconic";

export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: Category;
  brand: string;
  isOffer: boolean;
  isFeatured: boolean;
  inStock: boolean;
  rating?: number;
  createdAt: string;
}

export interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  stock: number;
}

export interface Order {
  id: string;
  customer: string;
  phone: string;
  location: string;
  total: number;
  status: "pending" | "shipped" | "delivered";
  items: CartItem[];
  createdAt: string;
}