'use client';

import { useState } from 'react';

export default function ContactForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('Transmitting signal...');
    // Placeholder for form submission logic (e.g., API call)
    // For now, we'll just simulate a delay and success/error message.
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // In a real app, you'd handle the response here.
    setStatus('Signal received. We\'ll be in touch.');
    setName('');
    setEmail('');
    setMessage('');

    setTimeout(() => setStatus(''), 5000);
  };

  return (
    <div className="max-w-2xl mx-auto p-4 md:p-8 border border-cyan-400/50 bg-black/30 backdrop-blur-sm relative font-mono">
      {/* Glitchy corner elements */}
      <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-cyan-400 animate-pulse"></div>
      <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-cyan-400 animate-pulse"></div>
      <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-cyan-400 animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-cyan-400 animate-pulse"></div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-cyan-300 mb-2 uppercase tracking-widest">
            Name / Handle
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full bg-transparent border-b-2 border-cyan-400/50 focus:border-cyan-400 text-gray-200 py-2 px-1 outline-none transition-colors duration-300"
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-cyan-300 mb-2 uppercase tracking-widest">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full bg-transparent border-b-2 border-cyan-400/50 focus:border-cyan-400 text-gray-200 py-2 px-1 outline-none transition-colors duration-300"
          />
        </div>
        <div>
          <label htmlFor="message" className="block text-sm font-medium text-cyan-300 mb-2 uppercase tracking-widest">
            Message
          </label>
          <textarea
            id="message"
            name="message"
            rows={5}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
            className="w-full bg-transparent border-2 border-cyan-400/50 focus:border-cyan-400 text-gray-200 p-2 outline-none transition-colors duration-300 resize-none"
          ></textarea>
        </div>
        <div className="text-center pt-4">
          <button
            type="submit"
            disabled={status.startsWith('Transmitting')}
            className="px-8 py-3 bg-cyan-400 text-black font-bold uppercase tracking-widest hover:bg-cyan-300 hover:text-black transition-all duration-300 relative overflow-hidden group disabled:bg-gray-600 disabled:cursor-not-allowed"
          >
            <span className="relative z-10">Transmit Signal</span>
          </button>
        </div>
        {status && <p className="text-center text-green-400 mt-4 animate-pulse">{status}</p>}
      </form>
    </div>
  );
}
