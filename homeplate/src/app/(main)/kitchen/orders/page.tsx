"use client";

import { useState } from "react";
import { useStore } from "@/lib/store";
import Link from "next/link";
import OrderCard from "@/components/ui/OrderCard";
import { ArrowLeft, Filter } from "lucide-react";

const STATUS_FILTERS = [
  "all",
  "pending",
  "accepted",
  "preparing",
  "ready_for_pickup",
  "courier_assigned",
  "delivered",
  "cancelled",
];

export default function KitchenOrdersPage() {
  const {
    currentUser,
    getKitchenByCookId,
    getOrdersByKitchen,
    updateOrderStatus,
    requestCourierDelivery,
  } = useStore();
  const [statusFilter, setStatusFilter] = useState("all");

  const kitchen = currentUser ? getKitchenByCookId(currentUser.id) : null;
  const orders = kitchen ? getOrdersByKitchen(kitchen.id) : [];

  const filtered =
    statusFilter === "all"
      ? orders
      : orders.filter((o) => o.status === statusFilter);

  if (!currentUser || !kitchen) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Please log in as a cook</h1>
        <Link href="/auth/login" className="text-orange-500 font-semibold">
          Go to Login
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center gap-3 mb-6">
        <Link
          href="/kitchen/dashboard"
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="h-5 w-5 text-gray-600" />
        </Link>
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">All Orders</h1>
          <p className="text-gray-500 text-sm">{orders.length} total orders</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
        <Filter className="h-4 w-4 text-gray-400 flex-shrink-0" />
        {STATUS_FILTERS.map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors capitalize ${
              statusFilter === status
                ? "bg-orange-500 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {status === "all"
              ? "All"
              : status.replace(/_/g, " ")}
          </button>
        ))}
      </div>

      {/* Orders */}
      {filtered.length > 0 ? (
        <div className="space-y-4">
          {filtered.map((order) => (
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
        <div className="bg-white rounded-xl border border-gray-100 p-12 text-center">
          <p className="text-gray-500">No orders found</p>
        </div>
      )}
    </div>
  );
}
