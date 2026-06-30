"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { api } from "@/services/api";
import { ShoppingBag, Search, User, LogOut, Menu, X, MapPin, Phone, HelpCircle } from "lucide-react";

interface SearchResult {
  id: number;
  name: string;
  price: number;
  weight: string;
}

interface NavbarProps {
  onCartClick: () => void;
}

export default function Navbar({ onCartClick }: NavbarProps) {
  const { user, logout, isAdmin } = useAuth();
  const { cart } = useCart();
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [searchFocused, setSearchFocused] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const cartItemsCount = cart.reduce((total, item) => total + item.quantity, 0);

  // Close search suggestions on clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setSearchFocused(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch search results as user types
  useEffect(() => {
    if (searchQuery.trim().length < 2) {
      setSearchResults([]);
      return;
    }
    const delayDebounce = setTimeout(async () => {
      try {
        const results = await api.products.getAll(searchQuery);
        setSearchResults(results.slice(0, 5));
      } catch (err) {
        console.error("Search error", err);
      }
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [searchQuery]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setSearchFocused(false);
      router.push(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Shop", href: "/shop" },
    { name: "Festival Specials", href: "/shop?filter=festival" },
    { name: "Combo Boxes", href: "/shop?filter=combos" },
    { name: "About Us", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-orange-100 shadow-sm">
      {/* Top Banner */}
      <div className="bg-forest text-white py-1.5 px-4 text-xs font-medium">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <span className="flex items-center gap-1.5">
            <MapPin size={13} className="text-orange-300" /> Delivering authentic taste to Bengaluru homes
          </span>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <Phone size={12} /> Support: +91 98765 43210
            </span>
          </div>
        </div>
      </div>

      {/* Main Header Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between gap-4">
          
          {/* Logo */}
          <Link href="/" className="flex items-center flex-shrink-0">
            <span className="text-2xl font-black tracking-tight text-primary flex items-center">
              Odisha<span className="text-forest">Box</span>
            </span>
          </Link>

          {/* Search Bar - Desktop */}
          <div ref={searchRef} className="hidden md:block flex-1 max-w-lg relative">
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                placeholder="Search authentic sweets, groceries, pickles..."
                className="w-full bg-gray-50 text-gray-800 placeholder-gray-400 pl-10 pr-4 py-2 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white text-sm transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setSearchFocused(true)}
              />
              <Search className="absolute left-3.5 top-2.5 text-gray-400" size={16} />
            </form>

            {/* Search Dropdown/Autocomplete */}
            {searchFocused && searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-100 shadow-xl rounded-2xl overflow-hidden z-50">
                <div className="py-1">
                  {searchResults.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        setSearchQuery("");
                        setSearchFocused(false);
                        router.push(`/product/${item.id}`);
                      }}
                      className="w-full text-left px-4 py-2.5 hover:bg-orange-50/50 flex justify-between items-center transition-colors border-b border-gray-50 last:border-b-0"
                    >
                      <div>
                        <div className="text-sm font-semibold text-gray-800">{item.name}</div>
                        <div className="text-xs text-gray-400">{item.weight}</div>
                      </div>
                      <div className="text-sm font-bold text-primary">₹{item.price}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* User & Cart Controls */}
          <div className="flex items-center gap-4">
            
            {/* Admin link */}
            {user && isAdmin && (
              <Link
                href="/admin"
                className="hidden sm:inline-flex items-center px-3 py-1.5 rounded-full bg-orange-100 text-primary text-xs font-bold hover:bg-orange-200 transition-colors"
              >
                Admin Panel
              </Link>
            )}

            {/* Dashboard / Profile / Login */}
            {user ? (
              <div className="flex items-center gap-2">
                <Link
                  href="/dashboard"
                  className="flex items-center gap-1.5 text-gray-700 hover:text-primary transition-colors text-sm font-semibold"
                >
                  <User size={18} className="text-forest" />
                  <span className="hidden lg:inline">{user.name.split(" ")[0]}</span>
                </Link>
                <button
                  onClick={logout}
                  className="p-1.5 text-gray-400 hover:text-red-500 rounded-full hover:bg-gray-50 transition-colors"
                  title="Logout"
                >
                  <LogOut size={16} />
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="flex items-center gap-1.5 text-gray-700 hover:text-primary transition-colors text-sm font-semibold"
              >
                <User size={18} />
                <span className="hidden sm:inline">Sign In</span>
              </Link>
            )}

            {/* Cart Button */}
            <button
              onClick={onCartClick}
              className="relative p-2 text-gray-700 hover:text-primary rounded-full hover:bg-gray-50 transition-all"
            >
              <ShoppingBag size={20} />
              {cartItemsCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-primary text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center border border-white animate-pulse">
                  {cartItemsCount}
                </span>
              )}
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-gray-700 hover:text-primary rounded-full hover:bg-gray-50 transition-colors"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="mt-3 md:hidden relative">
          <form onSubmit={handleSearchSubmit}>
            <input
              type="text"
              placeholder="Search sweets, pickles, spices..."
              className="w-full bg-gray-50 text-gray-800 placeholder-gray-400 pl-10 pr-4 py-2 rounded-full border border-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search className="absolute left-3.5 top-2.5 text-gray-400" size={16} />
          </form>
        </div>
      </div>

      {/* Navigation Bar - Desktop */}
      <nav className="hidden md:block bg-orange-50/50 border-t border-orange-100">
        <div className="max-w-7xl mx-auto px-8">
          <div className="flex items-center justify-start gap-8 h-10">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`text-xs font-bold tracking-wider uppercase transition-colors hover:text-primary ${
                    isActive ? "text-primary border-b-2 border-primary h-10 flex items-center" : "text-gray-600"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white py-4 px-6 space-y-3 absolute top-full left-0 right-0 shadow-lg z-50">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm font-bold text-gray-700 hover:text-primary py-2 border-b border-gray-50 last:border-0"
            >
              {link.name}
            </Link>
          ))}
          {user && isAdmin && (
            <Link
              href="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm font-bold text-primary py-2 border-b border-gray-50 last:border-0"
            >
              Admin Dashboard
            </Link>
          )}
        </div>
      )}
    </header>
  );
}
