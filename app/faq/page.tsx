"use client";
import { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    q: "How long does delivery take?",
    a: "Within Nairobi: same-day or next-day. Upcountry: 1–3 business days via courier.",
  },
  {
    q: "How do I pay?",
    a: "We accept M-Pesa, cash on delivery (within Nairobi), and bank transfer. Payment details will be shared on WhatsApp after your order.",
  },
  {
    q: "Are the caps authentic?",
    a: "Yes. We source genuine caps only. Every cap is quality-checked before dispatch.",
  },
  {
    q: "Can I return a cap?",
    a: "Yes. If the cap arrives damaged or different from what you ordered, return it within 3 days for a full refund or exchange.",
  },
  {
    q: "Do you ship outside Kenya?",
    a: "Currently only within Kenya. For special requests, contact us on WhatsApp.",
  },
  {
    q: "Do you offer bulk / wholesale pricing?",
    a: "Yes — for orders of 10+ caps. Message us on WhatsApp for a custom quote.",
  },
];

export default function FAQPage() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-extrabold mb-2">Frequently Asked Questions</h1>
      <p className="text-sm text-gray-500 mb-8">
        Everything you need to know about ordering from us.
      </p>

      <div className="space-y-3">
        {faqs.map((faq, i) => (
          <div
            key={i}
            className="bg-white border border-gray-200 rounded-xl overflow-hidden"
          >
            <button
              onClick={() => setOpen(open === i ? null : i)}
              className="w-full flex justify-between items-center gap-4 p-5 text-left hover:bg-gray-50 transition"
            >
              <span className="font-semibold text-sm md:text-base">{faq.q}</span>
              <ChevronDown
                className={`w-5 h-5 shrink-0 text-gray-400 transition-transform ${
                  open === i ? "rotate-180" : ""
                }`}
              />
            </button>
            {open === i && (
              <div className="px-5 pb-5 text-sm text-gray-600 leading-relaxed">
                {faq.a}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-12 p-6 bg-gray-50 rounded-2xl text-center">
        <h3 className="font-bold mb-2">Still have questions?</h3>
        <p className="text-sm text-gray-500 mb-4">
          Reach us directly on WhatsApp.
        </p>
        <a
          href="https://wa.me/254768988712"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-brand-black text-white px-6 py-3 rounded-lg font-semibold text-sm hover:bg-gray-800 transition"
        >
          Chat with us
        </a>
      </div>
    </div>
  );
}