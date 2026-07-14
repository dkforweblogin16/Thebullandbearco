export const metadata = { title: "Privacy Policy | The Bull & Bear Co." };

export default function PrivacyPage() {
  return (
    <div className="px-4 pt-10 pb-10 max-w-md mx-auto">
      <h1 className="font-display font-bold text-2xl text-center mb-4 text-ink">
        Privacy Policy
      </h1>
      <p className="text-graphite text-sm leading-relaxed mb-4">
        We collect only the information needed to process your orders and
        improve your shopping experience — your name, address, contact
        details, and order history.
      </p>
      <p className="text-graphite text-sm leading-relaxed mb-4">
        We never sell your personal data to third parties. Payment details
        are handled securely by our payment partners and are not stored on
        our servers.
      </p>
      <p className="text-graphite text-sm leading-relaxed">
        For any privacy-related questions, reach out through our Contact Us
        page.
      </p>
    </div>
  );
}

