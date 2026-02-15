"use client";

import { UtensilsCrossed } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-orange-500 p-2 rounded-xl">
                <UtensilsCrossed className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg font-bold text-white">
                Home<span className="text-orange-400">Plate</span>
              </span>
            </div>
            <p className="text-sm text-gray-400">
              Connecting talented home cooks with hungry neighbors. Real food,
              real people, real delicious.
            </p>
          </div>

          {/* For Customers */}
          <div>
            <h3 className="text-white font-semibold mb-3">For Customers</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/browse" className="hover:text-orange-400 transition-colors">
                  Browse Kitchens
                </Link>
              </li>
              <li>
                <Link href="/order" className="hover:text-orange-400 transition-colors">
                  My Orders
                </Link>
              </li>
              <li>
                <span className="hover:text-orange-400 transition-colors cursor-pointer">
                  How It Works
                </span>
              </li>
            </ul>
          </div>

          {/* For Cooks */}
          <div>
            <h3 className="text-white font-semibold mb-3">For Cooks</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/kitchen/register"
                  className="hover:text-orange-400 transition-colors"
                >
                  Start Cooking
                </Link>
              </li>
              <li>
                <span className="hover:text-orange-400 transition-colors cursor-pointer">
                  Permits & Licensing
                </span>
              </li>
              <li>
                <span className="hover:text-orange-400 transition-colors cursor-pointer">
                  Food Safety Guide
                </span>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-white font-semibold mb-3">Company</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <span className="hover:text-orange-400 transition-colors cursor-pointer">
                  About Us
                </span>
              </li>
              <li>
                <span className="hover:text-orange-400 transition-colors cursor-pointer">
                  Delivery Partners
                </span>
              </li>
              <li>
                <span className="hover:text-orange-400 transition-colors cursor-pointer">
                  Contact
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-500">
            &copy; 2026 HomePlate. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <span className="cursor-pointer hover:text-gray-300">Privacy Policy</span>
            <span className="cursor-pointer hover:text-gray-300">Terms of Service</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
