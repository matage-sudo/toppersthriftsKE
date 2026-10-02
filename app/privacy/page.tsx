export const metadata = {
  title: "Privacy Policy",
  description: "How ToppersthriftsKE collects, uses, and protects your personal data. Compliant with Kenya's Data Protection Act (2019) and GDPR.",
};

export default function PrivacyPage() {
  const lastUpdated = "October 2, 2026";

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-2">
        Privacy Policy
      </h1>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">
        Last updated: {lastUpdated}
      </p>

      <div className="space-y-8 text-sm leading-relaxed">
        <Section title="1. Our Commitment">
          <p>
            At ToppersthriftsKE, we take your privacy seriously. This Privacy
            Policy explains what personal data we collect, why we collect it,
            how we use it, and your rights under Kenyan and international law
            — including the <strong>Kenya Data Protection Act (2019)</strong>{" "}
            and, where applicable, the{" "}
            <strong>EU General Data Protection Regulation (GDPR)</strong>.
          </p>
        </Section>

        <Section title="2. What Data We Collect">
          <p>We collect the following information when you place an order or create an account:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li><strong>Name</strong> — to identify and address your order;</li>
            <li><strong>Phone number</strong> — to contact you about your order;</li>
            <li><strong>Delivery location</strong> — to ship your order;</li>
            <li><strong>Email address</strong> (optional) — for order updates and receipts;</li>
            <li><strong>Order history</strong> — to process returns and provide support.</li>
          </ul>
          <p>
            We do <strong>not</strong> collect payment card details directly.
            Payments are processed through secure third-party payment providers.
          </p>
        </Section>

        <Section title="3. Why We Collect It">
          <p>We use your personal data only for the following purposes:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>To process and deliver your orders;</li>
            <li>To communicate with you about your orders;</li>
            <li>To respond to your customer service requests;</li>
            <li>To comply with legal obligations (e.g., tax, anti-fraud);</li>
            <li>To improve our products and services (aggregated, anonymous data only).</li>
          </ul>
          <p>
            We do <strong>not</strong> sell your personal data to third parties.
            We do <strong>not</strong> use your data for unsolicited marketing.
          </p>
        </Section>

        <Section title="4. Legal Basis for Processing">
          <p>Under the Kenya Data Protection Act and GDPR, we rely on:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li><strong>Contract</strong> — to fulfill your order;</li>
            <li><strong>Legal obligation</strong> — tax and accounting;</li>
            <li><strong>Consent</strong> — for optional marketing (you can withdraw anytime);</li>
            <li><strong>Legitimate interest</strong> — fraud prevention, service improvement.</li>
          </ul>
        </Section>

        <Section title="5. How We Store & Protect Your Data">
          <p>
            Your data is stored securely on encrypted servers, protected by
            industry-standard security measures (TLS encryption, access
            controls, and secure authentication). Only authorized personnel
            have access to your data, and only for the purposes described here.
          </p>
          <p>
            We retain your personal data only as long as necessary — typically
            for <strong>24 months</strong> after your last order — unless a
            longer period is required by law.
          </p>
        </Section>

        <Section title="6. Sharing Your Data">
          <p>
            We share your data only with trusted third parties essential to
            fulfilling your order:
          </p>
          <ul className="list-disc pl-6 space-y-1">
            <li><strong>Courier services</strong> — to deliver your order;</li>
            <li><strong>Payment processors</strong> — to collect payment securely;</li>
            <li><strong>Legal authorities</strong> — only when required by law.</li>
          </ul>
        </Section>

        <Section title="7. Your Rights">
          <p>Under the Kenya DPA and GDPR, you have the right to:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li><strong>Access</strong> — request a copy of your personal data;</li>
            <li><strong>Rectification</strong> — correct inaccurate data;</li>
            <li><strong>Erasure</strong> — request deletion of your data;</li>
            <li><strong>Restriction</strong> — limit how we process your data;</li>
            <li><strong>Portability</strong> — receive your data in a portable format;</li>
            <li><strong>Object</strong> — object to processing based on legitimate interest.</li>
          </ul>
          <p>
            To exercise any of these rights, contact us at{" "}
            <a href="mailto:toppersthrift@gmail.com" className="underline font-semibold">
              toppersthrift@gmail.com
            </a>. We will respond within 30 days.
          </p>
        </Section>

        <Section title="8. Cookies & Analytics">
          <p>
            We use minimal cookies for essential site functionality (e.g.,
            keeping your cart and preferences). We do not use third-party
            tracking cookies for advertising. You may disable cookies in your
            browser at any time.
          </p>
        </Section>

        <Section title="9. Children's Privacy">
          <p>
            Our services are not directed at children under 18. We do not
            knowingly collect personal data from minors. If you believe a
            minor has provided us with personal data, please contact us
            immediately.
          </p>
        </Section>

        <Section title="10. International Data Transfers">
          <p>
            Your data is primarily processed within Kenya. If we transfer data
            outside Kenya (e.g., to a cloud provider), we ensure appropriate
            safeguards are in place as required by the Kenya Data Protection
            Act and, where relevant, GDPR.
          </p>
        </Section>

        <Section title="11. Complaints">
          <p>
            If you believe we have mishandled your personal data, you have the
            right to lodge a complaint with the{" "}
            <strong>Office of the Data Protection Commissioner (ODPC) Kenya</strong>{" "}
            or, if you are in the EU, with your local supervisory authority.
          </p>
        </Section>

        <Section title="12. Changes to This Policy">
          <p>
            We may update this Privacy Policy periodically. Material changes
            will be communicated via email or on our website. Continued use of
            our services constitutes acceptance of the updated policy.
          </p>
        </Section>

        <Section title="13. Contact">
          <p>For all privacy-related inquiries:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Email: toppersthrift@gmail.com</li>
            <li>WhatsApp: +254 768 988 712</li>
            <li>Location: Nairobi, Kenya</li>
          </ul>
        </Section>
      </div>
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