import React from "react";

export default function ShippingPolicy() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16 space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-black text-gray-900 font-sans">Shipping Policy</h1>
        <p className="text-xs text-gray-400 font-bold uppercase tracking-wider font-sans">Delivery details across Bengaluru</p>
      </div>

      <div className="bg-white border border-gray-100 rounded-[2.5rem] p-8 sm:p-10 shadow-sm space-y-6 text-sm text-gray-600 leading-relaxed font-medium">
        <h2 className="text-base font-black text-gray-800 uppercase tracking-wider">Coverage & Delivery Slots</h2>
        <p>
          We deliver to all major pin codes in Bengaluru (including HSR Layout, Koramangala, Indiranagar, Whitefield, Bellandur, Marathahalli, Electronic City, and Jayanagar).
        </p>
        <p>
          During checkout, you can select from our available delivery slots (6:00 AM to 9:00 PM). Fresh milk sweets are sent in temperature-controlled bags to keep them fresh.
        </p>

        <h2 className="text-base font-black text-gray-800 uppercase tracking-wider pt-4">Delivery Charges</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>Orders above ₹499:</strong> Free delivery.</li>
          <li><strong>Orders below ₹499:</strong> Standard delivery charge of ₹49.</li>
          <li><strong>COD Surcharge:</strong> Flat ₹15 extra for Cash on Delivery processing.</li>
        </ul>
      </div>
    </div>
  );
}
