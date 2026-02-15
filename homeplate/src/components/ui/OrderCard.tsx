"use client";

import { Order } from "@/types";
import {
  formatCurrency,
  formatDateTime,
  getStatusColor,
  getStatusLabel,
} from "@/lib/utils";
import { ChevronRight, Truck } from "lucide-react";
import Link from "next/link";

interface OrderCardProps {
  order: Order;
  showActions?: boolean;
  onStatusUpdate?: (status: Order["status"]) => void;
  onRequestCourier?: () => void;
}

export default function OrderCard({
  order,
  showActions = false,
  onStatusUpdate,
  onRequestCourier,
}: OrderCardProps) {
  const nextStatus: Record<string, Order["status"] | null> = {
    pending: "accepted",
    accepted: "preparing",
    preparing: "ready_for_pickup",
    ready_for_pickup: null,
    courier_assigned: null,
    picked_up: null,
    delivered: null,
    cancelled: null,
  };

  const next = nextStatus[order.status];

  return (
    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
      <div className="p-4">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-bold text-gray-900">{order.kitchenName}</h3>
            <p className="text-sm text-gray-500 mt-0.5">
              {formatDateTime(order.createdAt)}
            </p>
          </div>
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
              order.status
            )}`}
          >
            {getStatusLabel(order.status)}
          </span>
        </div>

        <div className="mt-3 space-y-1">
          {order.items.map((item, i) => (
            <div
              key={i}
              className="flex justify-between text-sm text-gray-600"
            >
              <span>
                {item.quantity}x {item.name}
              </span>
              <span>{formatCurrency(item.price * item.quantity)}</span>
            </div>
          ))}
        </div>

        <div className="mt-3 pt-3 border-t border-gray-100 flex justify-between">
          <span className="font-semibold text-gray-900">Total</span>
          <span className="font-bold text-orange-600">
            {formatCurrency(order.total)}
          </span>
        </div>

        {order.deliveryProvider && (
          <div className="mt-2 flex items-center gap-2 text-sm text-gray-500">
            <Truck className="h-4 w-4" />
            <span>
              {order.deliveryProvider}
              {order.estimatedDeliveryTime &&
                ` - Est. delivery ${new Date(
                  order.estimatedDeliveryTime
                ).toLocaleTimeString("en-US", {
                  hour: "numeric",
                  minute: "2-digit",
                })}`}
            </span>
          </div>
        )}

        {order.specialInstructions && (
          <div className="mt-2 bg-yellow-50 rounded-lg p-2 text-sm text-yellow-800">
            Note: {order.specialInstructions}
          </div>
        )}
      </div>

      {/* Actions for kitchen owners */}
      {showActions && (
        <div className="px-4 pb-4 flex gap-2 flex-wrap">
          {next && onStatusUpdate && (
            <button
              onClick={() => onStatusUpdate(next)}
              className="bg-orange-500 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-orange-600 transition-colors"
            >
              Mark as {getStatusLabel(next)}
            </button>
          )}
          {order.status === "ready_for_pickup" && onRequestCourier && (
            <button
              onClick={onRequestCourier}
              className="bg-indigo-500 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-indigo-600 transition-colors flex items-center gap-1"
            >
              <Truck className="h-4 w-4" />
              Request Courier
            </button>
          )}
          {order.status === "pending" && onStatusUpdate && (
            <button
              onClick={() => onStatusUpdate("cancelled")}
              className="bg-white text-red-500 border border-red-200 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-red-50 transition-colors"
            >
              Cancel
            </button>
          )}
        </div>
      )}

      {/* View details link for customers */}
      {!showActions && (
        <Link
          href={`/order/${order.id}`}
          className="flex items-center justify-between px-4 py-3 bg-gray-50 text-sm font-medium text-gray-600 hover:text-orange-500 hover:bg-orange-50 transition-colors"
        >
          View Details
          <ChevronRight className="h-4 w-4" />
        </Link>
      )}
    </div>
  );
}
