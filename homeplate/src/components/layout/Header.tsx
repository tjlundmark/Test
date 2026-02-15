"use client";

import Link from "next/link";
import { useStore } from "@/lib/store";
import {
  ChefHat,
  ShoppingCart,
  User,
  LogOut,
  UtensilsCrossed,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";

export default function Header() {
  const { currentUser, logout, cart } = useStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="bg-orange-500 p-2 rounded-xl">
              <UtensilsCrossed className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">
              Home<span className="text-orange-500">Plate</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/browse"
              className="text-gray-600 hover:text-orange-500 font-medium transition-colors"
            >
              Browse Kitchens
            </Link>
            {currentUser?.role === "cook" && (
              <Link
                href="/kitchen/dashboard"
                className="text-gray-600 hover:text-orange-500 font-medium transition-colors flex items-center gap-1"
              >
                <ChefHat className="h-4 w-4" />
                My Kitchen
              </Link>
            )}
            {!currentUser && (
              <Link
                href="/kitchen/register"
                className="text-gray-600 hover:text-orange-500 font-medium transition-colors"
              >
                Become a Cook
              </Link>
            )}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-4">
            {currentUser ? (
              <>
                <Link
                  href="/browse"
                  className="relative text-gray-600 hover:text-orange-500 transition-colors"
                >
                  <ShoppingCart className="h-6 w-6" />
                  {cartItemCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                      {cartItemCount}
                    </span>
                  )}
                </Link>
                <div className="hidden md:flex items-center gap-3">
                  <Link
                    href="/order"
                    className="text-gray-600 hover:text-orange-500 font-medium transition-colors"
                  >
                    My Orders
                  </Link>
                  <div className="flex items-center gap-2 text-gray-700">
                    <div className="bg-orange-100 rounded-full p-1.5">
                      <User className="h-4 w-4 text-orange-600" />
                    </div>
                    <span className="text-sm font-medium">{currentUser.name}</span>
                  </div>
                  <button
                    onClick={logout}
                    className="text-gray-400 hover:text-red-500 transition-colors"
                    title="Log out"
                  >
                    <LogOut className="h-5 w-5" />
                  </button>
                </div>
              </>
            ) : (
              <div className="hidden md:flex items-center gap-3">
                <Link
                  href="/auth/login"
                  className="text-gray-600 hover:text-orange-500 font-medium transition-colors"
                >
                  Log In
                </Link>
                <Link
                  href="/auth/register"
                  className="bg-orange-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-orange-600 transition-colors"
                >
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              className="md:hidden text-gray-600"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-100">
            <div className="flex flex-col gap-3">
              <Link
                href="/browse"
                className="text-gray-600 hover:text-orange-500 font-medium py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Browse Kitchens
              </Link>
              {currentUser?.role === "cook" && (
                <Link
                  href="/kitchen/dashboard"
                  className="text-gray-600 hover:text-orange-500 font-medium py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  My Kitchen
                </Link>
              )}
              {currentUser ? (
                <>
                  <Link
                    href="/order"
                    className="text-gray-600 hover:text-orange-500 font-medium py-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    My Orders
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                    className="text-red-500 font-medium py-2 text-left"
                  >
                    Log Out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/auth/login"
                    className="text-gray-600 hover:text-orange-500 font-medium py-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Log In
                  </Link>
                  <Link
                    href="/auth/register"
                    className="text-orange-500 font-medium py-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                  <Link
                    href="/kitchen/register"
                    className="text-gray-600 hover:text-orange-500 font-medium py-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Become a Cook
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
