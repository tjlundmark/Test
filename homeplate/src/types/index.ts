export interface User {
  id: string;
  email: string;
  name: string;
  role: "customer" | "cook";
  phone: string;
  address?: Address;
  createdAt: string;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  zip: string;
  lat: number;
  lng: number;
}

export interface Kitchen {
  id: string;
  cookId: string;
  name: string;
  description: string;
  cuisineTypes: string[];
  address: Address;
  coverImage: string;
  profileImage: string;
  rating: number;
  reviewCount: number;
  isOpen: boolean;
  operatingHours: OperatingHours[];
  healthPermitNumber: string;
  maxOrdersPerHour: number;
  preparationTimeMinutes: number;
  deliveryRadiusMiles: number;
  minimumOrderAmount: number;
  createdAt: string;
}

export interface OperatingHours {
  day: string;
  open: string;
  close: string;
  isClosed: boolean;
}

export interface MenuItem {
  id: string;
  kitchenId: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  allergens: string[];
  isAvailable: boolean;
  isPopular: boolean;
  preparationTimeMinutes: number;
}

export interface Order {
  id: string;
  customerId: string;
  customerName: string;
  kitchenId: string;
  kitchenName: string;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  serviceFee: number;
  tip: number;
  total: number;
  status: OrderStatus;
  deliveryAddress: Address;
  deliveryProvider?: string;
  deliveryTrackingUrl?: string;
  estimatedDeliveryTime?: string;
  specialInstructions?: string;
  createdAt: string;
  updatedAt: string;
}

export type OrderStatus =
  | "pending"
  | "accepted"
  | "preparing"
  | "ready_for_pickup"
  | "courier_assigned"
  | "picked_up"
  | "delivered"
  | "cancelled";

export interface OrderItem {
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
  specialInstructions?: string;
}

export interface CartItem extends OrderItem {
  kitchenId: string;
  kitchenName: string;
}

export interface Review {
  id: string;
  orderId: string;
  customerId: string;
  customerName: string;
  kitchenId: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface DeliveryQuote {
  provider: string;
  estimatedMinutes: number;
  fee: number;
  trackingUrl?: string;
}
