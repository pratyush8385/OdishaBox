import React from "react";
import { Award, ShieldCheck, Heart } from "lucide-react";

export default function About() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16 space-y-12">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-black text-gray-900">About OdishaBox</h1>
        <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Bringing authentic Odia heritage to Bengaluru</p>
      </div>

      <div className="bg-white border border-gray-100 rounded-[2.5rem] p-8 sm:p-10 shadow-sm space-y-6 text-sm text-gray-600 leading-relaxed font-medium">
        <p>
          Odisha has a rich culinary heritage, stretching from the holy temple kitchens of Jagannath Dham in Puri to local village households. Our sweets, pickles, and spices carry recipes passed down through generations.
        </p>
        <p>
          For the large Odia diaspora living in Bengaluru, accessing authentic tastes like freshly baked Chhena Poda, Puri Khaja, Keonjhar Phula Badi, or authentic Ambula has always been difficult. OdishaBox was founded to bridge this gap. We partner directly with local master craftsmen (Karigars) and self-help groups across Odisha.
        </p>
        <p>
          Every sweet is baked fresh, every pickle jar is cured under the sun, and every grocery item is sorted carefully before being shipped in temperature-controlled boxes directly to our fulfillment center in HSR Layout, Bengaluru. From there, we deliver them straight to your doorstep.
        </p>
      </div>

      {/* Grid boxes */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
        <div className="bg-white p-6 border border-gray-50 rounded-3xl shadow-sm space-y-2">
          <Award className="text-primary mx-auto" size={24} />
          <h3 className="text-xs font-black uppercase text-gray-800">100% Traditional</h3>
          <p className="text-[11px] text-gray-500 font-medium">Original recipes and traditional preparation methods.</p>
        </div>
        <div className="bg-white p-6 border border-gray-50 rounded-3xl shadow-sm space-y-2">
          <ShieldCheck className="text-forest mx-auto" size={24} />
          <h3 className="text-xs font-black uppercase text-gray-800">Direct Sourcing</h3>
          <p className="text-[11px] text-gray-500 font-medium">Fair prices paid directly to local Karigars in Odisha.</p>
        </div>
        <div className="bg-white p-6 border border-gray-50 rounded-3xl shadow-sm space-y-2">
          <Heart className="text-primary mx-auto" size={24} />
          <h3 className="text-xs font-black uppercase text-gray-800">Delivered Fresh</h3>
          <p className="text-[11px] text-gray-500 font-medium">Temperature-controlled express shipping to Bengaluru.</p>
        </div>
      </div>
    </div>
  );
}
