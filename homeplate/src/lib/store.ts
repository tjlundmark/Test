import { create } from "zustand";
import { CartItem, Kitchen, MenuItem, Order, User } from "@/types";
import { mockKitchens, mockMenuItems, mockOrders, mockUsers } from "./mock-data";
import { v4 as uuidv4 } from "uuid";

interface AppState {
  // Auth
  currentUser: User | null;
  users: User[];
  login: (email: string) => boolean;
  logout: () => void;
  registerUser: (user: Omit<User, "id" | "createdAt">) => User;

  // Kitchens
  kitchens: Kitchen[];
  getKitchen: (id: string) => Kitchen | undefined;
  getKitchenByCookId: (cookId: string) => Kitchen | undefined;
  registerKitchen: (kitchen: Omit<Kitchen, "id" | "createdAt" | "rating" | "reviewCount">) => Kitchen;
  updateKitchen: (id: string, updates: Partial<Kitchen>) => void;
  toggleKitchenOpen: (id: string) => void;

  // Menu
  menuItems: MenuItem[];
  getMenuItemsByKitchen: (kitchenId: string) => MenuItem[];
  addMenuItem: (item: Omit<MenuItem, "id">) => MenuItem;
  updateMenuItem: (id: string, updates: Partial<MenuItem>) => void;
  deleteMenuItem: (id: string) => void;

