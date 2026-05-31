"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Invalid credentials");
      }

      // Save the JWT token to local storage
      localStorage.setItem("token", data.token);
      
      // Redirect to the main application page
      router.push("/");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 rounded-xl border border-slate-800 bg-[#0f172a] p-8 shadow-xl">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-white">
            Sign In
          </h2>
          <p className="mt-2 text-center text-sm text-slate-400">
            Welcome back to Healthway Portal
          </p>
        </div>

        {/* Error Message Display */}
        {error && (
          <div className="p-3 text-sm text-red-400 bg-red-900/30 border border-red-800 rounded-md">
            {error}
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4 rounded-md shadow-sm">
            {[ 
              { label: "Email Address", placeholder: "doctor@healthway.com", value: formData.email, type: "email", key: "email" },
              { label: "Password", placeholder: "••••••••", value: formData.password, type: "password", key: "password" }
            ].map((field) => (
              <div key={field.key}>
                <label className="block text-sm font-medium text-slate-300 mb-1">{field.label}</label>
                <input
                  type={field.type}
                  required
                  className="relative block w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-white placeholder-slate-500 focus:z-10 focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                  placeholder={field.placeholder}
                  value={field.value}
                  onChange={(e) => setFormData({ ...formData, [field.key]: e.target.value })}
                />
              </div>
            ))}
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative flex w-full justify-center rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:cursor-not-allowed disabled:bg-blue-800"
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </button>
          </div>
        </form>
        <p className="text-center text-sm text-slate-400 mt-4">
          Don&apos;t have an account?{" "}
          <Link href="/auth/signup" className="font-medium text-blue-500 hover:text-blue-400">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}