export const metadata = {
  title: "Terms & Conditions",
  description: "Terms and Conditions for shopping at ToppersthriftsKE. Governed by Kenyan and international law.",
};

export default function TermsPage() {
  const lastUpdated = "October 2, 2026";

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-2">
        Terms & Conditions
      </h1>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">
        Last updated: {lastUpdated}
      </p>

      <div className="prose prose-gray dark:prose-invert max-w-none space-y-8 text-sm leading-relaxed">
        <Section title="1. Introduction">
          <p>
            Welcome to ToppersthriftsKE ("we", "our", "us"). These Terms and
            Conditions ("Terms") govern your access to and use of our website,
            products, and services. By accessing or purchasing from
            ToppersthriftsKE, you agree to be bound by these Terms.
          </p>
          <p>
            We are a Kenya-based business, and these Terms are governed by the
            laws of the Republic of Kenya, including but not limited to the
            Consumer Protection Act (2012), the Kenya Information and
            Communications Act, and the Data Protection Act (2019).
          </p>
        </Section>

        <Section title="2. Eligibility">
          <p>
            By placing an order or creating an account, you confirm that you are
            at least 18 years of age or have the legal consent of a parent or
            guardian. You agree to provide accurate, current, and complete
            information during account creation and checkout.
          </p>
        </Section>

        <Section title="3. Products & Pricing">
          <p>
            All product descriptions, images, and prices are displayed as
            accurately as possible. Colors may vary slightly due to display
            settings. Prices are quoted in Kenyan Shillings (KES) and are
            subject to change without prior notice.
          </p>
          <p>
            We reserve the right to correct pricing errors, refuse or cancel
            orders, and limit quantities per customer. Where an error occurs,
            we will notify you before processing your order.
          </p>
        </Section>

        <Section title="4. Orders & Payment">
          <p>
            Orders are confirmed only after payment is received (except for
            Cash on Delivery, which is available within specified Nairobi
            regions). Accepted payment methods include M-Pesa, card payment
            via our payment partners, and cash on delivery where available.
          </p>
          <p>
            Once your order is confirmed, you will receive a WhatsApp
            confirmation message to the phone number provided at checkout.
          </p>
        </Section>

        <Section title="5. Delivery">
          <p>
            Delivery timelines are estimates and may vary based on location,
            courier availability, and unforeseen circumstances. Within Nairobi,
            delivery typically takes 1–2 business days. Upcountry deliveries
            take 2–5 business days.
          </p>
          <p>
            Risk of loss or damage passes to you upon delivery. Please inspect
            your order upon receipt and notify us within 24 hours if there are
            any issues.
          </p>
        </Section>

        <Section title="6. Returns & Refunds">
          <p>
            You may return items within <strong>3 days</strong> of delivery if
            the product is defective, damaged, or materially different from
            what was ordered. Items must be unworn, in original condition, and
            with original tags attached.
          </p>
          <p>
            Refunds are processed within 7 business days after inspection.
            Delivery fees are non-refundable unless the error is on our part.
            This policy complies with the Consumer Protection Act (2012) of
            Kenya.
          </p>
        </Section>

        <Section title="7. Intellectual Property">
          <p>
            All content on this website — including text, images, logos,
            product photography, and design — is the property of
            ToppersthriftsKE or its licensors and is protected by applicable
            copyright and trademark laws. Brand names and logos (including
            Marvel, DC, NBA, MLB, and others) are the property of their
            respective owners. We are an independent retailer and not
            affiliated with these brands unless explicitly stated.
          </p>
        </Section>

        <Section title="8. User Responsibilities">
          <p>You agree not to:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Use the website for unlawful purposes;</li>
            <li>Provide false or misleading information;</li>
            <li>Interfere with the security or functionality of the site;</li>
            <li>Reproduce, copy, or resell our content without permission.</li>
          </ul>
        </Section>

        <Section title="9. Limitation of Liability">
          <p>
            To the maximum extent permitted by Kenyan law, ToppersthriftsKE
            shall not be liable for indirect, incidental, or consequential
            damages arising from the use of our products or services. Our
            total liability shall not exceed the amount paid for the relevant
            order.
          </p>
        </Section>

        <Section title="10. Governing Law & Dispute Resolution">
          <p>
            These Terms are governed by the laws of Kenya. Any dispute arising
            from these Terms or your use of our services shall first be
            attempted to be resolved amicably. If unresolved, the matter shall
            be submitted to the competent courts of Nairobi, Kenya.
          </p>
          <p>
            Where you are located outside Kenya, mandatory consumer protection
            laws of your jurisdiction may also apply and shall not be limited
            by these Terms.
          </p>
        </Section>

        <Section title="11. Changes to These Terms">
          <p>
            We reserve the right to update these Terms at any time. Changes
            will take effect immediately upon posting. Continued use of our
            services constitutes acceptance of the updated Terms.
          </p>
        </Section>

        <Section title="12. Contact">
          <p>
            For questions about these Terms, contact us at:
          </p>
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