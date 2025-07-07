import ContactForm from '@/components/ContactForm';

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold text-center mb-8 text-cyan-400 uppercase tracking-widest">Contact</h1>
      <p className="text-center mb-12 max-w-2xl mx-auto text-gray-400 font-mono">
        Got a question, a project proposal, or just want to say hi? Drop a line below. I’ll get back to you as soon as the signal gets through the static.
      </p>
      <ContactForm />
    </div>
  );
}
