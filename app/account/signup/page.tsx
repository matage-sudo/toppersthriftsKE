"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signUp } from "@/hooks/useAuth";
import { ArrowLeft, Mail, Lock, User, Phone, MapPin, Check } from "lucide-react";

export default function SignupPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    location: "",
  });
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!agreed) {
      setError("You must agree to the Terms & Conditions and Privacy Policy.");
      return;
    }
    if (form.password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (form.phone.replace(/\D/g, "").length < 10) {
      setError("Please enter a valid phone number.");
      return;
    }

    setLoading(true);
    try {
      await signUp({
        email: form.email,
        password: form.password,
        name: form.name,
        phone: form.phone,
        location: form.location,
      });
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || "Signup failed. Please try again.");
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gray-50 dark:bg-gray-900">
        <div className="w-full max-w-md bg-white dark:bg-gray-950 rounded-2xl border border-gray-200 dark:border-gray-800 p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-950/40 flex items-center justify-center mx-auto mb-5">
            <Check className="w-7 h-7 text-green-600 dark:text-green-400" />
          </div>
          <h1 className="text-2xl font-extrabold mb-3 text-brand-black dark:text-white">
            Check your email
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
            We sent a confirmation link to <span className="font-semibold text-brand-black dark:text-white">{form.email}</span>. Click it to activate your account, then sign in.
          </p>
          <Link
            href="/account/login"
            className="inline-block bg-brand-black dark:bg-white text-white dark:text-black px-6 py-3 rounded-lg font-bold text-sm"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-md bg-white dark:bg-gray-950 rounded-2xl border border-gray-200 dark:border-gray-800 p-8">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-brand-black dark:hover:text-white transition mb-6">
          <ArrowLeft className="w-4 h-4" /> Back
        </Link>

        <h1 className="text-2xl font-extrabold mb-2 text-brand-black dark:text-white">
          Create your account
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">
          Fast checkout. Order tracking. Zero spam.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-1 text-brand-black dark:text-white">Full Name *</label>
            <div className="relative">
              <User className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
              <input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Jane Wanjiku" className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-brand-black dark:text-white outline-none focus:border-brand-black dark:focus:border-white transition text-sm" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1 text-brand-black dark:text-white">Email *</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
              <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-brand-black dark:text-white outline-none focus:border-brand-black dark:focus:border-white transition text-sm" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1 text-brand-black dark:text-white">Password *</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
              <input type="password" required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="At least 8 characters" className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-brand-black dark:text-white outline-none focus:border-brand-black dark:focus:border-white transition text-sm" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1 text-brand-black dark:text-white">Phone Number *</label>
            <div className="relative">
              <Phone className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
              <input type="tel" required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="0712 345 678" className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-brand-black dark:text-white outline-none focus:border-brand-black dark:focus:border-white transition text-sm" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1 text-brand-black dark:text-white">Delivery Location *</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
              <input type="text" required value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="Nairobi CBD" className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-brand-black dark:text-white outline-none focus:border-brand-black dark:focus:border-white transition text-sm" />
            </div>
          </div>

          <label className="flex items-start gap-3 cursor-pointer pt-2">
            <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} className="mt-1 w-4 h-4 accent-brand-black cursor-pointer" />
            <span className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
              I agree to the{" "}
              <Link href="/terms" target="_blank" className="text-brand-black dark:text-white underline font-semibold">Terms</Link>{" "}
              and{" "}
              <Link href="/privacy" target="_blank" className="text-brand-black dark:text-white underline font-semibold">Privacy Policy</Link>.
            </span>
          </label>

          {error && (
            <div className="text-sm text-red-600 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-lg p-3">
              {error}
            </div>
          )}

          <button type="submit" disabled={loading} className="w-full bg-brand-black dark:bg-white text-white dark:text-black py-3 rounded-lg font-bold hover:bg-gray-800 dark:hover:bg-gray-200 transition disabled:opacity-50">
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>

        <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-6">
          Already have an account?{" "}
          <Link href="/account/login" className="text-brand-black dark:text-white underline font-semibold">Sign in</Link>
        </p>
      </div>
    </div>
  );
}