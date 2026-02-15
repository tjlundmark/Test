"use client";

import Link from "next/link";
import { useStore } from "@/lib/store";
import KitchenCard from "@/components/ui/KitchenCard";
import {
  ChefHat,
  MapPin,
  Shield,
  Truck,
  Star,
  ArrowRight,
  Utensils,
  Heart,
  Clock,
} from "lucide-react";

export default function HomePage() {
  const { kitchens } = useStore();
  const featuredKitchens = kitchens.filter((k) => k.isOpen).slice(0, 3);

  return (
    <div>
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-orange-500 via-orange-400 to-amber-400 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 text-8xl">&#x1F373;</div>
          <div className="absolute top-20 right-20 text-7xl">&#x1F958;</div>
          <div className="absolute bottom-10 left-1/3 text-9xl">&#x1F372;</div>
          <div className="absolute bottom-20 right-10 text-6xl">&#x1F957;</div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32 relative z-10">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-6xl font-extrabold text-white leading-tight">
              Homemade food from your
              <span className="block text-yellow-200">neighbors&apos; kitchens</span>
            </h1>
            <p className="mt-6 text-lg md:text-xl text-orange-100 max-w-lg">
              Discover incredible home cooks in your neighborhood. Order
              authentic, homemade meals delivered straight to your door.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <Link
                href="/browse"
                className="inline-flex items-center justify-center gap-2 bg-white text-orange-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-orange-50 transition-colors shadow-lg"
              >
                <MapPin className="h-5 w-5" />
                Find Food Near Me
              </Link>
              <Link
                href="/kitchen/register"
                className="inline-flex items-center justify-center gap-2 bg-orange-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-orange-700 transition-colors border-2 border-orange-300"
              >
                <ChefHat className="h-5 w-5" />
                Start Cooking
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900">
              How HomePlate Works
            </h2>
            <p className="mt-4 text-lg text-gray-500 max-w-2xl mx-auto">
              From kitchen to doorstep in three simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center group">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-orange-100 rounded-2xl mb-6 group-hover:bg-orange-200 transition-colors">
                <MapPin className="h-10 w-10 text-orange-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                1. Discover
              </h3>
              <p className="text-gray-500">
                Browse home kitchens near you. Each cook is verified with a food
                safety permit and health inspection.
              </p>
            </div>
            <div className="text-center group">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-orange-100 rounded-2xl mb-6 group-hover:bg-orange-200 transition-colors">
                <Utensils className="h-10 w-10 text-orange-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                2. Order
              </h3>
              <p className="text-gray-500">
                Pick your favorite dishes from authentic home menus. Every meal
                is freshly prepared just for you.
              </p>
            </div>
            <div className="text-center group">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-orange-100 rounded-2xl mb-6 group-hover:bg-orange-200 transition-colors">
                <Truck className="h-10 w-10 text-orange-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                3. Enjoy
              </h3>
              <p className="text-gray-500">
                Your food arrives via our courier partners like DoorDash. Hot,
                fresh, and made with love.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Kitchens */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-extrabold text-gray-900">
                Popular Kitchens Near You
              </h2>
              <p className="mt-2 text-gray-500">
                Discover top-rated home cooks in your area
              </p>
            </div>
            <Link
              href="/browse"
              className="hidden md:flex items-center gap-1 text-orange-500 font-semibold hover:text-orange-600 transition-colors"
            >
              View All <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredKitchens.length > 0 ? (
              featuredKitchens.map((kitchen) => (
                <KitchenCard key={kitchen.id} kitchen={kitchen} />
              ))
            ) : (
              <div className="col-span-3 text-center py-12">
                <p className="text-gray-400">
                  No kitchens are open right now. Check back later!
                </p>
              </div>
            )}
          </div>

          <div className="mt-8 text-center md:hidden">
            <Link
              href="/browse"
              className="inline-flex items-center gap-1 text-orange-500 font-semibold hover:text-orange-600 transition-colors"
            >
              View All Kitchens <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* For Cooks Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-flex items-center gap-1 text-sm font-semibold text-orange-500 bg-orange-50 px-3 py-1 rounded-full mb-4">
                <ChefHat className="h-4 w-4" />
                For Home Cooks
              </span>
              <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900">
                Turn your kitchen into a business
              </h2>
              <p className="mt-4 text-lg text-gray-500">
                Share your culinary talent with your community. Set your own
                menu, hours, and prices. We handle delivery through our courier
                partners.
              </p>

              <div className="mt-8 space-y-4">
                <div className="flex items-start gap-3">
                  <div className="bg-green-100 rounded-lg p-2 mt-0.5">
                    <Heart className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">Cook what you love</h4>
                    <p className="text-sm text-gray-500">
                      Set your own menu with your best recipes. No corporate restrictions.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-blue-100 rounded-lg p-2 mt-0.5">
                    <Clock className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">Your schedule, your rules</h4>
                    <p className="text-sm text-gray-500">
                      Open when you want. Cook as much or as little as you like.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-purple-100 rounded-lg p-2 mt-0.5">
                    <Truck className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">No delivery hassle</h4>
                    <p className="text-sm text-gray-500">
                      We connect with DoorDash, Uber, and other couriers so you can focus on cooking.
                    </p>
                  </div>
                </div>
              </div>

              <Link
                href="/kitchen/register"
                className="mt-8 inline-flex items-center gap-2 bg-orange-500 text-white px-6 py-3 rounded-xl font-bold hover:bg-orange-600 transition-colors"
              >
                Get Started <ArrowRight className="h-5 w-5" />
              </Link>
            </div>

            <div className="bg-gradient-to-br from-orange-100 to-amber-50 rounded-3xl p-8 text-center">
              <div className="text-8xl mb-6">&#x1F469;&#x200D;&#x1F373;</div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white rounded-xl p-4 shadow-sm">
                  <div className="text-2xl font-extrabold text-orange-600">500+</div>
                  <div className="text-sm text-gray-500">Active Cooks</div>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-sm">
                  <div className="text-2xl font-extrabold text-orange-600">50k+</div>
                  <div className="text-sm text-gray-500">Meals Served</div>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-sm">
                  <div className="text-2xl font-extrabold text-orange-600">4.8</div>
                  <div className="text-sm text-gray-500">Avg Rating</div>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-sm">
                  <div className="text-2xl font-extrabold text-orange-600">$2k+</div>
                  <div className="text-sm text-gray-500">Avg Monthly</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold">Safe, verified, and delicious</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <Shield className="h-10 w-10 text-orange-400 mx-auto mb-4" />
              <h3 className="font-bold text-lg mb-2">Health Verified</h3>
              <p className="text-gray-400 text-sm">
                Every kitchen passes health and safety inspections before going live.
              </p>
            </div>
            <div className="text-center">
              <Star className="h-10 w-10 text-orange-400 mx-auto mb-4" />
              <h3 className="font-bold text-lg mb-2">Community Rated</h3>
              <p className="text-gray-400 text-sm">
                Real reviews from real neighbors. Transparent ratings you can trust.
              </p>
            </div>
            <div className="text-center">
              <Truck className="h-10 w-10 text-orange-400 mx-auto mb-4" />
              <h3 className="font-bold text-lg mb-2">Professional Delivery</h3>
              <p className="text-gray-400 text-sm">
                Powered by DoorDash and other top courier networks for reliable delivery.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-24 bg-orange-500">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">
            Ready to taste the neighborhood?
          </h2>
          <p className="text-orange-100 text-lg mb-8">
            Join thousands of food lovers discovering amazing home-cooked meals nearby.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/browse"
              className="inline-flex items-center justify-center gap-2 bg-white text-orange-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-orange-50 transition-colors"
            >
              Order Now
            </Link>
            <Link
              href="/kitchen/register"
              className="inline-flex items-center justify-center gap-2 bg-orange-700 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-orange-800 transition-colors"
            >
              Start Your Kitchen
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
