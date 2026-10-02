import Link from "next/link";
import { Package, RefreshCw, Clock, AlertCircle } from "lucide-react";

export const metadata = {
  title: "Returns & Refunds",
  description: "Return policy for ToppersthriftsKE. 3-day return window. Compliant with Kenya's Consumer Protection Act.",
};

export default function ReturnsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-2">
        Returns & Refunds
      </h1>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">
        We want you to love your cap. If not, we'll make it right.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
        <InfoCard
          icon={<Clock className="w-5 h-5" />}
          title="3-Day Window"
          desc="Request a return within 3 days of delivery."
        />
        <InfoCard
          icon={<Package className="w-5 h-5" />}
          title="Original Condition"
          desc="Unworn, with tags attached, in original packaging."
        />
        <InfoCard
          icon={<RefreshCw className="w-5 h-5" />}
          title="Easy Exchange"
          desc="Swap for another cap or get a refund."
        />
        <InfoCard
          icon={<AlertCircle className="w-5 h-5" />}
          title="Full Refund"
          desc="Refund processed within 7 business days."
        />
      </div>

      <div className="space-y-8 text-sm leading-relaxed">
        <Section title="What Can Be Returned">
          <p>You may return a cap if:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>The cap arrived <strong>damaged</strong> or <strong>defective</strong>;</li>
            <li>The cap is <strong>materially different</strong> from what you ordered;</li>
            <li>The wrong cap was sent.</li>
          </ul>
          <p>
            Items must be unworn, unwashed, and with original tags and
            packaging.
          </p>
        </Section>

        <Section title="What Cannot Be Returned">
          <ul className="list-disc pl-6 space-y-1">
            <li>Caps worn or used;</li>
            <li>Caps without original tags;</li>
            <li>Caps returned after 3 days from delivery;</li>
            <li>Caps damaged by customer misuse.</li>
          </ul>
        </Section>

        <Section title="How to Request a Return">
          <ol className="list-decimal pl-6 space-y-2">
            <li>
              Message us on{" "}
              <a
                href="https://wa.me/254768988712"
                target="_blank"
                rel="noopener noreferrer"
                className="underline font-semibold"
              >
                WhatsApp (+254 768 988 712)
              </a>{" "}
              within 3 days of delivery.
            </li>
            <li>Send a photo of the cap and describe the issue.</li>
            <li>We'll confirm whether the return is approved.</li>
            <li>Ship or drop off the item at the address we provide.</li>
            <li>Once inspected, we process your refund or exchange.</li>
          </ol>
        </Section>

        <Section title="Refunds">
          <p>
            Approved refunds are processed within <strong>7 business days</strong>{" "}
            via the same method as your original payment (M-Pesa, bank transfer,
            etc.).
          </p>
          <p>
            Delivery fees are non-refundable unless the issue is on our part.
          </p>
        </Section>

        <Section title="Your Rights Under Kenyan Law">
          <p>
            This returns policy is in addition to — and does not replace — your
            statutory rights under the{" "}
            <strong>Consumer Protection Act (2012)</strong> of Kenya. If our
            policy conflicts with Kenyan law, Kenyan law prevails.
          </p>
        </Section>

        <Section title="Questions?">
          <p>
            Reach us on{" "}
            <a
              href="https://wa.me/254768988712"
              target="_blank"
              rel="noopener noreferrer"
              className="underline font-semibold"
            >
              WhatsApp
            </a>{" "}
            or email{" "}
            <a href="mailto:toppersthrift@gmail.com" className="underline font-semibold">
              toppersthrift@gmail.com
            </a>
            . See also our{" "}
            <Link href="/terms" className="underline font-semibold">
              Terms & Conditions
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="underline font-semibold">
              Privacy Policy
            </Link>
            .
          </p>
        </Section>
      </div>
    </div>
  );
}

function InfoCard({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl p-5">
      <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-900 flex items-center justify-center text-gray-700 dark:text-gray-300 mb-3">
        {icon}
      </div>
      <h3 className="font-bold mb-1">{title}</h3>
      <p className="text-sm text-gray-500 dark:text-gray-400">{desc}</p>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="text-lg font-bold mb-3">{title}</h2>
      <div className="text-gray-600 dark:text-gray-400 space-y-3">{children}</div>
    </section>
  );
}