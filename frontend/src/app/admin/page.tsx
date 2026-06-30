"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/services/api";
import { getProductImage } from "@/components/ProductCard";
import {
  LayoutDashboard,
  Package,
  FileSpreadsheet,
  Tag,
  DollarSign,
  ShoppingCart,
  Users,
  AlertTriangle,
  Plus,
  Trash2,
  Edit2,
  CheckCircle,
  Truck,
  XCircle,
  Lock,
  Mail
} from "lucide-react";

interface Product {
  id: number;
  name: string;
  price: number;
  discountPercentage: number;
  weight: string;
  stockQuantity: number;
  category: { id: number; name: string };
  shelfLife: string;
}

interface Order {
  id: number;
  user: { name: string; email: string };
  orderDate: string;
  status: string;
  total: number;
  deliveryAddress: string;
  deliverySlot: string;
}

interface Coupon {
  id: number;
  code: string;
  discountPercentage: number;
  maxDiscount: number;
  minOrderAmount: number;
  active: boolean;
}

export default function AdminDashboard() {
  const router = useRouter();
  const { user, login, isAdmin, loading } = useAuth();

  // Admin login states
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loggingIn, setLoggingIn] = useState(false);

  // Tab state
  const [activeTab, setActiveTab] = useState("dashboard"); // dashboard, products, orders, coupons

  // Dashboard stats state
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    totalCustomers: 0,
    lowStockAlerts: 0,
    monthlyRevenue: [0, 0, 0, 0],
    months: ["March", "April", "May", "June"]
  });

  // Entities state
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [categories, setCategories] = useState<{ id: number; name: string }[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  // Form states
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productInputs, setProductInputs] = useState({
    name: "",
    description: "",
    categoryId: 1,
    price: 100,
    discountPercentage: 0,
    weight: "500g",
    stockQuantity: 50,
    shelfLife: "7 Days",
    isBestSeller: false,
    isNewArrival: false,
    isFestivalSpecial: false
  });

  const [showCouponForm, setShowCouponForm] = useState(false);
  const [couponInputs, setCouponInputs] = useState({
    code: "",
    discountPercentage: 10,
    maxDiscount: 100,
    minOrderAmount: 399,
    active: true
  });

  // Trigger loading details if admin
  useEffect(() => {
    if (!loading && user && isAdmin) {
      loadData();
    }
  }, [user, loading, activeTab]);

  const loadData = async () => {
    setLoadingData(true);
    try {
      if (activeTab === "dashboard") {
        const res = await api.admin.getDashboardSummary();
        setStats(res);
      } else if (activeTab === "products") {
        const [prods, cats] = await Promise.all([
          api.products.getAll(),
          api.products.getCategories()
        ]);
        setProducts(prods);
        setCategories(cats);
        if (cats.length > 0) {
          setProductInputs((p) => ({ ...p, categoryId: cats[0].id }));
        }
      } else if (activeTab === "orders") {
        const res = await api.admin.getAllOrders();
        setOrders(res);
      } else if (activeTab === "coupons") {
        const res = await api.admin.getCoupons();
        setCoupons(res);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingData(false);
    }
  };

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoggingIn(true);
    setLoginError(null);
    try {
      await login(adminEmail, adminPassword);
    } catch (err: any) {
      setLoginError(err.message || "Invalid Admin credentials!");
    } finally {
      setLoggingIn(false);
    }
  };

  // Product actions
  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        name: productInputs.name,
        description: productInputs.description,
        price: productInputs.price,
        discountPercentage: productInputs.discountPercentage,
        weight: productInputs.weight,
        stockQuantity: productInputs.stockQuantity,
        shelfLife: productInputs.shelfLife,
        bestSeller: productInputs.isBestSeller,
        newArrival: productInputs.isNewArrival,
        festivalSpecial: productInputs.isFestivalSpecial,
        category: { id: productInputs.categoryId }
      };

      if (editingProduct) {
        await api.admin.updateProduct(editingProduct.id, payload);
      } else {
        await api.admin.createProduct(payload);
      }
      setShowProductForm(false);
      setEditingProduct(null);
      resetProductInputs();
      loadData();
    } catch (err) {
      console.error(err);
    }
  };

  const startEditProduct = (prod: Product) => {
    setEditingProduct(prod);
    setProductInputs({
      name: prod.name,
      description: (prod as any).description || "",
      categoryId: prod.category?.id || 1,
      price: prod.price,
      discountPercentage: prod.discountPercentage,
      weight: prod.weight,
      stockQuantity: prod.stockQuantity,
      shelfLife: prod.shelfLife || "7 Days",
      isBestSeller: (prod as any).bestSeller || false,
      isNewArrival: (prod as any).newArrival || false,
      isFestivalSpecial: (prod as any).festivalSpecial || false
    });
    setShowProductForm(true);
  };

  const handleDeleteProduct = async (id: number) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      await api.admin.deleteProduct(id);
      setProducts(products.filter((p) => p.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const resetProductInputs = () => {
    setProductInputs({
      name: "",
      description: "",
      categoryId: categories.length > 0 ? categories[0].id : 1,
      price: 100,
      discountPercentage: 0,
      weight: "500g",
      stockQuantity: 50,
      shelfLife: "7 Days",
      isBestSeller: false,
      isNewArrival: false,
      isFestivalSpecial: false
    });
  };

  // Order actions
  const handleUpdateOrderStatus = async (id: number, status: string) => {
    try {
      await api.admin.updateOrderStatus(id, status);
      setOrders(orders.map((o) => (o.id === id ? { ...o, status } : o)));
    } catch (err) {
      console.error(err);
    }
  };

  // Coupon actions
  const handleCouponSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.admin.createCoupon({
        code: couponInputs.code.toUpperCase(),
        discountPercentage: couponInputs.discountPercentage,
        maxDiscount: couponInputs.maxDiscount,
        minOrderAmount: couponInputs.minOrderAmount,
        active: couponInputs.active
      });
      setShowCouponForm(false);
      setCouponInputs({
        code: "",
        discountPercentage: 10,
        maxDiscount: 100,
        minOrderAmount: 399,
        active: true
      });
      loadData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteCoupon = async (id: number) => {
    try {
      await api.admin.deleteCoupon(id);
      setCoupons(coupons.filter((c) => c.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return <div className="max-w-7xl mx-auto px-4 py-16 text-center font-bold">Checking authentication...</div>;
  }

  // Not logged in or not admin - Render Admin Login
  if (!user || !isAdmin) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="max-w-md w-full mx-auto bg-white border border-gray-100 p-8 sm:p-10 rounded-[2.5rem] shadow-sm space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 bg-orange-100 text-primary rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock size={20} />
            </div>
            <h1 className="text-2xl font-black text-gray-900">Secure Admin Login</h1>
            <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Access OdishaBox admin controls</p>
          </div>

          {loginError && (
            <div className="bg-red-50 border border-red-100 text-red-700 text-xs font-bold p-4 rounded-2xl">
              {loginError}
            </div>
          )}

          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div className="relative">
              <input
                type="email"
                required
                placeholder="Admin Email"
                className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-4 pl-12 text-xs focus:outline-none focus:ring-1 focus:ring-primary focus:bg-white text-gray-700"
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
              />
              <Mail className="absolute left-4 top-4.5 text-gray-400" size={16} />
            </div>

            <div className="relative">
              <input
                type="password"
                required
                placeholder="Admin Password"
                className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-4 pl-12 text-xs focus:outline-none focus:ring-1 focus:ring-primary focus:bg-white text-gray-700"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
              />
              <Lock className="absolute left-4 top-4.5 text-gray-400" size={16} />
            </div>

            <button
              type="submit"
              disabled={loggingIn}
              className="w-full bg-primary hover:bg-primary/95 text-white py-4 rounded-full font-black uppercase tracking-widest text-xs transition-colors shadow disabled:opacity-50"
            >
              {loggingIn ? "Verifying..." : "Login to Console"}
            </button>
          </form>

          <div className="text-center text-[10px] text-gray-400 font-semibold">
            Use: <span className="font-extrabold text-gray-500">admin@odishabox.com</span> / password: <span className="font-extrabold text-gray-500">admin123</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Title Header */}
      <div className="flex justify-between items-center border-b border-gray-100 pb-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Admin Control Center</h1>
          <p className="text-xs text-gray-400 font-semibold mt-1">Logged in as {user.name} (Administrator)</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Navigation panel */}
        <aside className="space-y-1.5 self-start bg-white p-4 border border-gray-100 rounded-3xl shadow-sm">
          <button
            onClick={() => setActiveTab("dashboard")}
            className={`w-full text-left px-4 py-3 rounded-2xl text-xs font-bold transition-colors flex items-center gap-2 ${
              activeTab === "dashboard" ? "bg-orange-100 text-primary" : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            <LayoutDashboard size={16} /> Summary Analytics
          </button>
          <button
            onClick={() => setActiveTab("products")}
            className={`w-full text-left px-4 py-3 rounded-2xl text-xs font-bold transition-colors flex items-center gap-2 ${
              activeTab === "products" ? "bg-orange-100 text-primary" : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            <Package size={16} /> Product Catalog
          </button>
          <button
            onClick={() => setActiveTab("orders")}
            className={`w-full text-left px-4 py-3 rounded-2xl text-xs font-bold transition-colors flex items-center gap-2 ${
              activeTab === "orders" ? "bg-orange-100 text-primary" : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            <FileSpreadsheet size={16} /> Customer Orders
          </button>
          <button
            onClick={() => setActiveTab("coupons")}
            className={`w-full text-left px-4 py-3 rounded-2xl text-xs font-bold transition-colors flex items-center gap-2 ${
              activeTab === "coupons" ? "bg-orange-100 text-primary" : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            <Tag size={16} /> Promo Coupons
          </button>
        </aside>

        {/* Content area */}
        <div className="md:col-span-3">
          
          {loadingData ? (
            <div className="bg-white p-12 border border-gray-100 rounded-[2.5rem] shadow-sm text-center font-bold">
              Fetching stats and details...
            </div>
          ) : (
            <>
              {/* Dashboard overview */}
              {activeTab === "dashboard" && (
                <div className="space-y-8">
                  {/* Grid summary blocks */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <div className="bg-white p-6 border border-gray-100 rounded-3xl shadow-sm flex items-center gap-4">
                      <div className="w-12 h-12 bg-orange-100 text-primary rounded-full flex items-center justify-center">
                        <DollarSign size={20} />
                      </div>
                      <div>
                        <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Total Sales</div>
                        <h3 className="text-xl font-black text-gray-900">₹{stats.totalRevenue}</h3>
                      </div>
                    </div>
                    <div className="bg-white p-6 border border-gray-100 rounded-3xl shadow-sm flex items-center gap-4">
                      <div className="w-12 h-12 bg-sky-100 text-sky-600 rounded-full flex items-center justify-center">
                        <ShoppingCart size={20} />
                      </div>
                      <div>
                        <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Total Orders</div>
                        <h3 className="text-xl font-black text-gray-900">{stats.totalOrders}</h3>
                      </div>
                    </div>
                    <div className="bg-white p-6 border border-gray-100 rounded-3xl shadow-sm flex items-center gap-4">
                      <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center">
                        <Users size={20} />
                      </div>
                      <div>
                        <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Customers</div>
                        <h3 className="text-xl font-black text-gray-900">{stats.totalCustomers}</h3>
                      </div>
                    </div>
                  </div>

                  {/* Stock Alert widget */}
                  {stats.lowStockAlerts > 0 && (
                    <div className="bg-amber-50 border border-amber-100 rounded-3xl p-5 flex items-start gap-3">
                      <AlertTriangle className="text-amber-600 flex-shrink-0 mt-0.5" size={18} />
                      <div>
                        <h4 className="text-xs font-bold text-amber-800">Inventory Alert ({stats.lowStockAlerts} items)</h4>
                        <p className="text-[11px] text-amber-600 mt-0.5 font-semibold">Several products have less than 10 units in stock. Check Catalog tab to restock.</p>
                      </div>
                    </div>
                  )}

                  {/* Sample charts box */}
                  <div className="bg-white border border-gray-100 rounded-[2.5rem] p-6 sm:p-8 shadow-sm">
                    <h3 className="text-sm font-black uppercase tracking-wider text-gray-800 mb-6">Monthly Revenue Growth</h3>
                    <div className="grid grid-cols-4 gap-6 items-end h-40">
                      {stats.monthlyRevenue.map((val, idx) => {
                        const maxVal = Math.max(...stats.monthlyRevenue) || 1;
                        const heightPct = Math.round((val / maxVal) * 100);
                        return (
                          <div key={idx} className="flex flex-col items-center gap-2 h-full justify-end">
                            <span className="text-[10px] font-black text-primary">₹{Math.round(val)}</span>
                            <div className="bg-primary rounded-t-lg w-full max-w-[40px] transition-all" style={{ height: `${heightPct}%` }} />
                            <span className="text-[10px] text-gray-400 font-semibold">{stats.months[idx]}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* Product Catalog tab */}
              {activeTab === "products" && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-black text-gray-900">Manage Catalog</h2>
                    <button
                      onClick={() => {
                        setEditingProduct(null);
                        resetProductInputs();
                        setShowProductForm(true);
                      }}
                      className="text-xs bg-forest hover:bg-forest/95 text-white font-bold px-4 py-2 rounded-full shadow transition-colors flex items-center gap-1"
                    >
                      <Plus size={14} /> Add Product
                    </button>
                  </div>

                  {/* New/Edit form */}
                  {showProductForm && (
                    <form onSubmit={handleProductSubmit} className="bg-white border border-orange-100 p-6 rounded-3xl space-y-4 shadow-sm">
                      <h3 className="text-xs font-black uppercase tracking-wider text-gray-700">
                        {editingProduct ? "Edit Product" : "Create New Product"}
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <input
                          type="text"
                          required
                          placeholder="Product Name"
                          className="bg-gray-50 border border-gray-200 rounded-xl p-3 text-xs w-full text-gray-700"
                          value={productInputs.name}
                          onChange={(e) => setProductInputs({ ...productInputs, name: e.target.value })}
                        />
                        <select
                          className="bg-gray-50 border border-gray-200 rounded-xl p-3 text-xs w-full text-gray-700"
                          value={productInputs.categoryId}
                          onChange={(e) => setProductInputs({ ...productInputs, categoryId: parseInt(e.target.value) })}
                        >
                          {categories.map((c) => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                          ))}
                        </select>
                        <input
                          type="text"
                          required
                          placeholder="Weight (e.g. 500g, 1L)"
                          className="bg-gray-50 border border-gray-200 rounded-xl p-3 text-xs w-full text-gray-700"
                          value={productInputs.weight}
                          onChange={(e) => setProductInputs({ ...productInputs, weight: e.target.value })}
                        />
                        <input
                          type="number"
                          required
                          placeholder="Base Price (Rs.)"
                          className="bg-gray-50 border border-gray-200 rounded-xl p-3 text-xs w-full text-gray-700"
                          value={productInputs.price}
                          onChange={(e) => setProductInputs({ ...productInputs, price: parseFloat(e.target.value) })}
                        />
                        <input
                          type="number"
                          placeholder="Discount Percentage"
                          className="bg-gray-50 border border-gray-200 rounded-xl p-3 text-xs w-full text-gray-700"
                          value={productInputs.discountPercentage}
                          onChange={(e) => setProductInputs({ ...productInputs, discountPercentage: parseFloat(e.target.value) })}
                        />
                        <input
                          type="number"
                          required
                          placeholder="Stock Quantity"
                          className="bg-gray-50 border border-gray-200 rounded-xl p-3 text-xs w-full text-gray-700"
                          value={productInputs.stockQuantity}
                          onChange={(e) => setProductInputs({ ...productInputs, stockQuantity: parseInt(e.target.value) })}
                        />
                      </div>
                      <textarea
                        placeholder="Description..."
                        rows={3}
                        className="bg-gray-50 border border-gray-200 rounded-xl p-3 text-xs w-full text-gray-700 focus:outline-none"
                        value={productInputs.description}
                        onChange={(e) => setProductInputs({ ...productInputs, description: e.target.value })}
                      />
                      
                      {/* Flags checkboxes */}
                      <div className="flex gap-6 text-xs font-bold text-gray-600">
                        <label className="flex items-center gap-1.5">
                          <input
                            type="checkbox"
                            checked={productInputs.isBestSeller}
                            onChange={(e) => setProductInputs({ ...productInputs, isBestSeller: e.target.checked })}
                          /> Best Seller
                        </label>
                        <label className="flex items-center gap-1.5">
                          <input
                            type="checkbox"
                            checked={productInputs.isNewArrival}
                            onChange={(e) => setProductInputs({ ...productInputs, isNewArrival: e.target.checked })}
                          /> New Arrival
                        </label>
                        <label className="flex items-center gap-1.5">
                          <input
                            type="checkbox"
                            checked={productInputs.isFestivalSpecial}
                            onChange={(e) => setProductInputs({ ...productInputs, isFestivalSpecial: e.target.checked })}
                          /> Festival Special
                        </label>
                      </div>

                      <div className="flex justify-end gap-2 pt-2">
                        <button
                          type="button"
                          onClick={() => {
                            setShowProductForm(false);
                            setEditingProduct(null);
                          }}
                          className="px-4 py-2 rounded-full border border-gray-200 text-xs font-bold text-gray-600"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="bg-forest hover:bg-forest/95 text-white px-6 py-2 rounded-full text-xs font-bold transition-colors"
                        >
                          {editingProduct ? "Update Catalog" : "Add to Catalog"}
                        </button>
                      </div>
                    </form>
                  )}

                  {/* Products Grid Table view */}
                  <div className="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm">
                    <div className="p-6 border-b border-gray-50 font-black text-xs text-gray-500 uppercase tracking-widest">Active Stock Directory</div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs text-left text-gray-600">
                        <thead className="bg-gray-50/50 text-gray-400 font-bold uppercase tracking-wider">
                          <tr>
                            <th className="px-6 py-3">Product</th>
                            <th className="px-6 py-3">Category</th>
                            <th className="px-6 py-3">Price</th>
                            <th className="px-6 py-3">Stock</th>
                            <th className="px-6 py-3 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                          {products.map((prod) => (
                            <tr key={prod.id} className="hover:bg-gray-50/50 transition-colors">
                              <td className="px-6 py-4 flex items-center gap-3">
                                <img src={getProductImage(prod.name)} alt={prod.name} className="w-8 h-8 rounded-lg object-cover flex-shrink-0" />
                                <div>
                                  <div className="font-bold text-gray-800">{prod.name}</div>
                                  <div className="text-[10px] text-gray-400">{prod.weight}</div>
                                </div>
                              </td>
                              <td className="px-6 py-4 font-semibold">{prod.category?.name}</td>
                              <td className="px-6 py-4 font-black">₹{prod.price}</td>
                              <td className={`px-6 py-4 font-extrabold ${prod.stockQuantity <= 10 ? "text-red-500" : "text-gray-700"}`}>
                                {prod.stockQuantity} units
                              </td>
                              <td className="px-6 py-4 text-right flex justify-end gap-2 pt-5">
                                <button
                                  onClick={() => startEditProduct(prod)}
                                  className="p-1 hover:bg-gray-100 rounded text-gray-400 hover:text-primary transition-colors"
                                  title="Edit"
                                >
                                  <Edit2 size={13} />
                                </button>
                                <button
                                  onClick={() => handleDeleteProduct(prod.id)}
                                  className="p-1 hover:bg-gray-100 rounded text-gray-400 hover:text-red-500 transition-colors"
                                  title="Delete"
                                >
                                  <Trash2 size={13} />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* Customer Orders management */}
              {activeTab === "orders" && (
                <div className="space-y-6">
                  <h2 className="text-xl font-black text-gray-900">Manage Orders</h2>
                  <div className="space-y-6">
                    {orders.length === 0 ? (
                      <div className="text-xs text-gray-400 py-4 font-semibold italic">No customer orders placed yet.</div>
                    ) : (
                      orders.map((order) => (
                        <div key={order.id} className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm space-y-4">
                          <div className="flex flex-wrap justify-between items-center gap-2 border-b border-gray-50 pb-4">
                            <div>
                              <span className="text-xs font-black text-gray-800">Order #OB-{order.id}</span>
                              <div className="text-[10px] text-gray-400 font-semibold">User: {order.user.name} ({order.user.email})</div>
                            </div>
                            <div className="flex gap-2">
                              {order.status === "PENDING" && (
                                <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded">Pending Payment</span>
                              )}
                              {order.status === "CONFIRMED" && (
                                <div className="flex gap-1">
                                  <button
                                    onClick={() => handleUpdateOrderStatus(order.id, "SHIPPED")}
                                    className="bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-bold px-3 py-1 rounded transition-colors flex items-center gap-0.5"
                                  >
                                    <Truck size={10} /> Ship Order
                                  </button>
                                  <button
                                    onClick={() => handleUpdateOrderStatus(order.id, "CANCELLED")}
                                    className="bg-red-50 hover:bg-red-100 text-red-600 text-[10px] font-bold px-2 py-1 rounded transition-colors"
                                  >
                                    Cancel
                                  </button>
                                </div>
                              )}
                              {order.status === "SHIPPED" && (
                                <button
                                  onClick={() => handleUpdateOrderStatus(order.id, "DELIVERED")}
                                  className="bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-bold px-3 py-1 rounded transition-colors flex items-center gap-0.5"
                                >
                                  <CheckCircle size={10} /> Deliver Order
                                </button>
                              )}
                              {order.status === "DELIVERED" && (
                                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2.5 py-0.5 rounded-full">Delivered</span>
                              )}
                              {order.status === "CANCELLED" && (
                                <span className="bg-red-100 text-red-800 text-[10px] font-bold px-2.5 py-0.5 rounded-full">Cancelled</span>
                              )}
                            </div>
                          </div>
                          
                          {/* Details details */}
                          <div className="text-xs space-y-1 text-gray-500 leading-relaxed">
                            <div>Address: <span className="font-medium text-gray-700">{order.deliveryAddress}</span></div>
                            <div>Slot: <span className="font-medium text-gray-700">{order.deliverySlot}</span></div>
                            <div className="text-sm font-black text-gray-800 mt-2">Bill Paid: <span className="text-primary">₹{order.total}</span></div>
                          </div>
                        </div>
                      )))}
                  </div>
                </div>
              )}

              {/* Promo Coupons Management */}
              {activeTab === "coupons" && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-black text-gray-900">Manage Coupons</h2>
                    <button
                      onClick={() => setShowCouponForm(!showCouponForm)}
                      className="text-xs bg-forest hover:bg-forest/95 text-white font-bold px-4 py-2 rounded-full shadow transition-colors flex items-center gap-1"
                    >
                      <Plus size={14} /> Add Coupon
                    </button>
                  </div>

                  {/* Add coupon form */}
                  {showCouponForm && (
                    <form onSubmit={handleCouponSubmit} className="bg-white border border-orange-100 p-6 rounded-3xl space-y-4 shadow-sm">
                      <h3 className="text-xs font-black uppercase tracking-wider text-gray-700">Create New Coupon</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <input
                          type="text"
                          required
                          placeholder="Coupon Code (e.g. WELCOME10)"
                          className="bg-gray-50 border border-gray-200 rounded-xl p-3 text-xs w-full text-gray-700 uppercase"
                          value={couponInputs.code}
                          onChange={(e) => setCouponInputs({ ...couponInputs, code: e.target.value })}
                        />
                        <input
                          type="number"
                          required
                          placeholder="Discount Percentage"
                          className="bg-gray-50 border border-gray-200 rounded-xl p-3 text-xs w-full text-gray-700"
                          value={couponInputs.discountPercentage}
                          onChange={(e) => setCouponInputs({ ...couponInputs, discountPercentage: parseFloat(e.target.value) })}
                        />
                        <input
                          type="number"
                          required
                          placeholder="Max Discount Limit (Rs.)"
                          className="bg-gray-50 border border-gray-200 rounded-xl p-3 text-xs w-full text-gray-700"
                          value={couponInputs.maxDiscount}
                          onChange={(e) => setCouponInputs({ ...couponInputs, maxDiscount: parseFloat(e.target.value) })}
                        />
                        <input
                          type="number"
                          required
                          placeholder="Min Order Amount (Rs.)"
                          className="bg-gray-50 border border-gray-200 rounded-xl p-3 text-xs w-full text-gray-700"
                          value={couponInputs.minOrderAmount}
                          onChange={(e) => setCouponInputs({ ...couponInputs, minOrderAmount: parseFloat(e.target.value) })}
                        />
                      </div>
                      <div className="flex justify-end gap-2 pt-2">
                        <button
                          type="button"
                          onClick={() => setShowCouponForm(false)}
                          className="px-4 py-2 rounded-full border border-gray-200 text-xs font-bold text-gray-600"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="bg-forest hover:bg-forest/95 text-white px-6 py-2 rounded-full text-xs font-bold transition-colors"
                        >
                          Save Coupon
                        </button>
                      </div>
                    </form>
                  )}

                  {/* Coupons List */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    {coupons.map((coup) => (
                      <div key={coup.id} className="bg-white border border-gray-100 rounded-3xl p-5 shadow-sm flex flex-col justify-between h-40">
                        <div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-black text-primary uppercase">{coup.code}</span>
                            <span className={`text-[9px] font-bold px-2 py-0.5 rounded ${coup.active ? "bg-emerald-100 text-emerald-800" : "bg-gray-100 text-gray-400"}`}>
                              {coup.active ? "ACTIVE" : "INACTIVE"}
                            </span>
                          </div>
                          <p className="text-xs text-gray-500 font-medium leading-relaxed mt-3">
                            Save {coup.discountPercentage}% up to ₹{coup.maxDiscount} on orders above ₹{coup.minOrderAmount}.
                          </p>
                        </div>
                        <div className="flex justify-end pt-4">
                          <button
                            onClick={() => handleDeleteCoupon(coup.id)}
                            className="text-gray-400 hover:text-red-500 transition-colors p-1"
                            title="Delete"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

        </div>
      </div>

    </div>
  );
}
