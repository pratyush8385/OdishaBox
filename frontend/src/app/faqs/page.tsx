import React from "react";

export default function FAQs() {
  const faqs = [
    {
      q: "Where is the food sourced from?",
      a: "All our products are sourced directly from registered Karigars, self-help groups (SHGs), and famous sweet hubs across Odisha (e.g., Kendrapara for Rasabali, Puri for Khaja, Keonjhar for Phula Badi). We package and express-ship them to Bengaluru under temperature-controlled settings.",
    },
    {
      q: "How long does delivery take in Bengaluru?",
      a: "We offer next-day delivery across Bengaluru. Orders placed before 8 PM are dispatched for delivery the next morning. You can select your preferred delivery slot during checkout.",
    },
    {
      q: "What is the shelf life of Chhena Poda and Rasabali?",
      a: "Since we do not use artificial preservatives, our milk-based sweets have a short shelf life. Chhena Poda lasts up to 7 days, and Rasabali lasts up to 3 days when kept refrigerated. Dry items like Khaja and badis last from 30 to 90 days.",
    },
    {
      q: "Do you support Cash on Delivery (COD)?",
      a: "Yes, we support COD across Bengaluru. A nominal surcharge of ₹15 applies to COD orders. Alternatively, you can pay online securely using UPI, Credit/Debit cards, or Net Banking via Razorpay.",
    },
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 py-16 space-y-12">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-black text-gray-900 font-sans">Frequently Asked Questions</h1>
        <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">All you need to know about ordering and delivery</p>
      </div>

      <div className="space-y-6">
        {faqs.map((faq, index) => (
          <div key={index} className="bg-white p-6 border border-gray-100 rounded-3xl shadow-sm space-y-2">
            <h3 className="text-sm font-black text-gray-800">{faq.q}</h3>
            <p className="text-xs text-gray-500 font-semibold leading-relaxed">{faq.a}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
