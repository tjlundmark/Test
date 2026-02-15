"use client";

import { MenuItem } from "@/types";
import { formatCurrency } from "@/lib/utils";
import { Plus, Minus, AlertTriangle } from "lucide-react";
import { useState } from "react";

interface MenuItemCardProps {
  item: MenuItem;
  onAddToCart: (quantity: number) => void;
}

export default function MenuItemCard({ item, onAddToCart }: MenuItemCardProps) {
  const [quantity, setQuantity] = useState(1);

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-4 hover:shadow-md transition-shadow">
      <div className="flex justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h4 className="font-semibold text-gray-900">{item.name}</h4>
            {item.isPopular && (
              <span className="text-xs bg-red-50 text-red-600 px-2 py-0.5 rounded-full font-medium">
                Popular
              </span>
            )}
          </div>
          <p className="text-sm text-gray-500 mt-1 line-clamp-2">
            {item.description}
          </p>
          {item.allergens.length > 0 && (
            <div className="flex items-center gap-1 mt-2">
              <AlertTriangle className="h-3 w-3 text-amber-500" />
              <span className="text-xs text-amber-600">
                {item.allergens.join(", ")}
              </span>
            </div>
          )}
          <p className="font-bold text-orange-600 mt-2">
            {formatCurrency(item.price)}
          </p>
        </div>
        <div className="flex flex-col items-end justify-between">
          <div className="w-20 h-20 rounded-lg bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center text-3xl">
            {item.category === "Dumplings"
              ? "🥟"
              : item.category === "Noodles"
              ? "🍜"
              : item.category === "Drinks"
              ? "🥤"
              : item.category === "Desserts"
              ? "🍰"
              : item.category === "Appetizers"
              ? "🥗"
              : item.category === "Breads"
              ? "🫓"
              : item.category === "South Indian"
              ? "🫓"
              : "🍽️"}
          </div>
        </div>
      </div>

      {item.isAvailable ? (
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-50">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="p-1 rounded-md bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              <Minus className="h-4 w-4" />
            </button>
            <span className="w-8 text-center font-semibold">{quantity}</span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="p-1 rounded-md bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
          <button
            onClick={() => {
              onAddToCart(quantity);
              setQuantity(1);
            }}
            className="bg-orange-500 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-orange-600 transition-colors"
          >
            Add {formatCurrency(item.price * quantity)}
          </button>
        </div>
      ) : (
        <div className="mt-3 pt-3 border-t border-gray-50">
          <span className="text-sm text-gray-400 font-medium">
            Currently Unavailable
          </span>
        </div>
      )}
    </div>
  );
}
