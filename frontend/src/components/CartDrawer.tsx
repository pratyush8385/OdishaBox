"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { getProductImage } from "@/components/ProductCard";
import { X, Plus, Minus, Trash2, Tag, ArrowRight, ShoppingBag } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const router = useRouter();
  const {
    cart,
    updateQuantity,
    removeFromCart,
    coupon,
    applyCouponCode,
    removeCoupon,
    subtotal,
    discount,
    tax,
    deliveryCharges,
    total,
  } = useCart();

  const [couponCodeInput, setCouponCodeInput] = useState("");
  const [couponError, setCouponError] = useState<string | null>(null);
  const [applying, setApplying] = useState(false);

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCodeInput.trim()) return;
    setApplying(true);
    setCouponError(null);
    const err = await applyCouponCode(couponCodeInput.trim().toUpperCase());
    setApplying(false);
    if (err) {
      setCouponError(err);
    } else {
      setCouponCodeInput("");
    }
  };

  const handleCheckoutRedirect = () => {
    onClose();
    router.push("/checkout");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black z-50 cursor-pointer"
          />

          {/* Cart Panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.3 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingBag size={20} className="text-primary" />
                <h2 className="text-lg font-black text-gray-800">Your Basket</h2>
                <span className="text-xs bg-orange-100 text-primary font-bold px-2.5 py-0.5 rounded-full">
                  {cart.reduce((s, i) => s + i.quantity, 0)} Items
                </span>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 hover:bg-gray-50 rounded-full text-gray-400 hover:text-gray-700 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Cart Items List */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-6">
                  <div className="w-16 h-16 bg-orange-50 rounded-full flex items-center justify-center text-primary mb-4">
                    <ShoppingBag size={28} />
                  </div>
                  <h3 className="text-base font-bold text-gray-700 mb-1">Your cart is empty</h3>
                  <p className="text-xs text-gray-400 max-w-[250px] mb-6">
                    Add authentic Odia food products and grocery staples to start shopping.
                  </p>
                  <button
                    onClick={onClose}
                    className="bg-primary hover:bg-primary/95 text-white text-xs font-bold uppercase tracking-wider px-6 py-2.5 rounded-full transition-colors shadow"
                  >
                    Start Shopping
                  </button>
                </div>
              ) : (
                cart.map((item) => {
                  const priceAfterDiscount = item.product.price * (1 - item.product.discountPercentage / 100);
                  const imageUrl = getProductImage(item.product.name);
                  return (
                    <div
                      key={item.product.id}
                      className="flex items-start gap-4 pb-4 border-b border-gray-50 last:border-b-0 last:pb-0"
                    >
                      <img
                        src={imageUrl}
                        alt={item.product.name}
                        className="w-16 h-16 object-cover rounded-2xl bg-gray-50 border border-gray-100 flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-bold text-gray-800 truncate mb-0.5">
                          {item.product.name}
                        </h4>
                        <div className="text-xs text-gray-400 mb-2">{item.product.weight}</div>
                        
                        {/* Quantity Adjusters */}
                        <div className="flex items-center gap-3">
                          <div className="flex items-center bg-gray-50 border border-gray-200 rounded-full px-2 py-0.5">
                            <button
                              onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                              className="p-1 text-gray-400 hover:text-primary transition-colors"
                            >
                              <Minus size={12} />
                            </button>
                            <span className="text-xs font-black text-gray-700 w-6 text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                              className="p-1 text-gray-400 hover:text-primary transition-colors"
                            >
                              <Plus size={12} />
                            </button>
                          </div>
                          
                          <button
                            onClick={() => removeFromCart(item.product.id)}
                            className="text-gray-400 hover:text-red-500 transition-colors p-1"
                            title="Remove"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-black text-gray-800">
                          ₹{Math.round(priceAfterDiscount * item.quantity)}
                        </div>
                        {item.product.discountPercentage > 0 && (
                          <div className="text-[10px] text-gray-400 line-through">
                            ₹{item.product.price * item.quantity}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Bottom Actions & Billing Summary */}
            {cart.length > 0 && (
              <div className="border-t border-gray-100 bg-gray-50/50 p-6 space-y-4">
                
                {/* Coupon Form */}
                {coupon ? (
                  <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-3 flex justify-between items-center text-xs text-emerald-800">
                    <div className="flex items-center gap-1.5 font-semibold">
                      <Tag size={14} className="text-emerald-600" />
                      <span>Code Applied: <span className="font-black text-emerald-700">{coupon.code}</span></span>
                    </div>
                    <button
                      onClick={removeCoupon}
                      className="text-emerald-700 font-bold hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} className="relative">
                    <input
                      type="text"
                      placeholder="Apply Promo Code (WELCOME10)"
                      className="w-full bg-white border border-gray-200 rounded-full py-2.5 pl-10 pr-20 text-xs focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary uppercase"
                      value={couponCodeInput}
                      onChange={(e) => {
                        setCouponCodeInput(e.target.value);
                        setCouponError(null);
                      }}
                    />
                    <Tag className="absolute left-3.5 top-3 text-gray-400" size={14} />
                    <button
                      type="submit"
                      disabled={applying || !couponCodeInput.trim()}
                      className="absolute right-1.5 top-1.5 bg-forest hover:bg-forest/95 text-white text-[10px] font-black uppercase tracking-wider px-4 py-1.5 rounded-full transition-colors disabled:opacity-50"
                    >
                      {applying ? "..." : "Apply"}
                    </button>
                    {couponError && (
                      <div className="text-[10px] text-red-500 mt-1 pl-4 font-semibold">{couponError}</div>
                    )}
                  </form>
                )}

                {/* Bill Breakdown */}
                <div className="space-y-1.5 text-xs text-gray-500">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-semibold text-gray-800">₹{subtotal}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-emerald-600 font-medium">
                      <span>Promo Discount</span>
                      <span>- ₹{discount}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>GST (5%)</span>
                    <span className="font-semibold text-gray-800">₹{tax}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery Charges</span>
                    <span className="font-semibold text-gray-800">
                      {deliveryCharges === 0 ? (
                        <span className="text-emerald-600">FREE</span>
                      ) : (
                        `₹${deliveryCharges}`
                      )}
                    </span>
                  </div>
                  <div className="border-t border-gray-200 mt-2 pt-2 flex justify-between text-sm font-black text-gray-800">
                    <span>To Pay</span>
                    <span className="text-primary text-base">₹{total}</span>
                  </div>
                </div>

                {/* Checkout Trigger */}
                <button
                  onClick={handleCheckoutRedirect}
                  className="w-full bg-primary hover:bg-primary/95 text-white text-xs font-black uppercase tracking-widest py-4 rounded-full flex items-center justify-center gap-1.5 transition-all shadow-md hover:shadow-lg mt-2"
                >
                  Proceed to Checkout <ArrowRight size={14} />
                </button>

              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
