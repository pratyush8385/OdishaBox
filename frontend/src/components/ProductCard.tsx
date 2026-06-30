"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { Star, Heart, ShoppingCart, Eye } from "lucide-react";
import { motion } from "framer-motion";

export interface ProductType {
  id: number;
  name: string;
  description: string;
  price: number;
  discountPercentage: number;
  rating: number;
  weight: string;
  stockQuantity: number;
  imagePath: string;
  shelfLife: string;
}

interface ProductCardProps {
  product: ProductType;
}

// Unsplash photography mapping to render premium UI
export const getProductImage = (name: string): string => {
  const normalized = name.toLowerCase();
  if (normalized.includes("poda")) {
    return "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600&auto=format&fit=crop&q=80"; // Baked cottage cheese / sweet
  }
  if (normalized.includes("khaja")) {
    return "https://images.unsplash.com/photo-1605698802059-17ce6829fe00?w=600&auto=format&fit=crop&q=80"; // Crispy Indian pastry
  }
  if (normalized.includes("rasabali") || normalized.includes("gaja") || normalized.includes("jhili") || normalized.includes("pitha")) {
    return "https://images.unsplash.com/photo-1544025162-d76694265947?w=600&auto=format&fit=crop&q=80"; // Sweet cottage cheese / dessert pancakes
  }
  if (normalized.includes("badi")) {
    return "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=600&auto=format&fit=crop&q=80"; // Lentil fritters / spice ingredients
  }
  if (normalized.includes("ambula")) {
    return "https://images.unsplash.com/photo-1553530979-7ee52a2670c4?w=600&auto=format&fit=crop&q=80"; // Dried mango
  }
  if (normalized.includes("pickle")) {
    return "https://images.unsplash.com/photo-1601050690597-df056fb4ce78?w=600&auto=format&fit=crop&q=80"; // Indian Achar / Pickle
  }
  if (normalized.includes("mixture") || normalized.includes("snacks") || normalized.includes("murki") || normalized.includes("muan") || normalized.includes("chuda") || normalized.includes("mudi")) {
    return "https://images.unsplash.com/photo-1547058886-f33f9a5bef1a?w=600&auto=format&fit=crop&q=80"; // Namkeen / Puffed & flattened rice / Crispy snacks
  }
  if (normalized.includes("mandia") || normalized.includes("ragi")) {
    return "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&auto=format&fit=crop&q=80"; // Millet flour
  }
  if (normalized.includes("oil")) {
    return "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=600&auto=format&fit=crop&q=80"; // Oil bottle
  }
  if (normalized.includes("masala") || normalized.includes("spices") || normalized.includes("spice")) {
    return "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=600&auto=format&fit=crop&q=80"; // Authentic Spices
  }
  if (normalized.includes("box") || normalized.includes("combo")) {
    return "/hero-odishabox.jpg"; // Curated box gift
  }
  return "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=600&auto=format&fit=crop&q=80";
};

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const [wishlisted, setWishlisted] = useState(false);

  const priceAfterDiscount = product.price * (1 - product.discountPercentage / 100);
  const isOutOfStock = product.stockQuantity === 0;
  const imageUrl = getProductImage(product.name);

  return (
    <div className="group bg-white rounded-3xl border border-gray-100 hover:border-orange-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full overflow-hidden relative">
      
      {/* Discount Badge */}
      {product.discountPercentage > 0 && (
        <span className="absolute top-4 left-4 z-10 bg-forest text-white text-[10px] font-black tracking-widest uppercase px-3 py-1 rounded-full shadow-sm">
          {Math.round(product.discountPercentage)}% OFF
        </span>
      )}

      {/* Wishlist toggle */}
      <button
        onClick={() => setWishlisted(!wishlisted)}
        className="absolute top-4 right-4 z-10 p-2 bg-white/80 backdrop-blur-sm rounded-full text-gray-400 hover:text-red-500 transition-colors shadow-sm"
      >
        <Heart size={16} className={wishlisted ? "fill-red-500 text-red-500" : ""} />
      </button>

      {/* Product Image */}
      <Link href={`/product/${product.id}`} className="block overflow-hidden relative bg-gray-50 aspect-video sm:aspect-square">
        <motion.img
          src={imageUrl}
          alt={product.name}
          className="w-full h-full object-cover"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.3 }}
        />
        {/* Quick View overlay */}
        <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
          <span className="bg-white/90 backdrop-blur-sm text-gray-800 text-xs font-bold px-4 py-2 rounded-full shadow flex items-center gap-1">
            <Eye size={14} /> Quick View
          </span>
        </div>
      </Link>

      {/* Details */}
      <div className="p-5 flex flex-col flex-1">
        
        {/* Rating and weight */}
        <div className="flex items-center justify-between gap-2 mb-2">
          <span className="text-xs text-gray-400 font-semibold">{product.weight}</span>
          <div className="flex items-center gap-1 bg-orange-50 px-2.5 py-0.5 rounded-full">
            <Star size={12} className="text-amber-500 fill-amber-500" />
            <span className="text-xs font-bold text-amber-700">{product.rating}</span>
          </div>
        </div>

        {/* Title */}
        <Link href={`/product/${product.id}`} className="block mb-2">
          <h3 className="text-base font-bold text-gray-800 group-hover:text-primary transition-colors line-clamp-1">
            {product.name}
          </h3>
        </Link>

        {/* Description Snippet */}
        <p className="text-xs text-gray-400 line-clamp-2 mb-4 flex-1">
          {product.description}
        </p>

        {/* Stock status alert */}
        {product.stockQuantity > 0 && product.stockQuantity <= 10 && (
          <div className="text-[10px] text-red-500 font-black tracking-wide uppercase mb-3">
            Only {product.stockQuantity} left in stock!
          </div>
        )}

        {/* Price and Cart */}
        <div className="mt-auto">
          <div className="flex items-baseline gap-2 mb-4">
            <span className="text-xl font-extrabold text-primary">₹{Math.round(priceAfterDiscount)}</span>
            {product.discountPercentage > 0 && (
              <span className="text-xs text-gray-400 line-through">₹{product.price}</span>
            )}
          </div>

          {isOutOfStock ? (
            <button
              disabled
              className="w-full bg-gray-100 text-gray-400 cursor-not-allowed text-xs font-bold uppercase tracking-wider py-3 rounded-full border border-gray-100"
            >
              Sold Out
            </button>
          ) : (
            <motion.button
              onClick={() => addToCart(product, 1)}
              whileTap={{ scale: 0.97 }}
              className="w-full bg-primary hover:bg-primary/95 text-white text-xs font-bold uppercase tracking-wider py-3 rounded-full flex items-center justify-center gap-1.5 transition-colors shadow-md hover:shadow-lg"
            >
              <ShoppingCart size={14} /> Add to Cart
            </motion.button>
          )}
        </div>

      </div>

    </div>
  );
}
