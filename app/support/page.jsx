import { MessageCircle } from "lucide-react";

export const metadata = { title: "Support | The Bull & Bear Co." };

export default function SupportPage() {
  return (
    <div className="px-4 pt-10 text-center">
      <div className="w-16 h-16 rounded-full bg-green/15 flex items-center justify-center mx-auto mb-4">
        <MessageCircle size={28} className="text-green" />
      </div>
      <h1 className="font-display font-bold text-2xl mb-2 text-ink">Need Help?</h1>
      <p className="text-graphite text-sm max-w-xs mx-auto mb-6">
        Chat with our support team on WhatsApp — usually replies within a few
        minutes during market hours.
      </p>
      <a
        href="https://wa.me/910000000000"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block bg-green text-paper px-6 py-3 font-semibold tracking-wide"
      >
        Chat on WhatsApp
      </a>
    </div>
  );
}
