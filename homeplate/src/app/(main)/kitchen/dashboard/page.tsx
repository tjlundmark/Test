"use client";

import { useStore } from "@/lib/store";
import Link from "next/link";
import {
  ChefHat,
  DollarSign,
  ShoppingBag,
  Star,
  ToggleLeft,
  ToggleRight,
  Clock,
  TrendingUp,
  UtensilsCrossed,
  ClipboardList,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import OrderCard from "@/components/ui/OrderCard";

export default function KitchenDashboardPage() {
  const {
    currentUser,
    getKitchenByCookId,
    toggleKitchenOpen,
    getOrdersByKitchen,
    updateOrderStatus,
    requestCourierDelivery,
    getMenuItemsByKitchen,
  } = useStore();

  if (!currentUser) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Please log in</h1>
        <Link href="/auth/login" className="text-orange-500 font-semibold">
          Go to Login
        </Link>
      </div>
    );
  }

  const kitchen = getKitchenByCookId(currentUser.id);

  if (!kitchen) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <ChefHat className="h-16 w-16 text-gray-300 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          No kitchen registered yet
        </h1>
        <p className="text-gray-500 mb-6">Set up your home kitchen to start accepting orders</p>
        <Link
          href="/kitchen/register"
          className="bg-orange-500 text-white px-6 py-3 rounded-xl font-bold hover:bg-orange-600 transition-colors"
        >
          Register Your Kitchen
        </Link>
      </div>
    );
  }

  const orders = getOrdersByKitchen(kitchen.id);
  const menuItems = getMenuItemsByKitchen(kitchen.id);
  const activeOrders = orders.filter(
    (o) => !["delivered", "cancelled"].includes(o.status)
  );
  const completedOrders = orders.filter((o) => o.status === "delivered");
  const totalRevenue = completedOrders.reduce((sum, o) => sum + o.subtotal, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900">
            {kitchen.name}
          </h1>
          <p className="text-gray-500 mt-1">Kitchen Dashboard</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => toggleKitchenOpen(kitchen.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold transition-colors ${
              kitchen.isOpen
                ? "bg-green-100 text-green-700 hover:bg-green-200"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {kitchen.isOpen ? (
              <ToggleRight className="h-5 w-5" />
            ) : (
              <ToggleLeft className="h-5 w-5" />
            )}
            {kitchen.isOpen ? "Open for Orders" : "Closed"}
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="bg-orange-100 rounded-lg p-1.5">
              <ShoppingBag className="h-4 w-4 text-orange-600" />
            </div>
            <span className="text-sm text-gray-500">Active Orders</span>
          </div>
          <p className="text-2xl font-extrabold text-gray-900">
            {activeOrders.length}
          </p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="bg-green-100 rounded-lg p-1.5">
              <DollarSign className="h-4 w-4 text-green-600" />
            </div>
            <span className="text-sm text-gray-500">Revenue</span>
          </div>
          <p className="text-2xl font-extrabold text-gray-900">
            {formatCurrency(totalRevenue)}
          </p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="bg-blue-100 rounded-lg p-1.5">
              <TrendingUp className="h-4 w-4 text-blue-600" />
            </div>
            <span className="text-sm text-gray-500">Total Orders</span>
          </div>
          <p className="text-2xl font-extrabold text-gray-900">{orders.length}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="bg-yellow-100 rounded-lg p-1.5">
              <Star className="h-4 w-4 text-yellow-600" />
            </div>
            <span className="text-sm text-gray-500">Rating</span>
          </div>
          <p className="text-2xl font-extrabold text-gray-900">{kitchen.rating}</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        <Link
          href="/kitchen/menu"
          className="bg-white rounded-xl border border-gray-100 p-4 hover:shadow-md hover:border-orange-200 transition-all flex items-center gap-3"
        >
          <div className="bg-orange-100 rounded-lg p-2">
            <UtensilsCrossed className="h-5 w-5 text-orange-600" />
          </div>
          <div>
            <p className="font-bold text-gray-900">Manage Menu</p>
            <p className="text-sm text-gray-500">{menuItems.length} items</p>
          </div>
        </Link>
        <Link
          href="/kitchen/orders"
          className="bg-white rounded-xl border border-gray-100 p-4 hover:shadow-md hover:border-orange-200 transition-all flex items-center gap-3"
        >
          <div className="bg-blue-100 rounded-lg p-2">
            <ClipboardList className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <p className="font-bold text-gray-900">All Orders</p>
            <p className="text-sm text-gray-500">View history</p>
          </div>
        </Link>
        <Link
          href={`/browse/${kitchen.id}`}
          className="bg-white rounded-xl border border-gray-100 p-4 hover:shadow-md hover:border-orange-200 transition-all flex items-center gap-3"
        >
          <div className="bg-green-100 rounded-lg p-2">
            <Star className="h-5 w-5 text-green-600" />
          </div>
          <div>
            <p className="font-bold text-gray-900">View Listing</p>
            <p className="text-sm text-gray-500">See public page</p>
          </div>
        </Link>
      </div>

      {/* Active Orders */}
      <div>
        <h2 className="text-xl font-extrabold text-gray-900 mb-4">
          Active Orders ({activeOrders.length})
        </h2>
        {activeOrders.length > 0 ? (
          <div className="space-y-4">
            {activeOrders.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                showActions
                onStatusUpdate={(status) => updateOrderStatus(order.id, status)}
                onRequestCourier={() => requestCourierDelivery(order.id)}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-100 p-8 text-center">
            <Clock className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 font-medium">No active orders</p>
            <p className="text-sm text-gray-400 mt-1">
              {kitchen.isOpen
                ? "New orders will appear here"
                : "Open your kitchen to start receiving orders"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
