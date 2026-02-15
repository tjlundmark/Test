"use client";

import { useStore } from "@/lib/store";
import { useParams } from "next/navigation";
import MenuItemCard from "@/components/ui/MenuItemCard";
import CartSidebar from "@/components/ui/CartSidebar";
import { mockReviews } from "@/lib/mock-data";
import { formatCurrency } from "@/lib/utils";
import {
  Star,
  Clock,
  MapPin,
  ShoppingCart,
  ArrowLeft,
  Shield,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function KitchenDetailPage() {
  const { id } = useParams();
  const { getKitchen, getMenuItemsByKitchen, addToCart, cart } = useStore();
  const [cartOpen, setCartOpen] = useState(false);

  const kitchen = getKitchen(id as string);
  const menuItems = getMenuItemsByKitchen(id as string);
  const reviews = mockReviews.filter((r) => r.kitchenId === id);
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  if (!kitchen) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Kitchen not found</h1>
        <Link href="/browse" className="text-orange-500 font-semibold hover:text-orange-600">
          Back to Browse
        </Link>
      </div>
    );
  }

  // Group menu items by category
  const categories = menuItems.reduce<Record<string, typeof menuItems>>((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {});

  const cuisineEmoji =
    kitchen.cuisineTypes[0] === "Mexican"
      ? "&#x1F32E;"
      : kitchen.cuisineTypes[0] === "Chinese"
      ? "&#x1F95F;"
      : kitchen.cuisineTypes[0] === "Indian"
      ? "&#x1F35B;"
      : "&#x1F37D;";

  return (
    <div>
      {/* Hero Banner */}
      <div className="relative bg-gradient-to-br from-orange-100 to-amber-50 h-64 md:h-80">
        <div
          className="absolute inset-0 flex items-center justify-center text-9xl opacity-20"
          dangerouslySetInnerHTML={{ __html: cuisineEmoji }}
        />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/40 to-transparent h-32" />

        {/* Back button */}
        <div className="absolute top-4 left-4">
          <Link
            href="/browse"
            className="flex items-center gap-1 bg-white/90 backdrop-blur-sm px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-white transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Link>
        </div>

        {/* Cart button */}
        {cartItemCount > 0 && (
          <div className="absolute top-4 right-4">
            <button
              onClick={() => setCartOpen(true)}
              className="flex items-center gap-2 bg-orange-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-orange-600 transition-colors shadow-lg"
            >
              <ShoppingCart className="h-5 w-5" />
              Cart ({cartItemCount})
            </button>
          </div>
        )}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-10 pb-12">
        {/* Kitchen Info Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900">
                  {kitchen.name}
                </h1>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    kitchen.isOpen
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-500"
                  }`}
                >
                  {kitchen.isOpen ? "Open Now" : "Closed"}
                </span>
              </div>

              <div className="flex flex-wrap gap-1.5 mb-3">
                {kitchen.cuisineTypes.map((type) => (
                  <span
                    key={type}
                    className="text-xs bg-orange-50 text-orange-700 px-2 py-0.5 rounded-full"
                  >
                    {type}
                  </span>
                ))}
              </div>

              <p className="text-gray-500 max-w-xl">{kitchen.description}</p>

              <div className="flex flex-wrap items-center gap-4 mt-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold">{kitchen.rating}</span>
                  <span className="text-gray-400">({kitchen.reviewCount} reviews)</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4 text-gray-400" />
                  <span>{kitchen.preparationTimeMinutes} min prep</span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  <span>{kitchen.deliveryRadiusMiles} mi delivery</span>
                </div>
                <div className="flex items-center gap-1">
                  <Shield className="h-4 w-4 text-green-500" />
                  <span className="text-green-600">Health Verified</span>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-4 text-sm min-w-[200px]">
              <h3 className="font-bold text-gray-900 mb-2">Order Info</h3>
              <div className="space-y-1.5 text-gray-600">
                <p>Min. order: {formatCurrency(kitchen.minimumOrderAmount)}</p>
                <p>Delivery fee: {formatCurrency(4.99)}</p>
                <p>Prep time: {kitchen.preparationTimeMinutes} min</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Menu */}
          <div className="lg:col-span-2 space-y-8">
            <h2 className="text-2xl font-extrabold text-gray-900">Menu</h2>

            {Object.entries(categories).map(([category, items]) => (
              <div key={category}>
                <h3 className="text-lg font-bold text-gray-800 mb-4 pb-2 border-b border-gray-100">
                  {category}
                </h3>
                <div className="space-y-3">
                  {items.map((item) => (
                    <MenuItemCard
                      key={item.id}
                      item={item}
                      onAddToCart={(qty) =>
                        addToCart({
                          menuItemId: item.id,
                          name: item.name,
                          price: item.price,
                          quantity: qty,
                          kitchenId: kitchen.id,
                          kitchenName: kitchen.name,
                        })
                      }
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Reviews Sidebar */}
          <div>
            <h2 className="text-2xl font-extrabold text-gray-900 mb-4">Reviews</h2>
            <div className="space-y-4">
              {reviews.length > 0 ? (
                reviews.map((review) => (
                  <div
                    key={review.id}
                    className="bg-white rounded-xl border border-gray-100 p-4"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-gray-900 text-sm">
                        {review.customerName}
                      </span>
                      <div className="flex items-center gap-0.5">
                        {Array.from({ length: review.rating }).map((_, i) => (
                          <Star
                            key={i}
                            className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400"
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">{review.comment}</p>
                    <p className="text-xs text-gray-400 mt-2">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                ))
              ) : (
                <div className="bg-white rounded-xl border border-gray-100 p-6 text-center">
                  <p className="text-gray-400 text-sm">No reviews yet</p>
                </div>
              )}
            </div>

            {/* Operating Hours */}
            <div className="mt-6">
              <h3 className="text-lg font-bold text-gray-900 mb-3">Hours</h3>
              <div className="bg-white rounded-xl border border-gray-100 p-4 space-y-2">
                {kitchen.operatingHours.map((h) => (
                  <div
                    key={h.day}
                    className="flex justify-between text-sm"
                  >
                    <span className="text-gray-600">{h.day}</span>
                    <span className={h.isClosed ? "text-gray-400" : "text-gray-900 font-medium"}>
                      {h.isClosed ? "Closed" : `${h.open} - ${h.close}`}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <CartSidebar isOpen={cartOpen} onClose={() => setCartOpen(false)} />
    </div>
  );
}
