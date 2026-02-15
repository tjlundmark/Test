"use client";

import { useState } from "react";
import { useStore } from "@/lib/store";
import { useRouter } from "next/navigation";
import {
  ChefHat,
  MapPin,
  Clock,
  Shield,
  ArrowRight,
  ArrowLeft,
  Check,
} from "lucide-react";

const CUISINE_OPTIONS = [
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
  "French",
  "Ethiopian",
  "Caribbean",
  "Middle Eastern",
  "Latin American",
  "Southern",
  "BBQ",
  "Vegetarian",
  "Vegan",
  "Bakery",
];

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export default function KitchenRegisterPage() {
  const { currentUser, registerKitchen } = useStore();
  const router = useRouter();
  const [step, setStep] = useState(1);

  const [form, setForm] = useState({
    name: "",
    description: "",
    cuisineTypes: [] as string[],
    street: "",
    city: "",
    state: "",
    zip: "",
    healthPermitNumber: "",
    maxOrdersPerHour: 6,
    preparationTimeMinutes: 30,
    deliveryRadiusMiles: 5,
    minimumOrderAmount: 15,
    operatingHours: DAYS.map((day) => ({
      day,
      open: "11:00",
      close: "20:00",
      isClosed: day === "Sunday",
    })),
  });

  const toggleCuisine = (cuisine: string) => {
    setForm((f) => ({
      ...f,
      cuisineTypes: f.cuisineTypes.includes(cuisine)
        ? f.cuisineTypes.filter((c) => c !== cuisine)
        : [...f.cuisineTypes, cuisine],
    }));
  };

  const updateHours = (index: number, field: string, value: string | boolean) => {
    setForm((f) => ({
      ...f,
      operatingHours: f.operatingHours.map((h, i) =>
        i === index ? { ...h, [field]: value } : h
      ),
    }));
  };

  const handleSubmit = () => {
    if (!currentUser) {
      router.push("/auth/register");
      return;
    }

    registerKitchen({
      cookId: currentUser.id,
      name: form.name,
      description: form.description,
      cuisineTypes: form.cuisineTypes,
      address: {
        street: form.street,
        city: form.city,
        state: form.state,
        zip: form.zip,
        lat: 30.267 + Math.random() * 0.03,
        lng: -97.743 + Math.random() * 0.03,
      },
      coverImage: "",
      profileImage: "",
      isOpen: false,
      operatingHours: form.operatingHours,
      healthPermitNumber: form.healthPermitNumber,
      maxOrdersPerHour: form.maxOrdersPerHour,
      preparationTimeMinutes: form.preparationTimeMinutes,
      deliveryRadiusMiles: form.deliveryRadiusMiles,
      minimumOrderAmount: form.minimumOrderAmount,
    });

    router.push("/kitchen/dashboard");
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      {/* Progress */}
      <div className="flex items-center justify-center gap-2 mb-8">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center gap-2">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${
                step >= s
                  ? "bg-orange-500 text-white"
                  : "bg-gray-200 text-gray-500"
              }`}
            >
              {step > s ? <Check className="h-5 w-5" /> : s}
            </div>
            {s < 3 && (
              <div
                className={`w-12 h-1 rounded ${
                  step > s ? "bg-orange-500" : "bg-gray-200"
                }`}
              />
            )}
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
        {/* Step 1: Basic Info */}
        {step === 1 && (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 rounded-2xl mb-4">
                <ChefHat className="h-8 w-8 text-orange-600" />
              </div>
              <h1 className="text-2xl font-extrabold text-gray-900">
                Set up your kitchen
              </h1>
              <p className="text-gray-500 mt-1">
                Tell us about your cooking and cuisine
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Kitchen Name
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. Maria's Mexican Kitchen"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Tell customers what makes your cooking special..."
                rows={3}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cuisine Types
              </label>
              <div className="flex flex-wrap gap-2">
                {CUISINE_OPTIONS.map((cuisine) => (
                  <button
                    key={cuisine}
                    type="button"
                    onClick={() => toggleCuisine(cuisine)}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                      form.cuisineTypes.includes(cuisine)
                        ? "bg-orange-500 text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {cuisine}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => setStep(2)}
              disabled={!form.name || !form.description || form.cuisineTypes.length === 0}
              className="w-full bg-orange-500 text-white py-3 rounded-xl font-bold hover:bg-orange-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              Continue <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        )}

        {/* Step 2: Location & Compliance */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 rounded-2xl mb-4">
                <MapPin className="h-8 w-8 text-orange-600" />
              </div>
              <h1 className="text-2xl font-extrabold text-gray-900">
                Location & Permits
              </h1>
              <p className="text-gray-500 mt-1">
                Where are you cooking from?
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Street Address
              </label>
              <input
                type="text"
                value={form.street}
                onChange={(e) => setForm({ ...form, street: e.target.value })}
                placeholder="123 Main Street"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                <input
                  type="text"
                  value={form.city}
                  onChange={(e) => setForm({ ...form, city: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                <input
                  type="text"
                  value={form.state}
                  onChange={(e) => setForm({ ...form, state: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ZIP</label>
                <input
                  type="text"
                  value={form.zip}
                  onChange={(e) => setForm({ ...form, zip: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <div className="flex items-center gap-1">
                  <Shield className="h-4 w-4 text-green-500" />
                  Health Permit Number
                </div>
              </label>
              <input
                type="text"
                value={form.healthPermitNumber}
                onChange={(e) => setForm({ ...form, healthPermitNumber: e.target.value })}
                placeholder="HP-2025-XXXXXX"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              <p className="text-xs text-gray-400 mt-1">
                Required for food safety compliance. Check your local cottage food laws.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Delivery Radius (miles)
                </label>
                <input
                  type="number"
                  value={form.deliveryRadiusMiles}
                  onChange={(e) =>
                    setForm({ ...form, deliveryRadiusMiles: parseInt(e.target.value) || 0 })
                  }
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Min. Order Amount ($)
                </label>
                <input
                  type="number"
                  value={form.minimumOrderAmount}
                  onChange={(e) =>
                    setForm({ ...form, minimumOrderAmount: parseInt(e.target.value) || 0 })
                  }
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep(1)}
                className="px-6 py-3 border border-gray-200 rounded-xl font-semibold text-gray-600 hover:bg-gray-50 transition-colors flex items-center gap-1"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </button>
              <button
                onClick={() => setStep(3)}
                disabled={!form.street || !form.city || !form.state || !form.zip}
                className="flex-1 bg-orange-500 text-white py-3 rounded-xl font-bold hover:bg-orange-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                Continue <ArrowRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Operating Hours */}
        {step === 3 && (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 rounded-2xl mb-4">
                <Clock className="h-8 w-8 text-orange-600" />
              </div>
              <h1 className="text-2xl font-extrabold text-gray-900">
                Operating Hours
              </h1>
              <p className="text-gray-500 mt-1">
                When will you be cooking?
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Avg Prep Time (min)
                </label>
                <input
                  type="number"
                  value={form.preparationTimeMinutes}
                  onChange={(e) =>
                    setForm({ ...form, preparationTimeMinutes: parseInt(e.target.value) || 0 })
                  }
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Max Orders/Hour
                </label>
                <input
                  type="number"
                  value={form.maxOrdersPerHour}
                  onChange={(e) =>
                    setForm({ ...form, maxOrdersPerHour: parseInt(e.target.value) || 0 })
                  }
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
            </div>

            <div className="space-y-3">
              {form.operatingHours.map((h, i) => (
                <div
                  key={h.day}
                  className="flex items-center gap-3 bg-gray-50 rounded-lg p-3"
                >
                  <div className="w-24">
                    <span className="text-sm font-medium text-gray-700">
                      {h.day.slice(0, 3)}
                    </span>
                  </div>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={!h.isClosed}
                      onChange={(e) => updateHours(i, "isClosed", !e.target.checked)}
                      className="w-4 h-4 rounded border-gray-300 text-orange-500 focus:ring-orange-500"
                    />
                    <span className="text-xs text-gray-500">Open</span>
                  </label>
                  {!h.isClosed && (
                    <>
                      <input
                        type="time"
                        value={h.open}
                        onChange={(e) => updateHours(i, "open", e.target.value)}
                        className="px-2 py-1 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />
                      <span className="text-gray-400">to</span>
                      <input
                        type="time"
                        value={h.close}
                        onChange={(e) => updateHours(i, "close", e.target.value)}
                        className="px-2 py-1 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />
                    </>
                  )}
                </div>
              ))}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep(2)}
                className="px-6 py-3 border border-gray-200 rounded-xl font-semibold text-gray-600 hover:bg-gray-50 transition-colors flex items-center gap-1"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </button>
              <button
                onClick={handleSubmit}
                className="flex-1 bg-orange-500 text-white py-3 rounded-xl font-bold hover:bg-orange-600 transition-colors flex items-center justify-center gap-2"
              >
                <ChefHat className="h-5 w-5" />
                Launch My Kitchen
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
