"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/services/api";
import { MapPin, Clock, CreditCard, ShoppingBag, Plus, Sparkles, CheckCircle2, ShieldCheck, ArrowLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Address {
  id: number;
  name: string;
  streetAddress: string;
  city: string;
  state: string;
  zipCode: string;
  phoneNumber: string;
  isDefault: boolean;
}

export default function Checkout() {
  const router = useRouter();
  const { user } = useAuth();
  const {
    cart,
    clearCart,
    coupon,
    subtotal,
    discount,
    tax,
    deliveryCharges,
    total,
    paymentMethod,
    setPaymentMethod,
  } = useCart();

  // Address state
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);
  const [newAddress, setNewAddress] = useState({
    name: "Home",
    streetAddress: "",
    city: "Bengaluru",
    state: "Karnataka",
    zipCode: "",
    phoneNumber: user?.phoneNumber || "",
    isDefault: false,
  });

  // Delivery slot state
  const slots = [
    "06:00 AM - 09:00 AM (Early Morning)",
    "09:00 AM - 12:00 PM (Morning)",
    "12:00 PM - 03:00 PM (Afternoon)",
    "03:00 PM - 06:00 PM (Late Afternoon)",
    "06:00 PM - 09:00 PM (Evening)",
  ];
  const [selectedSlot, setSelectedSlot] = useState(slots[1]); // Default morning

  // Simulated Razorpay Overlay state
  const [showRazorpay, setShowRazorpay] = useState(false);
  const [placedOrderId, setPlacedOrderId] = useState<number | null>(null);
  const [placingOrder, setPlacingOrder] = useState(false);

  // Success page simulation state
  const [orderCompleteDetails, setOrderCompleteDetails] = useState<any>(null);

  useEffect(() => {
    if (!user) {
      router.push("/login?redirect=checkout");
      return;
    }
    if (cart.length === 0 && !orderCompleteDetails) {
      router.push("/shop");
      return;
    }

    async function loadAddresses() {
      try {
        const res = await api.user.getAddresses();
        setAddresses(res);
        // Set default selected address
        const def = res.find((a: Address) => a.isDefault);
        if (def) setSelectedAddressId(def.id);
        else if (res.length > 0) setSelectedAddressId(res[0].id);
      } catch (err) {
        console.error(err);
      }
    }
    loadAddresses();
  }, [user]);

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const saved = await api.user.addAddress(newAddress);
      setAddresses([...addresses, saved]);
      setSelectedAddressId(saved.id);
      setShowNewAddressForm(false);
      setNewAddress({
        name: "Home",
        streetAddress: "",
        city: "Bengaluru",
        state: "Karnataka",
        zipCode: "",
        phoneNumber: user?.phoneNumber || "",
        isDefault: false,
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddressId) {
      alert("Please select a delivery address!");
      return;
    }
    setPlacingOrder(true);
    try {
      const orderReq = {
        items: cart.map((i) => ({ productId: i.product.id, quantity: i.quantity })),
        addressId: selectedAddressId,
        deliverySlot: selectedSlot,
        paymentMethod: paymentMethod,
        couponCode: coupon?.code || undefined,
      };

      const order = await api.orders.create(orderReq);
      setPlacedOrderId(order.id);

      if (paymentMethod === "COD") {
        // Cash on delivery - success immediately
        setOrderCompleteDetails(order);
        clearCart();
      } else {
        // Trigger simulated Razorpay overlay
        setShowRazorpay(true);
      }
    } catch (err: any) {
      alert(err.message || "Failed to place order");
    } finally {
      setPlacingOrder(false);
    }
  };

  // Simulate Razorpay Success
  const handleRazorpaySuccess = async () => {
    if (!placedOrderId) return;
    try {
      const simulatedPaymentId = "pay_" + Math.random().toString(36).substring(2, 16);
      const simulatedSignature = "sig_" + Math.random().toString(36).substring(2, 16);
      const confirmedOrder = await api.orders.verifyPayment(placedOrderId, simulatedPaymentId, simulatedSignature);
      
      setOrderCompleteDetails(confirmedOrder);
      setShowRazorpay(false);
      clearCart();
    } catch (err) {
      alert("Verification failed");
    }
  };

  // Simulate Razorpay Cancel
  const handleRazorpayCancel = () => {
    setShowRazorpay(false);
    alert("Payment session was cancelled. You can retry from your dashboard.");
    router.push("/dashboard");
  };

  // Order Complete view
  if (orderCompleteDetails) {
    return (
      <div className="max-w-xl mx-auto px-6 py-16 text-center space-y-6">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto"
        >
          <CheckCircle2 size={48} />
        </motion.div>
        <div className="space-y-2">
          <h1 className="text-3xl font-black text-gray-900">Order Placed Successfully!</h1>
          <p className="text-sm text-gray-500 font-medium">
            Thank you for ordering with OdishaBox. Your order id is{" "}
            <span className="font-extrabold text-primary">#OB-{orderCompleteDetails.id}</span>
          </p>
        </div>
        <div className="bg-white border border-gray-100 rounded-3xl p-6 text-left space-y-3">
          <h3 className="text-xs font-black uppercase tracking-wider text-gray-400">Order Summary</h3>
          <div className="text-xs space-y-1.5 text-gray-600">
            <div className="flex justify-between">
              <span>Items Total</span>
              <span className="font-semibold text-gray-800">₹{orderCompleteDetails.subtotal}</span>
            </div>
            <div className="flex justify-between">
              <span>GST & Surcharges</span>
              <span className="font-semibold text-gray-800">₹{orderCompleteDetails.tax + orderCompleteDetails.deliveryCharges}</span>
            </div>
            {orderCompleteDetails.discount > 0 && (
              <div className="flex justify-between text-emerald-600">
                <span>Discount Applied</span>
                <span>- ₹{orderCompleteDetails.discount}</span>
              </div>
            )}
            <div className="border-t border-gray-100 pt-2 flex justify-between text-sm font-black text-gray-800">
              <span>Amount Paid</span>
              <span className="text-primary">₹{orderCompleteDetails.total}</span>
            </div>
          </div>
        </div>
        <div className="flex gap-4">
          <button
            onClick={() => router.push("/dashboard")}
            className="flex-1 bg-forest hover:bg-forest/95 text-white text-xs font-bold uppercase tracking-wider py-3.5 rounded-full transition-colors"
          >
            Track in Dashboard
          </button>
          <button
            onClick={() => router.push("/shop")}
            className="flex-1 bg-white border border-gray-200 text-gray-700 text-xs font-bold uppercase tracking-wider py-3.5 rounded-full hover:bg-gray-50 transition-all"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Back to Shop */}
      <button onClick={() => router.back()} className="flex items-center gap-1.5 text-xs text-gray-400 font-bold mb-6 hover:text-primary transition-colors">
        <ArrowLeft size={14} /> Back
      </button>

      <h1 className="text-3xl font-black text-gray-900 mb-8">Checkout Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Side: Address & Slots Form */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Address Management */}
          <div className="bg-white p-6 sm:p-8 border border-gray-100 rounded-[2.5rem] shadow-sm space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-black text-gray-800 flex items-center gap-2">
                <MapPin className="text-primary" size={20} /> Select Delivery Address
              </h2>
              <button
                onClick={() => setShowNewAddressForm(!showNewAddressForm)}
                className="text-xs text-primary font-black uppercase tracking-wider flex items-center gap-1 hover:underline"
              >
                <Plus size={14} /> Add New
              </button>
            </div>

            {/* Address Selection List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {addresses.map((addr) => (
                <div
                  key={addr.id}
                  onClick={() => setSelectedAddressId(addr.id)}
                  className={`border-2 rounded-3xl p-5 cursor-pointer transition-all flex flex-col justify-between h-40 ${
                    selectedAddressId === addr.id
                      ? "border-primary bg-orange-50/20"
                      : "border-gray-100 hover:border-orange-100 bg-white"
                  }`}
                >
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs font-black uppercase tracking-wider text-gray-700">{addr.name}</span>
                      {addr.isDefault && <span className="text-[9px] bg-forest text-white font-bold px-2 py-0.5 rounded">DEFAULT</span>}
                    </div>
                    <p className="text-xs text-gray-500 font-medium line-clamp-3 leading-relaxed mt-2">{addr.streetAddress}, {addr.city}</p>
                  </div>
                  <div className="text-[10px] text-gray-400 font-semibold mt-2">Ph: {addr.phoneNumber}</div>
                </div>
              ))}
            </div>

            {/* Inline New Address Form Dialog */}
            {showNewAddressForm && (
              <form onSubmit={handleAddAddress} className="border border-orange-100 bg-orange-50/10 rounded-3xl p-6 space-y-4">
                <h3 className="text-xs font-black uppercase tracking-wider text-gray-700">Add New Address</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input
                    type="text"
                    required
                    placeholder="Address Label (e.g. Home, Office)"
                    className="bg-white border border-gray-200 rounded-xl p-3 text-xs focus:outline-none focus:ring-1 focus:ring-primary w-full text-gray-700"
                    value={newAddress.name}
                    onChange={(e) => setNewAddress({ ...newAddress, name: e.target.value })}
                  />
                  <input
                    type="text"
                    required
                    placeholder="Phone Number"
                    className="bg-white border border-gray-200 rounded-xl p-3 text-xs focus:outline-none focus:ring-1 focus:ring-primary w-full text-gray-700"
                    value={newAddress.phoneNumber}
                    onChange={(e) => setNewAddress({ ...newAddress, phoneNumber: e.target.value })}
                  />
                  <input
                    type="text"
                    required
                    placeholder="Street Address, Block, Flat No."
                    className="bg-white border border-gray-200 rounded-xl p-3 text-xs focus:outline-none focus:ring-1 focus:ring-primary w-full sm:col-span-2 text-gray-700"
                    value={newAddress.streetAddress}
                    onChange={(e) => setNewAddress({ ...newAddress, streetAddress: e.target.value })}
                  />
                  <input
                    type="text"
                    required
                    placeholder="Zip Code / Pincode"
                    className="bg-white border border-gray-200 rounded-xl p-3 text-xs focus:outline-none focus:ring-1 focus:ring-primary w-full text-gray-700"
                    value={newAddress.zipCode}
                    onChange={(e) => setNewAddress({ ...newAddress, zipCode: e.target.value })}
                  />
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowNewAddressForm(false)}
                    className="px-4 py-2 rounded-full border border-gray-200 text-xs font-bold text-gray-600"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-forest hover:bg-forest/95 text-white px-6 py-2 rounded-full text-xs font-bold transition-colors"
                  >
                    Save Address
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Delivery Slot Selection */}
          <div className="bg-white p-6 sm:p-8 border border-gray-100 rounded-[2.5rem] shadow-sm space-y-6">
            <h2 className="text-lg font-black text-gray-800 flex items-center gap-2">
              <Clock className="text-primary" size={20} /> Select Delivery Slot
            </h2>
            <div className="space-y-2">
              {slots.map((slot) => (
                <button
                  key={slot}
                  onClick={() => setSelectedSlot(slot)}
                  className={`w-full text-left px-5 py-3 rounded-2xl border text-xs font-bold transition-all flex items-center justify-between ${
                    selectedSlot === slot ? "border-primary bg-orange-50/20 text-primary" : "border-gray-100 hover:bg-gray-50 text-gray-700"
                  }`}
                >
                  <span>{slot}</span>
                  {selectedSlot === slot && <div className="w-2 h-2 bg-primary rounded-full" />}
                </button>
              ))}
            </div>
          </div>

          {/* Payment Method Selector */}
          <div className="bg-white p-6 sm:p-8 border border-gray-100 rounded-[2.5rem] shadow-sm space-y-6">
            <h2 className="text-lg font-black text-gray-800 flex items-center gap-2">
              <CreditCard className="text-primary" size={20} /> Payment Option
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                onClick={() => setPaymentMethod("UPI")}
                className={`border-2 rounded-3xl p-5 text-left transition-all ${
                  paymentMethod === "UPI" ? "border-primary bg-orange-50/20" : "border-gray-100 hover:border-orange-100 bg-white"
                }`}
              >
                <div className="font-black text-xs text-gray-800 uppercase mb-1">Razorpay Checkout</div>
                <p className="text-[10px] text-gray-400 leading-normal">Pay securely with UPI, Net Banking, or Credit/Debit Cards.</p>
              </button>
              <button
                onClick={() => setPaymentMethod("COD")}
                className={`border-2 rounded-3xl p-5 text-left transition-all ${
                  paymentMethod === "COD" ? "border-primary bg-orange-50/20" : "border-gray-100 hover:border-orange-100 bg-white"
                }`}
              >
                <div className="font-black text-xs text-gray-800 uppercase mb-1">Cash on Delivery (COD)</div>
                <p className="text-[10px] text-gray-400 leading-normal">Pay at your doorstep with Cash/UPI on delivery. (₹15 charge applies)</p>
              </button>
            </div>
          </div>

        </div>

        {/* Right Side: Order Summary & Placement */}
        <div className="space-y-6">
          <div className="bg-white border border-gray-100 rounded-[2.5rem] p-6 shadow-sm space-y-6">
            <h2 className="text-base font-black text-gray-800 flex items-center gap-2 border-b border-gray-50 pb-4">
              <ShoppingBag size={18} className="text-primary" /> Order Details
            </h2>

            {/* Cart items list */}
            <div className="max-h-60 overflow-y-auto space-y-4">
              {cart.map((item) => {
                const priceAfter = item.product.price * (1 - item.product.discountPercentage / 100);
                return (
                  <div key={item.product.id} className="flex justify-between items-center gap-4 text-xs">
                    <div className="min-w-0">
                      <div className="font-bold text-gray-800 truncate">{item.product.name}</div>
                      <div className="text-[10px] text-gray-400">Qty: {item.quantity} • {item.product.weight}</div>
                    </div>
                    <span className="font-black text-gray-700">₹{Math.round(priceAfter * item.quantity)}</span>
                  </div>
                );
              })}
            </div>

            {/* Totals details */}
            <div className="border-t border-gray-50 pt-4 space-y-2 text-xs text-gray-500">
              <div className="flex justify-between">
                <span>Items Subtotal</span>
                <span className="font-semibold text-gray-800">₹{subtotal}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-emerald-600">
                  <span>Promo Code applied</span>
                  <span>- ₹{discount}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>GST (5%)</span>
                <span className="font-semibold text-gray-800">₹{tax}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery & Surcharge</span>
                <span className="font-semibold text-gray-800">₹{deliveryCharges}</span>
              </div>
              <div className="border-t border-gray-200 mt-4 pt-4 flex justify-between text-sm font-black text-gray-800">
                <span>Total Bill</span>
                <span className="text-primary text-lg">₹{total}</span>
              </div>
            </div>

            {/* Shield tag */}
            <div className="bg-forest/5 text-forest border border-forest/10 rounded-2xl p-3 flex items-center gap-2 text-[10px] font-bold">
              <ShieldCheck size={16} /> <span>100% Safe Payments • Authentic Sourcing</span>
            </div>

            {/* Action Trigger */}
            <button
              onClick={handlePlaceOrder}
              disabled={placingOrder || cart.length === 0}
              className="w-full bg-primary hover:bg-primary/95 text-white py-4 rounded-full font-black uppercase tracking-widest text-xs transition-all shadow-md hover:shadow-lg disabled:opacity-50"
            >
              {placingOrder ? "Placing Order..." : `Place Order (₹${total})`}
            </button>
          </div>
        </div>

      </div>

      {/* Razorpay Simulation Fullscreen Overlay */}
      {showRazorpay && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-[#1C2541] text-white w-full max-w-md rounded-[2rem] overflow-hidden shadow-2xl flex flex-col">
            
            {/* Header styled like Razorpay */}
            <div className="bg-[#0b132b] p-6 flex justify-between items-center border-b border-gray-800">
              <div className="flex items-center gap-2">
                <span className="font-black text-lg text-sky-400">razorpay</span>
                <span className="text-[10px] bg-slate-800 text-sky-300 font-bold px-2 py-0.5 rounded">DEMO MODE</span>
              </div>
              <button onClick={handleRazorpayCancel} className="text-gray-400 hover:text-white">
                ✕
              </button>
            </div>

            {/* Amount details */}
            <div className="p-8 text-center space-y-6">
              <div className="space-y-1">
                <span className="text-xs text-slate-400 uppercase tracking-widest font-black">Transaction Amount</span>
                <h2 className="text-4xl font-extrabold text-sky-400">₹{total}</h2>
              </div>

              <div className="bg-slate-900/50 rounded-2xl p-4 text-xs text-left text-slate-300 border border-slate-800 space-y-2">
                <div className="flex justify-between">
                  <span>Merchant:</span>
                  <span className="font-semibold text-white">OdishaBox Bengaluru</span>
                </div>
                <div className="flex justify-between">
                  <span>Contact:</span>
                  <span className="font-semibold text-white">{user?.email}</span>
                </div>
              </div>

              {/* Simulation decisions */}
              <div className="space-y-3 pt-4">
                <button
                  onClick={handleRazorpaySuccess}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-full text-xs transition-colors shadow-lg shadow-emerald-900/30"
                >
                  ✓ Confirm Payment (Simulated Success)
                </button>
                <button
                  onClick={handleRazorpayCancel}
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-full text-xs transition-colors shadow-lg shadow-red-900/30"
                >
                  ✕ Cancel Payment (Simulated Decline)
                </button>
              </div>
            </div>

            <div className="bg-slate-950 p-4 text-center text-[10px] text-slate-500 font-medium">
              This is a sandbox simulation wrapper. No real monetary transactions will occur.
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
