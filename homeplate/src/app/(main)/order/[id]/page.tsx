"use client";

import { useStore } from "@/lib/store";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  formatCurrency,
  formatDateTime,
  getStatusColor,
  getStatusLabel,
} from "@/lib/utils";
import {
  ArrowLeft,
  MapPin,
  Truck,
  Clock,
  ChefHat,
  CheckCircle2,
  Package,
  ExternalLink,
} from "lucide-react";

const ORDER_STEPS = [
  { status: "pending", label: "Order Placed", icon: Package },
  { status: "accepted", label: "Accepted", icon: CheckCircle2 },
  { status: "preparing", label: "Preparing", icon: ChefHat },
  { status: "ready_for_pickup", label: "Ready", icon: Package },
  { status: "courier_assigned", label: "Courier Assigned", icon: Truck },
  { status: "picked_up", label: "Picked Up", icon: Truck },
  { status: "delivered", label: "Delivered", icon: CheckCircle2 },
];

export default function OrderDetailPage() {
  const { id } = useParams();
  const { orders } = useStore();

  const order = orders.find((o) => o.id === id);

  if (!order) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Order not found
        </h1>
        <Link
          href="/order"
          className="text-orange-500 font-semibold hover:text-orange-600"
        >
          Back to Orders
        </Link>
      </div>
    );
  }

  const currentStepIndex = ORDER_STEPS.findIndex(
    (s) => s.status === order.status
  );
  const isCancelled = order.status === "cancelled";

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Link
          href="/order"
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="h-5 w-5 text-gray-600" />
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-extrabold text-gray-900">
            Order Details
          </h1>
          <p className="text-sm text-gray-500">
            Order #{order.id.slice(-8).toUpperCase()}
          </p>
        </div>
        <span
          className={`px-3 py-1.5 rounded-full text-sm font-semibold ${getStatusColor(
            order.status
          )}`}
        >
          {getStatusLabel(order.status)}
        </span>
      </div>

      {/* Progress Tracker */}
      {!isCancelled && (
        <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
          <h2 className="font-bold text-gray-900 mb-4">Order Progress</h2>
          <div className="relative">
            {/* Progress line */}
            <div className="absolute left-[19px] top-0 bottom-0 w-0.5 bg-gray-200" />
            <div
              className="absolute left-[19px] top-0 w-0.5 bg-orange-500 transition-all"
              style={{
                height: `${Math.max(
                  0,
                  (currentStepIndex / (ORDER_STEPS.length - 1)) * 100
                )}%`,
              }}
            />

            <div className="space-y-6 relative">
              {ORDER_STEPS.map((step, i) => {
                const isActive = i <= currentStepIndex;
                const isCurrent = i === currentStepIndex;
                const StepIcon = step.icon;

                return (
                  <div key={step.status} className="flex items-center gap-4">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 z-10 ${
                        isActive
                          ? isCurrent
                            ? "bg-orange-500 text-white ring-4 ring-orange-100"
                            : "bg-orange-500 text-white"
                          : "bg-gray-100 text-gray-400"
                      }`}
                    >
                      <StepIcon className="h-5 w-5" />
                    </div>
                    <div>
                      <p
                        className={`font-medium ${
                          isActive ? "text-gray-900" : "text-gray-400"
                        }`}
                      >
                        {step.label}
                      </p>
                      {isCurrent && (
                        <p className="text-sm text-orange-500 font-medium">
                          Current step
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Courier Info */}
      {order.deliveryProvider && (
        <div className="bg-indigo-50 rounded-2xl border border-indigo-100 p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-indigo-100 p-2 rounded-xl">
                <Truck className="h-5 w-5 text-indigo-600" />
              </div>
              <div>
                <p className="font-bold text-indigo-900">
                  {order.deliveryProvider}
                </p>
                {order.estimatedDeliveryTime && (
                  <p className="text-sm text-indigo-600 flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    Est. delivery:{" "}
                    {new Date(order.estimatedDeliveryTime).toLocaleTimeString(
                      "en-US",
                      { hour: "numeric", minute: "2-digit" }
                    )}
                  </p>
                )}
              </div>
            </div>
            {order.deliveryTrackingUrl && (
              <span className="flex items-center gap-1 text-sm font-semibold text-indigo-600 bg-indigo-100 px-3 py-1.5 rounded-lg cursor-pointer hover:bg-indigo-200 transition-colors">
                <ExternalLink className="h-4 w-4" />
                Track
              </span>
            )}
          </div>
        </div>
      )}

      {/* Order Items */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
        <h2 className="font-bold text-gray-900 mb-1">
          {order.kitchenName}
        </h2>
        <p className="text-sm text-gray-500 mb-4">
          {formatDateTime(order.createdAt)}
        </p>

        <div className="space-y-3 mb-4">
          {order.items.map((item, i) => (
            <div key={i} className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="bg-orange-100 text-orange-700 text-xs font-bold rounded-md px-2 py-0.5">
                  {item.quantity}x
                </span>
                <span className="text-gray-800">{item.name}</span>
              </div>
              <span className="text-gray-600 font-medium">
                {formatCurrency(item.price * item.quantity)}
              </span>
            </div>
          ))}
        </div>

        <div className="border-t border-gray-100 pt-3 space-y-2 text-sm">
          <div className="flex justify-between text-gray-600">
            <span>Subtotal</span>
            <span>{formatCurrency(order.subtotal)}</span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>Delivery fee</span>
            <span>{formatCurrency(order.deliveryFee)}</span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>Service fee</span>
            <span>{formatCurrency(order.serviceFee)}</span>
          </div>
          {order.tip > 0 && (
            <div className="flex justify-between text-gray-600">
              <span>Tip</span>
              <span>{formatCurrency(order.tip)}</span>
            </div>
          )}
          <div className="flex justify-between font-bold text-gray-900 pt-2 border-t border-gray-100 text-base">
            <span>Total</span>
            <span className="text-orange-600">
              {formatCurrency(order.total)}
            </span>
          </div>
        </div>
      </div>

      {/* Delivery Address */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <h2 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
          <MapPin className="h-5 w-5 text-gray-400" />
          Delivery Address
        </h2>
        <p className="text-gray-600">
          {order.deliveryAddress.street}
          <br />
          {order.deliveryAddress.city}, {order.deliveryAddress.state}{" "}
          {order.deliveryAddress.zip}
        </p>
      </div>

      {order.specialInstructions && (
        <div className="bg-yellow-50 rounded-2xl border border-yellow-100 p-4 mt-4">
          <p className="text-sm font-medium text-yellow-800">
            Special Instructions: {order.specialInstructions}
          </p>
        </div>
      )}
    </div>
  );
}