  // Cart
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (menuItemId: string) => void;
  updateCartItemQuantity: (menuItemId: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => { subtotal: number; deliveryFee: number; serviceFee: number; total: number };

  // Orders
  orders: Order[];
  createOrder: (tip: number, specialInstructions?: string) => Order | null;
  updateOrderStatus: (orderId: string, status: Order["status"]) => void;
  getOrdersByCustomer: (customerId: string) => Order[];
  getOrdersByKitchen: (kitchenId: string) => Order[];
  requestCourierDelivery: (orderId: string) => void;
}

export const useStore = create<AppState>((set, get) => ({
  // Auth
  currentUser: null,
  users: mockUsers,

  login: (email: string) => {
    const user = get().users.find((u) => u.email === email);
    if (user) {
      set({ currentUser: user });
      return true;
    }
    return false;
  },

  logout: () => set({ currentUser: null }),

  registerUser: (userData) => {
    const user: User = {
      ...userData,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
    };
    set((state) => ({ users: [...state.users, user], currentUser: user }));
    return user;
  },

  // Kitchens
  kitchens: mockKitchens,

  getKitchen: (id) => get().kitchens.find((k) => k.id === id),

  getKitchenByCookId: (cookId) => get().kitchens.find((k) => k.cookId === cookId),

  registerKitchen: (kitchenData) => {
    const kitchen: Kitchen = {
      ...kitchenData,
      id: uuidv4(),
      rating: 0,
      reviewCount: 0,
      createdAt: new Date().toISOString(),
    };
    set((state) => ({ kitchens: [...state.kitchens, kitchen] }));
    return kitchen;
  },

  updateKitchen: (id, updates) => {
    set((state) => ({
      kitchens: state.kitchens.map((k) => (k.id === id ? { ...k, ...updates } : k)),
    }));
  },

  toggleKitchenOpen: (id) => {
    set((state) => ({
      kitchens: state.kitchens.map((k) =>
        k.id === id ? { ...k, isOpen: !k.isOpen } : k
      ),
    }));
  },

  // Menu
  menuItems: mockMenuItems,

  getMenuItemsByKitchen: (kitchenId) =>
    get().menuItems.filter((m) => m.kitchenId === kitchenId),

  addMenuItem: (itemData) => {
    const item: MenuItem = { ...itemData, id: uuidv4() };
    set((state) => ({ menuItems: [...state.menuItems, item] }));
    return item;
  },

  updateMenuItem: (id, updates) => {
    set((state) => ({
      menuItems: state.menuItems.map((m) => (m.id === id ? { ...m, ...updates } : m)),
    }));
  },

  deleteMenuItem: (id) => {
    set((state) => ({
      menuItems: state.menuItems.filter((m) => m.id !== id),
    }));
  },

  // Cart
  cart: [],

  addToCart: (item) => {
    const { cart } = get();
    // Check if item from different kitchen
    if (cart.length > 0 && cart[0].kitchenId !== item.kitchenId) {
      // Clear cart if ordering from different kitchen
      set({ cart: [item] });
      return;
    }
    const existing = cart.find((c) => c.menuItemId === item.menuItemId);
    if (existing) {
      set({
        cart: cart.map((c) =>
          c.menuItemId === item.menuItemId
            ? { ...c, quantity: c.quantity + item.quantity }
            : c
        ),
      });
    } else {
      set({ cart: [...cart, item] });
    }
  },

  removeFromCart: (menuItemId) => {
    set((state) => ({
      cart: state.cart.filter((c) => c.menuItemId !== menuItemId),
    }));
  },

  updateCartItemQuantity: (menuItemId, quantity) => {
    if (quantity <= 0) {
      get().removeFromCart(menuItemId);
      return;
    }
    set((state) => ({
      cart: state.cart.map((c) =>
        c.menuItemId === menuItemId ? { ...c, quantity } : c
      ),
    }));
  },

  clearCart: () => set({ cart: [] }),

  getCartTotal: () => {
    const { cart } = get();
    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const deliveryFee = cart.length > 0 ? 4.99 : 0;
    const serviceFee = subtotal * 0.1;
    return {
      subtotal,
      deliveryFee,
      serviceFee: Math.round(serviceFee * 100) / 100,
      total: Math.round((subtotal + deliveryFee + serviceFee) * 100) / 100,
    };
  },

  // Orders
  orders: mockOrders,

  createOrder: (tip, specialInstructions) => {
    const { cart, currentUser, getCartTotal } = get();
    if (!currentUser || cart.length === 0) return null;

    const totals = getCartTotal();
    const kitchen = get().getKitchen(cart[0].kitchenId);
    if (!kitchen) return null;

    const order: Order = {
      id: uuidv4(),
      customerId: currentUser.id,
      customerName: currentUser.name,
      kitchenId: cart[0].kitchenId,
      kitchenName: cart[0].kitchenName,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      items: cart.map(({ kitchenId: _, kitchenName: __, ...rest }) => rest),
      subtotal: totals.subtotal,
      deliveryFee: totals.deliveryFee,
      serviceFee: totals.serviceFee,
      tip,
      total: Math.round((totals.total + tip) * 100) / 100,
      status: "pending",
      deliveryAddress: currentUser.address || {
        street: "",
        city: "",
        state: "",
        zip: "",
        lat: 0,
        lng: 0,
      },
      specialInstructions,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    set((state) => ({
      orders: [order, ...state.orders],
      cart: [],
    }));

    return order;
  },

  updateOrderStatus: (orderId, status) => {
    set((state) => ({
      orders: state.orders.map((o) =>
        o.id === orderId
          ? { ...o, status, updatedAt: new Date().toISOString() }
          : o
      ),
    }));
  },

  getOrdersByCustomer: (customerId) =>
    get().orders.filter((o) => o.customerId === customerId),

  getOrdersByKitchen: (kitchenId) =>
    get().orders.filter((o) => o.kitchenId === kitchenId),

  requestCourierDelivery: (orderId) => {
    // Simulate requesting a courier from DoorDash/Uber
    const providers = ["DoorDash", "Uber Direct", "Postmates"];
    const provider = providers[Math.floor(Math.random() * providers.length)];
    const estimatedMinutes = 15 + Math.floor(Math.random() * 20);
    const estimatedTime = new Date(
      Date.now() + estimatedMinutes * 60 * 1000
    ).toISOString();

    set((state) => ({
      orders: state.orders.map((o) =>
        o.id === orderId
          ? {
              ...o,
              status: "courier_assigned" as const,
              deliveryProvider: provider,
              estimatedDeliveryTime: estimatedTime,
              deliveryTrackingUrl: `https://${provider.toLowerCase().replace(" ", "")}.com/track/${orderId}`,
              updatedAt: new Date().toISOString(),
            }
          : o
      ),
    }));
  },
}));
