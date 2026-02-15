"use client";

import { useState } from "react";
import { useStore } from "@/lib/store";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { UtensilsCrossed, Mail, Lock } from "lucide-react";

export default function LoginPage() {
  const { login } = useStore();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (login(email)) {
      router.push("/browse");
    } else {
      setError("No account found with that email. Try one of the demo accounts below.");
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="bg-orange-500 p-2 rounded-xl">
              <UtensilsCrossed className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-gray-900">
              Home<span className="text-orange-500">Plate</span>
            </span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Welcome back</h1>
          <p className="text-gray-500 mt-1">Log in to your account</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Your password"
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  required
                />
              </div>
            </div>
            {error && (
              <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg">{error}</div>
            )}
            <button
              type="submit"
              className="w-full bg-orange-500 text-white py-3 rounded-xl font-bold hover:bg-orange-600 transition-colors"
            >
              Log In
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-100">
            <p className="text-sm text-gray-500 text-center mb-3">Quick login with demo accounts:</p>
            <div className="space-y-2">
              <button
                onClick={() => { setEmail("alex@example.com"); setPassword("demo"); }}
                className="w-full text-left px-3 py-2 bg-gray-50 rounded-lg text-sm hover:bg-gray-100 transition-colors"
              >
                <span className="font-medium">Customer:</span>{" "}
                <span className="text-gray-500">alex@example.com</span>
              </button>
              <button
                onClick={() => { setEmail("maria@example.com"); setPassword("demo"); }}
                className="w-full text-left px-3 py-2 bg-gray-50 rounded-lg text-sm hover:bg-gray-100 transition-colors"
              >
                <span className="font-medium">Cook:</span>{" "}
                <span className="text-gray-500">maria@example.com</span>
              </button>
            </div>
          </div>
        </div>

        <p className="text-center text-sm text-gray-500 mt-6">
          Don&apos;t have an account?{" "}
          <Link href="/auth/register" className="text-orange-500 font-semibold hover:text-orange-600">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
