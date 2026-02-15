"use client";

import { useState } from "react";
import { useStore } from "@/lib/store";
import KitchenCard from "@/components/ui/KitchenCard";
import CartSidebar from "@/components/ui/CartSidebar";
import { Search, SlidersHorizontal, ShoppingCart } from "lucide-react";

const CUISINE_FILTERS = [
  "All",
  "Mexican",
  "Chinese",
  "Indian",
  "Italian",
  "Japanese",
  "Thai",
  "Mediterranean",
  "American",
  "Korean",
  "Vietnamese",
];

export default function BrowsePage() {
  const { kitchens, cart } = useStore();
  const [search, setSearch] = useState("");
  const [cuisineFilter, setCuisineFilter] = useState("All");
  const [showOpenOnly, setShowOpenOnly] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);

  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const filtered = kitchens.filter((k) => {
    if (search) {
      const q = search.toLowerCase();
      const matches =
        k.name.toLowerCase().includes(q) ||
        k.description.toLowerCase().includes(q) ||
        k.cuisineTypes.some((c) => c.toLowerCase().includes(q));
      if (!matches) return false;
    }
    if (cuisineFilter !== "All") {
      if (!k.cuisineTypes.some((c) => c.toLowerCase().includes(cuisineFilter.toLowerCase()))) {
        return false;
      }
    }
    if (showOpenOnly && !k.isOpen) return false;
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900">Browse Kitchens</h1>
          <p className="text-gray-500 mt-1">
            {filtered.length} kitchen{filtered.length !== 1 ? "s" : ""} near you
          </p>
        </div>
        {cartItemCount > 0 && (
          <button
            onClick={() => setCartOpen(true)}
            className="flex items-center gap-2 bg-orange-500 text-white px-4 py-2.5 rounded-xl font-semibold hover:bg-orange-600 transition-colors"
          >
            <ShoppingCart className="h-5 w-5" />
            Cart ({cartItemCount})
          </button>
        )}
      </div>

      {/* Search & Filters */}
      <div className="bg-white rounded-2xl border border-gray-100 p-4 mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search kitchens, cuisines, dishes..."
              className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={showOpenOnly}
              onChange={(e) => setShowOpenOnly(e.target.checked)}
              className="w-4 h-4 rounded border-gray-300 text-orange-500 focus:ring-orange-500"
            />
            <span className="text-sm font-medium text-gray-700 whitespace-nowrap">
              Open now
            </span>
          </label>
        </div>

        {/* Cuisine Tabs */}
        <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
          {CUISINE_FILTERS.map((cuisine) => (
            <button
              key={cuisine}
              onClick={() => setCuisineFilter(cuisine)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                cuisineFilter === cuisine
                  ? "bg-orange-500 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {cuisine}
            </button>
          ))}
        </div>
      </div>

      {/* Kitchen Grid */}
      {filtered.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((kitchen) => (
            <KitchenCard key={kitchen.id} kitchen={kitchen} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <SlidersHorizontal className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">No kitchens found</h3>
          <p className="text-gray-400">Try adjusting your search or filters</p>
        </div>
      )}

      <CartSidebar isOpen={cartOpen} onClose={() => setCartOpen(false)} />
    </div>
  );
}
