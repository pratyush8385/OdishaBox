"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { api } from "@/services/api";

export interface CartItem {
  product: {
    id: number;
    name: string;
    price: number;
    discountPercentage: number;
    weight: string;
    imagePath: string;
    stockQuantity: number;
  };
  quantity: number;
}

interface Coupon {
  code: string;
  discountPercentage: number;
  maxDiscount: number;
  minOrderAmount: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: any, quantity?: number) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  coupon: Coupon | null;
  applyCouponCode: (code: string) => Promise<string | null>;
  removeCoupon: () => void;
  subtotal: number;
  discount: number;
  tax: number;
  deliveryCharges: number;
  total: number;
  paymentMethod: string;
  setPaymentMethod: (method: string) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [coupon, setCoupon] = useState<Coupon | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<string>("UPI");

  useEffect(() => {
    const savedCart = localStorage.getItem("odishabox_cart");
    const savedCoupon = localStorage.getItem("odishabox_coupon");
    const savedPaymentMethod = localStorage.getItem("odishabox_payment_method");
    if (savedCart) setCart(JSON.parse(savedCart));
    if (savedCoupon) setCoupon(JSON.parse(savedCoupon));
    if (savedPaymentMethod) setPaymentMethod(savedPaymentMethod);
  }, []);

  useEffect(() => {
    localStorage.setItem("odishabox_cart", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    if (coupon) {
      localStorage.setItem("odishabox_coupon", JSON.stringify(coupon));
    } else {
      localStorage.removeItem("odishabox_coupon");
    }
  }, [coupon]);

  useEffect(() => {
    localStorage.setItem("odishabox_payment_method", paymentMethod);
  }, [paymentMethod]);

  const addToCart = (product: any, quantity = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        const newQty = existing.quantity + quantity;
        if (newQty > product.stockQuantity) {
          alert(`Only ${product.stockQuantity} items in stock!`);
          return prev;
        }
        return prev.map((item) =>
          item.product.id === product.id ? { ...item, quantity: newQty } : item
        );
      }
      return [...prev, { product, quantity }];
    });
  };

  const removeFromCart = (productId: number) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === productId);
      if (existing && quantity > existing.product.stockQuantity) {
        alert(`Only ${existing.product.stockQuantity} items in stock!`);
        return prev;
      }
      return prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      );
    });
  };

  const clearCart = () => {
    setCart([]);
    setCoupon(null);
  };

  const applyCouponCode = async (code: string) => {
    try {
      const data = await api.coupons.apply(code, subtotal);
      setCoupon(data);
      return null;
    } catch (err: any) {
      return err.message || "Failed to apply coupon";
    }
  };

  const removeCoupon = () => {
    setCoupon(null);
  };

  const subtotal = cart.reduce((sum, item) => {
    const priceAfterDiscount = item.product.price * (1 - item.product.discountPercentage / 100);
    return sum + priceAfterDiscount * item.quantity;
  }, 0);

  const discount = coupon
    ? Math.min(subtotal * (coupon.discountPercentage / 100), coupon.maxDiscount)
    : 0;

  const tax = subtotal * 0.05;

  const baseDelivery = subtotal - discount >= 499 ? 0 : 49;
  const codSurcharge = paymentMethod === "COD" ? 15 : 0;
  const deliveryCharges = cart.length > 0 ? baseDelivery + codSurcharge : 0;

  const total = cart.length > 0 ? subtotal + tax + deliveryCharges - discount : 0;

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        coupon,
        applyCouponCode,
        removeCoupon,
        subtotal: Math.round(subtotal * 100) / 100,
        discount: Math.round(discount * 100) / 100,
        tax: Math.round(tax * 100) / 100,
        deliveryCharges,
        total: Math.round(total * 100) / 100,
        paymentMethod,
        setPaymentMethod,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
