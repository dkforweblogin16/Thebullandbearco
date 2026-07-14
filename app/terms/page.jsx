export const metadata = { title: "Terms of Service | The Bull & Bear Co." };

export default function TermsPage() {
  return (
    <div className="px-4 pt-10 pb-10 max-w-md mx-auto">
      <h1 className="font-display font-bold text-2xl text-center mb-4 text-ink">
        Terms of Service
      </h1>
      <p className="text-graphite text-sm leading-relaxed mb-4">
        By using this site and placing an order, you agree to provide
        accurate information and to use the site only for lawful purposes.
      </p>
      <p className="text-graphite text-sm leading-relaxed mb-4">
        All product prices, descriptions, and availability are subject to
        change without notice. We reserve the right to cancel any order
        suspected of fraud or abuse.
      </p>
      <p className="text-graphite text-sm leading-relaxed">
        Continued use of this site constitutes acceptance of any future
        updates to these terms.
      </p>
    </div>
  );
}

