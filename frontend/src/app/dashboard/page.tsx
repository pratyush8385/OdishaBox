"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/services/api";
import { User, ShoppingBag, MapPin, Gift, AlertCircle, Plus, Trash2, ShieldCheck, CheckCircle, Ship, Compass, HelpCircle } from "lucide-react";
import { motion } from "framer-motion";

interface Order {
  id: number;
  orderDate: string;
  status: string;
  total: number;
  deliveryAddress: string;
  deliverySlot: string;
  paymentMethod: string;
  paymentStatus: string;
  items: {
    id: number;
    product: {
      name: string;
      weight: string;
    };
    quantity: number;
    unitPrice: number;
  }[];
}

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

export default function Dashboard() {
  const router = useRouter();
  const { user, loading, logout } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [activeTab, setActiveTab] = useState("orders"); // orders, addresses, rewards
  const [loadingData, setLoadingData] = useState(true);

  // Address form input
  const [showForm, setShowForm] = useState(false);
  const [newAddr, setNewAddr] = useState({
    name: "Home",
    streetAddress: "",
    city: "Bengaluru",
    state: "Karnataka",
    zipCode: "",
    phoneNumber: user?.phoneNumber || "",
    isDefault: false
  });

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
      return;
    }

    if (user) {
      async function loadUserData() {
        setLoadingData(true);
        try {
          const [orderRes, addrRes] = await Promise.all([
            api.orders.getUserOrders(),
            api.user.getAddresses()
          ]);
          setOrders(orderRes);
          setAddresses(addrRes);
        } catch (err) {
          console.error(err);
        } finally {
          setLoadingData(false);
        }
      }
      loadUserData();
    }
  }, [user, loading]);

  if (loading || !user) {
    return <div className="max-w-7xl mx-auto px-4 py-16 text-center font-bold">Loading dashboard...</div>;
  }

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const saved = await api.user.addAddress(newAddr);
      setAddresses([...addresses, saved]);
      setShowForm(false);
      setNewAddr({
        name: "Home",
        streetAddress: "",
        city: "Bengaluru",
        state: "Karnataka",
        zipCode: "",
        phoneNumber: user.phoneNumber || "",
        isDefault: false
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteAddress = async (id: number) => {
    try {
      await api.user.deleteAddress(id);
      setAddresses(addresses.filter((a) => a.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  // Status color mapper
  const getStatusBadge = (status: string) => {
    const norm = status.toUpperCase();
    if (norm === "DELIVERED") {
      return <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2.5 py-0.5 rounded-full">Delivered</span>;
    }
    if (norm === "SHIPPED") {
      return <span className="bg-blue-100 text-blue-800 text-[10px] font-bold px-2.5 py-0.5 rounded-full">Shipped</span>;
    }
    if (norm === "CONFIRMED") {
      return <span className="bg-orange-100 text-primary text-[10px] font-bold px-2.5 py-0.5 rounded-full">Confirmed</span>;
    }
    if (norm === "CANCELLED") {
      return <span className="bg-red-100 text-red-800 text-[10px] font-bold px-2.5 py-0.5 rounded-full">Cancelled</span>;
    }
    return <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2.5 py-0.5 rounded-full">Pending Payment</span>;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Profile Header banner */}
      <div className="bg-gradient-to-r from-orange-50 to-orange-100/50 p-6 sm:p-8 rounded-[2.5rem] border border-orange-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-primary text-white rounded-full flex items-center justify-center font-black text-xl shadow-md">
            {user.name.charAt(0)}
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-gray-900">{user.name}</h1>
            <p className="text-xs text-gray-500 font-medium">{user.email} • {user.phoneNumber || "No phone linked"}</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="text-xs font-black uppercase tracking-wider bg-white border border-gray-200 text-gray-700 hover:text-red-500 hover:border-red-100 px-6 py-2.5 rounded-full transition-all"
        >
          Sign Out
        </button>
      </div>

      {/* Tabs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Nav list */}
        <aside className="space-y-1.5 self-start bg-white p-4 border border-gray-100 rounded-3xl shadow-sm">
          <button
            onClick={() => setActiveTab("orders")}
            className={`w-full text-left px-4 py-3 rounded-2xl text-xs font-bold transition-colors flex items-center gap-2 ${
              activeTab === "orders" ? "bg-orange-100 text-primary" : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            <ShoppingBag size={16} /> My Orders
          </button>
          <button
            onClick={() => setActiveTab("addresses")}
            className={`w-full text-left px-4 py-3 rounded-2xl text-xs font-bold transition-colors flex items-center gap-2 ${
              activeTab === "addresses" ? "bg-orange-100 text-primary" : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            <MapPin size={16} /> Delivery Addresses
          </button>
          <button
            onClick={() => setActiveTab("rewards")}
            className={`w-full text-left px-4 py-3 rounded-2xl text-xs font-bold transition-colors flex items-center gap-2 ${
              activeTab === "rewards" ? "bg-orange-100 text-primary" : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            <Gift size={16} /> Loyalty Rewards
          </button>
        </aside>

        {/* Content detail */}
        <section className="md:col-span-3">
          {loadingData ? (
            <div className="bg-white p-8 border border-gray-100 rounded-[2.5rem] shadow-sm text-center font-bold">
              Fetching details...
            </div>
          ) : (
            <>
              {/* Order History */}
              {activeTab === "orders" && (
                <div className="space-y-6">
                  <h2 className="text-xl font-black text-gray-900">Your Order History</h2>
                  {orders.length === 0 ? (
                    <div className="bg-white p-12 border border-gray-50 rounded-[2.5rem] text-center shadow-sm">
                      <div className="text-3xl mb-4">🛒</div>
                      <h3 className="text-sm font-bold text-gray-700 mb-1">No orders yet</h3>
                      <p className="text-xs text-gray-400 max-w-xs mx-auto mb-6">
                        Once you place orders, you can track their status and details here.
                      </p>
                      <button onClick={() => router.push("/shop")} className="bg-primary hover:bg-primary/95 text-white text-xs font-bold uppercase tracking-wider px-6 py-2.5 rounded-full shadow">
                        Shop Now
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {orders.map((order) => (
                        <div key={order.id} className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm space-y-4">
                          {/* Order metadata Header */}
                          <div className="flex flex-wrap justify-between items-center gap-2 border-b border-gray-50 pb-4">
                            <div>
                              <span className="text-xs font-black text-gray-800">Order #OB-{order.id}</span>
                              <div className="text-[10px] text-gray-400 font-semibold">{new Date(order.orderDate).toLocaleDateString()} at {new Date(order.orderDate).toLocaleTimeString()}</div>
                            </div>
                            <div className="flex items-center gap-2">
                              {getStatusBadge(order.status)}
                            </div>
                          </div>

                          {/* Items List */}
                          <div className="space-y-2">
                            {order.items.map((item) => (
                              <div key={item.id} className="flex justify-between items-center text-xs">
                                <span className="font-semibold text-gray-700">
                                  {item.product.name} ({item.product.weight}) <span className="text-gray-400">x{item.quantity}</span>
                                </span>
                                <span className="font-bold text-gray-800">₹{Math.round(item.unitPrice * item.quantity)}</span>
                              </div>
                            ))}
                          </div>

                          {/* Bottom metadata */}
                          <div className="bg-gray-50/50 rounded-2xl p-4 text-[10px] sm:text-xs text-gray-500 border border-gray-50 grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <div className="font-black text-gray-700 mb-0.5">Shipping Address:</div>
                              <p className="line-clamp-2 leading-relaxed">{order.deliveryAddress}</p>
                              <div className="font-black text-gray-700 mt-2">Delivery Slot:</div>
                              <p className="leading-relaxed">{order.deliverySlot}</p>
                            </div>
                            <div className="sm:text-right flex flex-col justify-between items-start sm:items-end">
                              <div>
                                <div className="font-black text-gray-700 mb-0.5">Payment Option:</div>
                                <p className="leading-normal">{order.paymentMethod} ({order.paymentStatus})</p>
                              </div>
                              <div className="text-sm font-black text-gray-800 mt-4 sm:mt-0">
                                Total Bill: <span className="text-primary text-base">₹{order.total}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Saved Addresses */}
              {activeTab === "addresses" && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-black text-gray-900">Saved Addresses</h2>
                    <button
                      onClick={() => setShowForm(!showForm)}
                      className="text-xs bg-forest hover:bg-forest/95 text-white font-bold px-4 py-2 rounded-full shadow transition-colors flex items-center gap-1"
                    >
                      <Plus size={14} /> Add New
                    </button>
                  </div>

                  {/* Add form dialog */}
                  {showForm && (
                    <form onSubmit={handleAddAddress} className="bg-white border border-orange-100 p-6 rounded-3xl space-y-4 shadow-sm">
                      <h3 className="text-xs font-black uppercase tracking-wider text-gray-700">Add New Address</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <input
                          type="text"
                          required
                          placeholder="Label Name (e.g. Home, Office)"
                          className="bg-gray-50 border border-gray-200 rounded-xl p-3 text-xs focus:outline-none focus:ring-1 focus:ring-primary w-full text-gray-700"
                          value={newAddr.name}
                          onChange={(e) => setNewAddr({ ...newAddr, name: e.target.value })}
                        />
                        <input
                          type="text"
                          required
                          placeholder="Phone Number"
                          className="bg-gray-50 border border-gray-200 rounded-xl p-3 text-xs focus:outline-none focus:ring-1 focus:ring-primary w-full text-gray-700"
                          value={newAddr.phoneNumber}
                          onChange={(e) => setNewAddr({ ...newAddr, phoneNumber: e.target.value })}
                        />
                        <input
                          type="text"
                          required
                          placeholder="Street Address, Block, Flat No."
                          className="bg-gray-50 border border-gray-200 rounded-xl p-3 text-xs focus:outline-none focus:ring-1 focus:ring-primary w-full sm:col-span-2 text-gray-700"
                          value={newAddr.streetAddress}
                          onChange={(e) => setNewAddr({ ...newAddr, streetAddress: e.target.value })}
                        />
                        <input
                          type="text"
                          required
                          placeholder="Pincode / Zip Code"
                          className="bg-gray-50 border border-gray-200 rounded-xl p-3 text-xs focus:outline-none focus:ring-1 focus:ring-primary w-full text-gray-700"
                          value={newAddr.zipCode}
                          onChange={(e) => setNewAddr({ ...newAddr, zipCode: e.target.value })}
                        />
                      </div>
                      <div className="flex justify-end gap-2 pt-2">
                        <button
                          type="button"
                          onClick={() => setShowForm(false)}
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

                  {addresses.length === 0 ? (
                    <div className="bg-white p-12 border border-gray-50 rounded-[2.5rem] text-center shadow-sm">
                      <p className="text-xs text-gray-400 font-semibold mb-4">No addresses saved yet. Save addresses for quick checkout.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      {addresses.map((addr) => (
                        <div key={addr.id} className="bg-white border border-gray-100 rounded-3xl p-5 shadow-sm flex flex-col justify-between h-40">
                          <div>
                            <div className="flex justify-between items-center mb-1">
                              <span className="text-xs font-black uppercase tracking-wider text-gray-700">{addr.name}</span>
                              {addr.isDefault && <span className="text-[9px] bg-forest text-white font-bold px-2 py-0.5 rounded">DEFAULT</span>}
                            </div>
                            <p className="text-xs text-gray-500 font-medium line-clamp-3 leading-relaxed mt-2">{addr.streetAddress}, {addr.city}</p>
                          </div>
                          <div className="flex justify-between items-center mt-4">
                            <span className="text-[10px] text-gray-400 font-semibold">Ph: {addr.phoneNumber}</span>
                            <button
                              onClick={() => handleDeleteAddress(addr.id)}
                              className="text-gray-400 hover:text-red-500 transition-colors p-1"
                              title="Delete"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Loyalty points rewards */}
              {activeTab === "rewards" && (
                <div className="space-y-6">
                  <h2 className="text-xl font-black text-gray-900">Loyalty Rewards Program</h2>
                  <div className="bg-white border border-gray-100 rounded-[2.5rem] p-6 sm:p-8 shadow-sm grid grid-cols-1 sm:grid-cols-3 gap-6 items-center">
                    <div className="sm:col-span-2 space-y-3">
                      <span className="text-[10px] bg-orange-100 text-primary font-black uppercase tracking-widest px-3 py-1 rounded-full">OdishaBox Points Tracker</span>
                      <h3 className="text-2xl font-black text-gray-900">Your Active Points: <span className="text-primary">240 Pts</span></h3>
                      <p className="text-xs text-gray-400 leading-relaxed font-semibold">Earn 10 points for every Rs. 100 spent. Redeem points for exclusive discounts, free delivery, or custom festival boxes.</p>
                    </div>
                    <div className="bg-gradient-to-br from-orange-50 to-orange-100/50 border border-orange-100 rounded-3xl p-6 text-center space-y-2">
                      <Gift className="text-primary mx-auto" size={32} />
                      <div className="text-xs font-black text-gray-800">Free Sweets Box</div>
                      <p className="text-[10px] text-gray-400">Unlock at 500 Pts</p>
                      <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden mt-2">
                        <div className="bg-primary h-full rounded-full" style={{ width: "48%" }} />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </section>

      </div>
    </div>
  );
}
