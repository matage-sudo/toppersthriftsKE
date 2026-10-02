import Link from "next/link";
import { Camera, MessageCircle, Music, Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="relative mt-24 overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/caps/knicks-orange-black.jpg')" }}
        aria-hidden="true"
      />
      {/* Dark overlay for readability */}
      <div
        className="absolute inset-0 bg-black/80 dark:bg-black/85"
        aria-hidden="true"
      />
      {/* Accent gradient on top */}
      <div
        className="absolute inset-0 bg-gradient-to-br from-black/60 via-transparent to-red-950/40"
        aria-hidden="true"
      />

      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-white">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          <div className="col-span-2 md:col-span-1">
            <h3 className="text-lg font-extrabold mb-3">
              Toppersthrifts<span className="text-red-500">KE</span>
            </h3>
            <p className="text-sm text-gray-300 leading-relaxed mb-4">
              Premium caps delivered across Kenya. Bold style. Fair prices. No gatekeeping.
            </p>
            <div className="flex gap-3">
              <a
                href="#"
                aria-label="Instagram"
                className="w-9 h-9 rounded-full bg-white/10 backdrop-blur border border-white/20 flex items-center justify-center hover:bg-white hover:text-black transition"
              >
                <Camera className="w-4 h-4" />
              </a>
              <a
                href="https://wa.me/254768988712"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="w-9 h-9 rounded-full bg-white/10 backdrop-blur border border-white/20 flex items-center justify-center hover:bg-white hover:text-black transition"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
              <a
                href="#"
                aria-label="TikTok"
                className="w-9 h-9 rounded-full bg-white/10 backdrop-blur border border-white/20 flex items-center justify-center hover:bg-white hover:text-black transition"
              >
                <Music className="w-4 h-4" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-4">
              Shop
            </h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><Link href="/shop?filter=hype" className="hover:text-white transition">Hype</Link></li>
              <li><Link href="/shop?filter=iconic" className="hover:text-white transition">Iconic</Link></li>
              <li><Link href="/shop?filter=legacy" className="hover:text-white transition">Legacy</Link></li>
              <li><Link href="/shop?filter=drip" className="hover:text-white transition">Drip</Link></li>
              <li><Link href="/shop?filter=offers" className="hover:text-white transition">Offers</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-4">
              Support
            </h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><Link href="/faq" className="hover:text-white transition">FAQs</Link></li>
              <li><Link href="/terms" className="hover:text-white transition">Terms & Conditions</Link></li>
              <li><Link href="/privacy" className="hover:text-white transition">Privacy Policy</Link></li>
              <li><Link href="/returns" className="hover:text-white transition">Returns</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-4">
              Get in touch
            </h4>
            <ul className="space-y-3 text-sm text-gray-300">
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 shrink-0" />
                <a
                  href="mailto:toppersthrift@gmail.com"
                  className="hover:text-white transition truncate"
                >
                  toppersthrift@gmail.com
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 shrink-0" />
                <a
                  href="https://wa.me/254768988712"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition"
                >
                  +254 768 988 712
                </a>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4 shrink-0" />
                <span>Nairobi, Kenya</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-12 pt-6 flex flex-col md:flex-row justify-between items-center gap-3 text-xs text-gray-400">
          <p>&copy; {new Date().getFullYear()} ToppersthriftsKE. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link href="/terms" className="hover:text-white transition">Terms</Link>
            <Link href="/privacy" className="hover:text-white transition">Privacy</Link>
            <p>Made with love in Kenya 🇰🇪</p>
          </div>
        </div>
      </div>
    </footer>
  );
}