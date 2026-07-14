"use client"
export const metadata = { title: "Contact Us | The Bull & Bear Co." };

export default function ContactPage() {
  return (
    <div className="px-4 pt-10 max-w-sm mx-auto">
      <h1 className="font-display font-black text-2xl text-center mb-6">
        Contact Us
      </h1>
      <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
        <input
          type="text"
          placeholder="Your Name"
          className="w-full border border-line rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-ink"
        />
        <input
          type="email"
          placeholder="Email Address"
          className="w-full border border-line rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-ink"
        />
        <textarea
          placeholder="Your message"
          rows={4}
          className="w-full border border-line rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-ink"
        />
        <button className="w-full bg-ink text-paper py-3.5 font-semibold tracking-wide">
          Send Message
        </button>
      </form>
    </div>
  );
}

