// FILE PATH: app/contact/page.jsx
import ContactForm from "./ContactForm";

export const metadata = { title: "Contact Us | The Bull & Bear Co." };

export default function ContactPage() {
  return (
    <div className="px-4 pt-10 max-w-sm mx-auto">
      <h1 className="font-display font-black text-2xl text-center mb-6">
        Contact Us
      </h1>
      <ContactForm />
    </div>
  );
}
