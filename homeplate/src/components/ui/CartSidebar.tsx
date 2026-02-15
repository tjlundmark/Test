"use client";

import { useStore } from "@/lib/store";
import { formatCurrency } from "@/lib/utils";
import { Minus, Plus, ShoppingCart, Trash2, X } from "lucide-react";
import { useState } from "react";

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartSidebar({ isOpen, onClose }: CartSidebarProps) {
  const {
    cart,
    removeFromCart,
    updateCartItemQuantity,
    clearCart,
    getCartTotal,
    createOrder,
    currentUser,
  } = useStore();

  const [tip, setTip] = useState(0);
  const [instructions, setInstructions] = useState("");
  const [orderPlaced, setOrderPlaced] = useState(false);

  const totals = getCartTotal();

  const handlePlaceOrder = () => {
    if (!currentUser) return;
    const order = createOrder(tip, instructions || undefined);
    if (order) {
      setOrderPlaced(true);
      setTimeout(() => {
        setOrderPlaced(false);
        onClose();
      }, 3000);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative w-full max-w-md bg-white shadow-2xl flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5 text-orange-500" />
            <h2 className="text-lg font-bold">Your Order</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {orderPlaced ? (
          <div className="flex-1 flex items-center justify-center p-8">
            <div className="text-center">
              <div className="text-6xl mb-4">🎉</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Order Placed!
              </h3>
              <p className="text-gray-500">
                Your order has been sent to the kitchen. You can track it in My
                Orders.
              </p>
            </div>
          </div>
        ) : cart.length === 0 ? (
          <div className="flex-1 flex items-center justify-center p-8">
            <div className="text-center">
              <ShoppingCart className="h-16 w-16 text-gray-200 mx-auto mb-4" />
              <p className="text-gray-400 font-medium">Your cart is empty</p>
              <p className="text-sm text-gray-300 mt-1">
                Add items from a kitchen to get started
              </p>
            </div>
          </div>
        ) : (
          <>
            {/* Kitchen name */}
            <div className="px-4 py-3 bg-orange-50 border-b border-orange-100">
              <p className="text-sm font-semibold text-orange-800">
                {cart[0].kitchenName}
              </p>
            </div>

            {/* Cart items */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {cart.map((item) => (
                <div
                  key={item.menuItemId}
                  className="flex items-center gap-3 bg-gray-50 rounded-lg p-3"
                >
                  <div className="flex-1">
                    <h4 className="font-medium text-sm text-gray-900">
                      {item.name}
                    </h4>
                    <p className="text-sm text-orange-600 font-semibold">
                      {formatCurrency(item.price * item.quantity)}
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() =>
                        updateCartItemQuantity(
                          item.menuItemId,
                          item.quantity - 1
                        )
                      }
                      className="p-1 rounded bg-white border border-gray-200 hover:bg-gray-100"
                    >
                      <Minus className="h-3 w-3" />
                    </button>
                    <span className="w-6 text-center text-sm font-semibold">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() =>
                        updateCartItemQuantity(
                          item.menuItemId,
                          item.quantity + 1
                        )
                      }
                      className="p-1 rounded bg-white border border-gray-200 hover:bg-gray-100"
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.menuItemId)}
                    className="p-1 text-gray-400 hover:text-red-500"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}

              {/* Special instructions */}
              <div className="pt-2">
                <label className="text-sm font-medium text-gray-700">
                  Special Instructions
                </label>
                <textarea
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  placeholder="Any allergies or preferences..."
                  className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
                  rows={2}
                />
              </div>

              {/* Tip */}
              <div className="pt-2">
                <label className="text-sm font-medium text-gray-700">
                  Add a tip for the cook
                </label>
                <div className="flex gap-2 mt-1.5">
                  {[0, 3, 5, 8].map((amount) => (
                    <button
                      key={amount}
                      onClick={() => setTip(amount)}
                      className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-colors ${
                        tip === amount
                          ? "bg-orange-500 text-white"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      {amount === 0 ? "None" : formatCurrency(amount)}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Totals */}
            <div className="border-t border-gray-100 p-4 space-y-2">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Subtotal</span>
                <span>{formatCurrency(totals.subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Delivery fee</span>
                <span>{formatCurrency(totals.deliveryFee)}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Service fee</span>
                <span>{formatCurrency(totals.serviceFee)}</span>
              </div>
              {tip > 0 && (
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Tip</span>
                  <span>{formatCurrency(tip)}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-gray-900 pt-2 border-t border-gray-100">
                <span>Total</span>
                <span className="text-orange-600">
                  {formatCurrency(totals.total + tip)}
                </span>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  onClick={clearCart}
                  className="px-4 py-3 border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  Clear
                </button>
                <button
                  onClick={handlePlaceOrder}
                  disabled={!currentUser}
                  className="flex-1 bg-orange-500 text-white py-3 rounded-xl text-sm font-bold hover:bg-orange-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  {currentUser ? "Place Order" : "Log in to Order"}
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
