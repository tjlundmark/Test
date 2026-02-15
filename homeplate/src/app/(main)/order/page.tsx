"use client";

import { useStore } from "@/lib/store";
import Link from "next/link";
import OrderCard from "@/components/ui/OrderCard";
import { ShoppingBag } from "lucide-react";

export default function OrdersPage() {
  const { currentUser, getOrdersByCustomer } = useStore();

  if (!currentUser) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <ShoppingBag className="h-16 w-16 text-gray-300 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Log in to see your orders
        </h1>
        <Link
          href="/auth/login"
          className="text-orange-500 font-semibold hover:text-orange-600"
        >
          Go to Login
        </Link>
      </div>
    );
  }

  const orders = getOrdersByCustomer(currentUser.id);
  const activeOrders = orders.filter(
    (o) => !["delivered", "cancelled"].includes(o.status)
  );
  const pastOrders = orders.filter((o) =>
    ["delivered", "cancelled"].includes(o.status)
  );

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-8">My Orders</h1>

      {orders.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 p-12 text-center">
          <ShoppingBag className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            No orders yet
          </h2>
          <p className="text-gray-500 mb-6">
            Browse home kitchens and place your first order
          </p>
          <Link
            href="/browse"
            className="bg-orange-500 text-white px-6 py-3 rounded-xl font-bold hover:bg-orange-600 transition-colors"
          >
            Browse Kitchens
          </Link>
        </div>
      ) : (
        <div className="space-y-8">
          {activeOrders.length > 0 && (
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-4">
                Active Orders ({activeOrders.length})
              </h2>
              <div className="space-y-4">
                {activeOrders.map((order) => (
                  <OrderCard key={order.id} order={order} />
                ))}
              </div>
            </div>
          )}

          {pastOrders.length > 0 && (
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-4">
                Past Orders ({pastOrders.length})
              </h2>
              <div className="space-y-4">
                {pastOrders.map((order) => (
                  <OrderCard key={order.id} order={order} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
