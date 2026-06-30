import Link from "next/link";
import { Mail, Phone, MapPin, MessageCircle, Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-950 text-gray-300 border-t border-gray-800 mt-auto">
      {/* Newsletter & Highlight Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 md:grid-cols-3 gap-8 border-b border-gray-900">
        <div className="md:col-span-2">
          <h3 className="text-xl font-bold text-white mb-2">Subscribe to OdishaBox Newsletter</h3>
          <p className="text-sm text-gray-400 mb-4">Get updates on festival boxes, seasonal pickles, and sweet stock alerts directly in your inbox.</p>
          <form className="flex gap-2 max-w-md" onSubmit={(e) => e.preventDefault()}>
            <input
              type="email"
              placeholder="Enter your email"
              className="bg-gray-900 border border-gray-800 text-white rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary w-full"
            />
            <button className="bg-primary hover:bg-primary/95 text-white text-xs font-bold uppercase tracking-wider rounded-full px-6 py-2 transition-colors">
              Subscribe
            </button>
          </form>
        </div>
        <div className="flex flex-col justify-center items-start md:items-end">
          <span className="text-xs text-gray-500 uppercase tracking-widest font-black mb-2">Need Quick Help?</span>
          <a
            href="https://wa.me/919876543210?text=Hi%20OdishaBox!%20I%20have%20a%20query%20about%20my%20order."
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm px-5 py-2.5 rounded-full shadow-md transition-colors"
          >
            <MessageCircle size={18} /> Chat on WhatsApp
          </a>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">

        {/* Company Info */}
        <div>
          <span className="text-2xl font-black tracking-tight text-white block mb-4">
            Odisha<span className="text-primary">Box</span>
          </span>
          <p className="text-sm text-gray-400 mb-4">
            Bringing the authentic taste and tradition of Odisha to Bengaluru. Handcrafted sweets, pickles, and groceries sourced directly from local producers in Odisha.
          </p>
          <div className="text-xs text-gray-500">
            © 2026 OdishaBox E-Commerce. All rights reserved.
          </div>
        </div>

        {/* Categories */}
        <div>
          <h4 className="text-sm font-bold uppercase tracking-widest text-white mb-4">Shop Categories</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/shop" className="hover:text-primary transition-colors">Traditional Sweets</Link></li>
            <li><Link href="/shop" className="hover:text-primary transition-colors">Odia Grocery</Link></li>
            <li><Link href="/shop" className="hover:text-primary transition-colors">Home Pickles</Link></li>
            <li><Link href="/shop" className="hover:text-primary transition-colors">Dry Snacks</Link></li>
            <li><Link href="/shop" className="hover:text-primary transition-colors">Festival Combos</Link></li>
          </ul>
        </div>

        {/* Customer Service */}
        <div>
          <h4 className="text-sm font-bold uppercase tracking-widest text-white mb-4">Customer Support</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/about" className="hover:text-primary transition-colors">About Us</Link></li>
            <li><Link href="/contact" className="hover:text-primary transition-colors">Contact Us</Link></li>
            <li><Link href="/faqs" className="hover:text-primary transition-colors">FAQs</Link></li>
            <li><Link href="/shipping" className="hover:text-primary transition-colors">Shipping Policy</Link></li>
            <li><Link href="/refund" className="hover:text-primary transition-colors">Refund & Cancellations</Link></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h4 className="text-sm font-bold uppercase tracking-widest text-white mb-4">Contact Info</h4>
          <ul className="space-y-3 text-sm text-gray-400">
            <li className="flex items-start gap-2">
              <MapPin size={18} className="text-primary flex-shrink-0 mt-0.5" />
              <span>Chithaary AasthaSyndicate Bank Colony Main Rd, Syndicate Bank Colony, Omkar Nagar, Arekere, Bengaluru, Karnataka 560076</span>
            </li>
            <li className="flex items-center gap-2">
              <Phone size={16} className="text-primary flex-shrink-0" />
              <span>+91 7008512081</span>
            </li>
            <li className="flex items-center gap-2">
              <Mail size={16} className="text-primary flex-shrink-0" />
              <span>support@odishabox.com</span>
            </li>
            <li className="pt-2 text-xs flex items-center gap-1.5 text-gray-500">
              Made with <Heart size={12} className="text-red-500 fill-red-500 animate-pulse" /> for Odias in Bengaluru
            </li>
          </ul>
        </div>

      </div>
    </footer>
  );
}
