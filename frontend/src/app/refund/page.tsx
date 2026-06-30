import React from "react";

export default function RefundPolicy() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16 space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-black text-gray-900 font-sans">Refund & Cancellation Policy</h1>
        <p className="text-xs text-gray-400 font-bold uppercase tracking-wider font-sans">Customer satisfaction is our priority</p>
      </div>

      <div className="bg-white border border-gray-100 rounded-[2.5rem] p-8 sm:p-10 shadow-sm space-y-6 text-sm text-gray-600 leading-relaxed font-medium">
        <h2 className="text-base font-black text-gray-800 uppercase tracking-wider">Cancellations</h2>
        <p>
          Since we deal with fresh food products and short-shelf-life milk sweets, order cancellations are only supported within 2 hours of placing the order or before the order is marked as "Shipped," whichever is earlier.
        </p>

        <h2 className="text-base font-black text-gray-800 uppercase tracking-wider pt-4">Refunds & Replacements</h2>
        <p>
          If your products are damaged, stale, or have packaging issues upon delivery, we will issue a replacement or refund immediately.
        </p>
        <p>
          To claim a replacement or refund, please reach out to us on WhatsApp (+91 98765 43210) or email support@odishabox.com with your order number and photos of the items within 24 hours of delivery.
        </p>
      </div>
    </div>
  );
}
