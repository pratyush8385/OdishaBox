"use client";

import React, { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { Lock, Mail, User, Phone, AlertCircle, ArrowRight } from "lucide-react";

function RegisterForm() {
  const { register } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await register(email, password, name, phone || undefined);
      router.push(`/${redirect}`);
    } catch (err: any) {
      setError(err.message || "Registration failed. Try a different email!");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-md w-full mx-auto bg-white border border-gray-100 p-8 sm:p-10 rounded-[2.5rem] shadow-sm space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-black text-gray-900">Create Account</h1>
        <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Start shopping authentic Odia food</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-100 text-red-700 text-xs font-bold p-4 rounded-2xl flex items-center gap-2">
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <input
            type="text"
            required
            placeholder="Full Name"
            className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-4 pl-12 text-xs focus:outline-none focus:ring-1 focus:ring-primary focus:bg-white text-gray-700"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <User className="absolute left-4 top-4.5 text-gray-400" size={16} />
        </div>

        <div className="relative">
          <input
            type="email"
            required
            placeholder="Email address"
            className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-4 pl-12 text-xs focus:outline-none focus:ring-1 focus:ring-primary focus:bg-white text-gray-700"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Mail className="absolute left-4 top-4.5 text-gray-400" size={16} />
        </div>

        <div className="relative">
          <input
            type="tel"
            placeholder="Phone Number (Optional)"
            className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-4 pl-12 text-xs focus:outline-none focus:ring-1 focus:ring-primary focus:bg-white text-gray-700"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <Phone className="absolute left-4 top-4.5 text-gray-400" size={16} />
        </div>

        <div className="relative">
          <input
            type="password"
            required
            placeholder="Password (Min 6 characters)"
            className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-4 pl-12 text-xs focus:outline-none focus:ring-1 focus:ring-primary focus:bg-white text-gray-700"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Lock className="absolute left-4 top-4.5 text-gray-400" size={16} />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-primary hover:bg-primary/95 text-white py-4 rounded-full font-black uppercase tracking-widest text-xs transition-all shadow flex items-center justify-center gap-1.5 disabled:opacity-50"
        >
          {submitting ? "Signing Up..." : "Create Account"} <ArrowRight size={14} />
        </button>
      </form>

      <div className="text-center text-xs text-gray-500 font-medium pt-2">
        Already have an account?{" "}
        <Link href={`/login?redirect=${redirect}`} className="text-primary font-bold hover:underline">
          Sign In
        </Link>
      </div>
    </div>
  );
}

export default function Register() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <Suspense fallback={<div className="text-center font-bold">Loading Form...</div>}>
        <RegisterForm />
      </Suspense>
    </div>
  );
}
