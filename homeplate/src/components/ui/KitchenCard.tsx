"use client";

import { Kitchen } from "@/types";
import { Star, Clock, MapPin } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface KitchenCardProps {
  kitchen: Kitchen;
}

export default function KitchenCard({ kitchen }: KitchenCardProps) {
  return (
    <Link href={`/browse/${kitchen.id}`}>
      <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-lg hover:border-orange-200 transition-all duration-300 group">
        {/* Cover Image */}
        <div className="relative h-48 bg-gradient-to-br from-orange-100 to-amber-50 overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-6xl">
              {kitchen.cuisineTypes[0] === "Mexican"
                ? "🌮"
                : kitchen.cuisineTypes[0] === "Chinese"
                ? "🥟"
                : kitchen.cuisineTypes[0] === "Indian"
                ? "🍛"
                : "🍽️"}
            </span>
          </div>
          {/* Status badge */}
          <div className="absolute top-3 right-3">
            <span
              className={cn(
                "px-3 py-1 rounded-full text-xs font-semibold",
                kitchen.isOpen
                  ? "bg-green-100 text-green-700"
                  : "bg-gray-100 text-gray-500"
              )}
            >
              {kitchen.isOpen ? "Open Now" : "Closed"}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="font-bold text-lg text-gray-900 group-hover:text-orange-600 transition-colors">
            {kitchen.name}
          </h3>
          <div className="flex flex-wrap gap-1.5 mt-2">
            {kitchen.cuisineTypes.map((type) => (
              <span
                key={type}
                className="text-xs bg-orange-50 text-orange-700 px-2 py-0.5 rounded-full"
              >
                {type}
              </span>
            ))}
          </div>
          <p className="text-sm text-gray-500 mt-2 line-clamp-2">
            {kitchen.description}
          </p>

          <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-50">
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="font-semibold text-sm">{kitchen.rating}</span>
              <span className="text-gray-400 text-sm">
                ({kitchen.reviewCount})
              </span>
            </div>
            <div className="flex items-center gap-1 text-gray-500">
              <Clock className="h-3.5 w-3.5" />
              <span className="text-sm">{kitchen.preparationTimeMinutes} min</span>
            </div>
            <div className="flex items-center gap-1 text-gray-500">
              <MapPin className="h-3.5 w-3.5" />
              <span className="text-sm">{kitchen.deliveryRadiusMiles} mi</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
