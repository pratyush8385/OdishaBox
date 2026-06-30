"use client";

import React, { useState } from "react";
import { Mail, Phone, MapPin, Send } from "lucide-react";

export default function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    setName("");
    setEmail("");
    setMsg("");
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-16 space-y-12">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-black text-gray-900">Contact OdishaBox</h1>
        <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Reach out for order queries or bulk requirements</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

        {/* Contact Info Details */}
        <div className="space-y-6 md:col-span-1">
          <div className="bg-white p-6 border border-gray-100 rounded-3xl shadow-sm space-y-4 text-xs font-semibold text-gray-600">
            <div className="flex items-start gap-2">
              <MapPin size={18} className="text-primary flex-shrink-0 mt-0.5" />
              <span>Chithaary AasthaSyndicate Bank Colony Main Rd, Syndicate Bank Colony, Omkar Nagar, Arekere, Bengaluru, Karnataka 560076</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone size={16} className="text-primary flex-shrink-0" />
              <span>+91 7008512081

              </span>
            </div>
            <div className="flex items-center gap-2">
              <Mail size={16} className="text-primary flex-shrink-0" />
              <span>support@odishabox.com</span>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="md:col-span-2 bg-white p-8 border border-gray-100 rounded-[2.5rem] shadow-sm space-y-6">
          <h2 className="text-base font-black text-gray-800 uppercase tracking-wider">Send a Message</h2>
          {sent ? (
            <div className="bg-emerald-50 border border-emerald-100 text-emerald-800 text-xs font-bold p-4 rounded-2xl">
              ✓ Thank you! Your message has been received. Our support team will respond within 24 hours.
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  type="text"
                  required
                  placeholder="Your Name"
                  className="bg-gray-50 border border-gray-200 rounded-xl p-3 text-xs w-full text-gray-700 focus:outline-none"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <input
                  type="email"
                  required
                  placeholder="Your Email"
                  className="bg-gray-50 border border-gray-200 rounded-xl p-3 text-xs w-full text-gray-700 focus:outline-none"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <textarea
                required
                rows={4}
                placeholder="How can we help you?"
                className="bg-gray-50 border border-gray-200 rounded-xl p-3 text-xs w-full text-gray-700 focus:outline-none"
                value={msg}
                onChange={(e) => setMsg(e.target.value)}
              />
              <button
                type="submit"
                className="bg-primary hover:bg-primary/95 text-white text-xs font-black uppercase tracking-widest py-3 px-8 rounded-full flex items-center gap-1.5 transition-colors shadow"
              >
                <Send size={12} /> Send Message
              </button>
            </form>
          )}
        </div>

      </div>
    </div>
  );
}
