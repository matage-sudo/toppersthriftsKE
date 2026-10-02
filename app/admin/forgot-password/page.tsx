"use client";
import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Mail, Check } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function AdminForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const supabase = createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + "/admin/reset-password",
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    setSent(true);
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gray-50 dark:bg-gray-950">
      <div className="w-full max-w-md bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-8">
        <Link href="/admin/login" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-brand-black dark:hover:text-white transition mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to admin login
        </Link>

        {sent ? (
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-950/40 flex items-center justify-center mx-auto mb-5">
              <Check className="w-7 h-7 text-green-600 dark:text-green-400" />
            </div>
            <h1 className="text-2xl font-extrabold mb-3 text-brand-black dark:text-white">Check your email</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Reset link sent to <span className="font-semibold text-brand-black dark:text-white">{email}</span>.
            </p>
          </div>
        ) : (
          <>
            <h1 className="text-2xl font-extrabold mb-2 text-brand-black dark:text-white">Admin password reset</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">
              Enter your admin email to receive a reset link.
            </p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-1 text-brand-black dark:text-white">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 text-brand-black dark:text-white outline-none focus:border-brand-black dark:focus:border-white transition text-sm"
                  />
                </div>
              </div>
              {error && (
                <div className="text-sm text-red-600 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-lg p-3">
                  {error}
                </div>
              )}
              <button type="submit" disabled={loading} className="w-full bg-brand-black dark:bg-white text-white dark:text-black py-3 rounded-lg font-bold disabled:opacity-50">
                {loading ? "Sending..." : "Send Reset Link"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}