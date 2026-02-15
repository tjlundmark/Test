"use client";

import { useState } from "react";
import { useStore } from "@/lib/store";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils";
import {
  Plus,
  ArrowLeft,
  Pencil,
  Trash2,
  X,
  Check,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";

export default function KitchenMenuPage() {
  const {
    currentUser,
    getKitchenByCookId,
    getMenuItemsByKitchen,
    addMenuItem,
    updateMenuItem,
    deleteMenuItem,
  } = useStore();

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    allergens: "",
    preparationTimeMinutes: "20",
    isAvailable: true,
    isPopular: false,
  });

  const kitchen = currentUser ? getKitchenByCookId(currentUser.id) : null;
  const menuItems = kitchen ? getMenuItemsByKitchen(kitchen.id) : [];

  if (!currentUser || !kitchen) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Please log in as a cook</h1>
        <Link href="/auth/login" className="text-orange-500 font-semibold">
          Go to Login
        </Link>
      </div>
    );
  }

  const categories = menuItems.reduce<Record<string, typeof menuItems>>((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {});

  const resetForm = () => {
    setForm({
      name: "",
      description: "",
      price: "",
      category: "",
      allergens: "",
      preparationTimeMinutes: "20",
      isAvailable: true,
      isPopular: false,
    });
    setShowForm(false);
    setEditingId(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      kitchenId: kitchen.id,
      name: form.name,
      description: form.description,
      price: parseFloat(form.price) || 0,
      image: "",
      category: form.category,
      allergens: form.allergens
        .split(",")
        .map((a) => a.trim())
        .filter(Boolean),
      isAvailable: form.isAvailable,
      isPopular: form.isPopular,
      preparationTimeMinutes: parseInt(form.preparationTimeMinutes) || 20,
    };

    if (editingId) {
      updateMenuItem(editingId, data);
    } else {
      addMenuItem(data);
    }
    resetForm();
  };

  const startEdit = (item: (typeof menuItems)[0]) => {
    setForm({
      name: item.name,
      description: item.description,
      price: item.price.toString(),
      category: item.category,
      allergens: item.allergens.join(", "),
      preparationTimeMinutes: item.preparationTimeMinutes.toString(),
      isAvailable: item.isAvailable,
      isPopular: item.isPopular,
    });
    setEditingId(item.id);
    setShowForm(true);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <Link
            href="/kitchen/dashboard"
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </Link>
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900">Menu Manager</h1>
            <p className="text-gray-500 text-sm">{menuItems.length} items</p>
          </div>
        </div>
        <button
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
          className="flex items-center gap-2 bg-orange-500 text-white px-4 py-2.5 rounded-xl font-semibold hover:bg-orange-600 transition-colors"
        >
          <Plus className="h-5 w-5" />
          Add Item
        </button>
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <div className="bg-white rounded-2xl border border-orange-200 p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900">
              {editingId ? "Edit Menu Item" : "Add Menu Item"}
            </h2>
            <button onClick={resetForm} className="text-gray-400 hover:text-gray-600">
              <X className="h-5 w-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Dish name"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <input
                  type="text"
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  placeholder="e.g. Entrees, Appetizers, Drinks"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Describe your dish..."
                rows={2}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
                required
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price ($)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  placeholder="0.00"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Prep Time (min)
                </label>
                <input
                  type="number"
                  value={form.preparationTimeMinutes}
                  onChange={(e) =>
                    setForm({ ...form, preparationTimeMinutes: e.target.value })
                  }
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Allergens
                </label>
                <input
                  type="text"
                  value={form.allergens}
                  onChange={(e) => setForm({ ...form, allergens: e.target.value })}
                  placeholder="Dairy, Gluten..."
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
            </div>
            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.isAvailable}
                  onChange={(e) => setForm({ ...form, isAvailable: e.target.checked })}
                  className="w-4 h-4 rounded border-gray-300 text-orange-500 focus:ring-orange-500"
                />
                <span className="text-sm font-medium text-gray-700">Available</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.isPopular}
                  onChange={(e) => setForm({ ...form, isPopular: e.target.checked })}
                  className="w-4 h-4 rounded border-gray-300 text-orange-500 focus:ring-orange-500"
                />
                <span className="text-sm font-medium text-gray-700">Mark as Popular</span>
              </label>
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={resetForm}
                className="px-6 py-2.5 border border-gray-200 rounded-xl font-semibold text-gray-600 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 bg-orange-500 text-white py-2.5 rounded-xl font-bold hover:bg-orange-600 transition-colors flex items-center justify-center gap-2"
              >
                <Check className="h-5 w-5" />
                {editingId ? "Update Item" : "Add to Menu"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Menu Items */}
      {Object.entries(categories).map(([category, items]) => (
        <div key={category} className="mb-8">
          <h2 className="text-lg font-bold text-gray-800 mb-3 pb-2 border-b border-gray-100">
            {category}
          </h2>
          <div className="space-y-2">
            {items.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-xl border border-gray-100 p-4 flex items-center justify-between hover:shadow-sm transition-shadow"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-gray-900">{item.name}</h3>
                    {item.isPopular && (
                      <span className="text-xs bg-red-50 text-red-600 px-2 py-0.5 rounded-full">
                        Popular
                      </span>
                    )}
                    {!item.isAvailable && (
                      <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
                        Unavailable
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 mt-0.5 line-clamp-1">
                    {item.description}
                  </p>
                </div>
                <div className="flex items-center gap-3 ml-4">
                  <span className="font-bold text-orange-600">
                    {formatCurrency(item.price)}
                  </span>
                  <button
                    onClick={() =>
                      updateMenuItem(item.id, { isAvailable: !item.isAvailable })
                    }
                    className="text-gray-400 hover:text-orange-500"
                    title={item.isAvailable ? "Mark unavailable" : "Mark available"}
                  >
                    {item.isAvailable ? (
                      <ToggleRight className="h-5 w-5 text-green-500" />
                    ) : (
                      <ToggleLeft className="h-5 w-5" />
                    )}
                  </button>
                  <button
                    onClick={() => startEdit(item)}
                    className="text-gray-400 hover:text-blue-500"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => deleteMenuItem(item.id)}
                    className="text-gray-400 hover:text-red-500"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {menuItems.length === 0 && !showForm && (
        <div className="bg-white rounded-xl border border-gray-100 p-12 text-center">
          <div className="text-5xl mb-4">&#x1F37D;</div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">
            Your menu is empty
          </h3>
          <p className="text-gray-500 mb-4">
            Add your first dish to start accepting orders
          </p>
          <button
            onClick={() => setShowForm(true)}
            className="bg-orange-500 text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-orange-600 transition-colors"
          >
            Add First Item
          </button>
        </div>
      )}
    </div>
  );
}
