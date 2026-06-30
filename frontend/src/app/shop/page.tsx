"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { api } from "@/services/api";
import ProductCard, { ProductType } from "@/components/ProductCard";
import { SlidersHorizontal, ArrowUpDown, ChevronDown, Check } from "lucide-react";

interface CategoryType {
  id: number;
  name: string;
  slug: string;
}

function ShopContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const initialCategory = searchParams.get("category");
  const initialSearch = searchParams.get("search") || "";
  const initialFilter = searchParams.get("filter") || ""; // 'festival', 'combos'

  const [products, setProducts] = useState<ProductType[]>([]);
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters state
  const [selectedCategory, setSelectedCategory] = useState<number | null>(
    initialCategory ? parseInt(initialCategory) : null
  );
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [priceRange, setPriceRange] = useState<number>(1500);
  const [sortBy, setSortBy] = useState<string>("popular"); // popular, priceAsc, priceDesc, discount
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Sync state with URL params
  useEffect(() => {
    setSelectedCategory(initialCategory ? parseInt(initialCategory) : null);
    setSearchQuery(initialSearch);
  }, [initialCategory, initialSearch]);

  // Fetch categories
  useEffect(() => {
    async function fetchCats() {
      try {
        const cats = await api.products.getCategories();
        setCategories(cats);
      } catch (err) {
        console.error(err);
      }
    }
    fetchCats();
  }, []);

  // Fetch products
  useEffect(() => {
    async function fetchProds() {
      setLoading(true);
      try {
        let categoryId: number | undefined = selectedCategory || undefined;
        let search: string | undefined = searchQuery || undefined;

        // If the URL has specific filters, override category selections for ease
        if (initialFilter === "festival") {
          const res = await api.products.getFestivalSpecials();
          setProducts(res);
        } else if (initialFilter === "combos") {
          // Find the category id for festival-boxes / combos
          const cats = await api.products.getCategories();
          const comboCat = cats.find((c: any) => c.slug.includes("festival") || c.slug.includes("combos"));
          if (comboCat) {
            const res = await api.products.getAll(undefined, comboCat.id);
            setProducts(res);
          } else {
            const res = await api.products.getAll();
            setProducts(res);
          }
        } else {
          const res = await api.products.getAll(search, categoryId);
          setProducts(res);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchProds();
  }, [selectedCategory, searchQuery, initialFilter]);

  // Apply price range & sorting local filtering
  const filteredProducts = products
    .filter((prod) => {
      const priceAfterDiscount = prod.price * (1 - prod.discountPercentage / 100);
      return priceAfterDiscount <= priceRange;
    })
    .sort((a, b) => {
      const priceA = a.price * (1 - a.discountPercentage / 100);
      const priceB = b.price * (1 - b.discountPercentage / 100);

      if (sortBy === "priceAsc") return priceA - priceB;
      if (sortBy === "priceDesc") return priceB - priceA;
      if (sortBy === "discount") return b.discountPercentage - a.discountPercentage;
      return b.rating - a.rating; // Default 'popular'
    });

  const clearFilters = () => {
    setSelectedCategory(null);
    setSearchQuery("");
    setPriceRange(1500);
    setSortBy("popular");
    router.push("/shop");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Top Banner/Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-black text-gray-900">
          {initialFilter === "festival" ? "Festival Specials" : initialFilter === "combos" ? "Combo Boxes" : "All Products"}
        </h1>
        <p className="text-xs text-gray-400 font-semibold mt-1">
          {searchQuery ? `Search results for "${searchQuery}"` : "Browse premium ingredients, sweets, pickles, and combo packs"}
        </p>
      </div>

      {/* Sorting & Filter Controls Toggle */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-100 pb-4 mb-8">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowMobileFilters(!showMobileFilters)}
            className="md:hidden flex items-center gap-1.5 px-4 py-2 border border-gray-200 rounded-full text-xs font-bold text-gray-700 bg-white"
          >
            <SlidersHorizontal size={14} /> Filters
          </button>
          <span className="text-xs text-gray-400 font-semibold">{filteredProducts.length} Products Found</span>
        </div>

        {/* Sort drop down */}
        <div className="flex items-center gap-2">
          <ArrowUpDown size={14} className="text-gray-400" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-white border border-gray-200 text-xs font-bold text-gray-700 py-2 pl-3 pr-8 rounded-full focus:outline-none focus:ring-1 focus:ring-primary appearance-none cursor-pointer"
          >
            <option value="popular">Popularity (Rating)</option>
            <option value="priceAsc">Price: Low to High</option>
            <option value="priceDesc">Price: High to Low</option>
            <option value="discount">Best Discount</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Sidebar Filter Panel - Desktop */}
        <aside className={`md:block ${showMobileFilters ? "block" : "hidden"} space-y-8 bg-white md:bg-transparent p-6 md:p-0 rounded-3xl border border-gray-100 md:border-0 shadow-lg md:shadow-none fixed md:relative inset-x-4 top-24 z-30 md:z-0 md:inset-auto max-h-[80vh] md:max-h-none overflow-y-auto`}>
          
          {/* Header on mobile */}
          <div className="flex justify-between items-center md:hidden border-b border-gray-100 pb-3">
            <h3 className="font-bold text-gray-800">Filter By</h3>
            <button onClick={() => setShowMobileFilters(false)} className="text-xs text-primary font-bold">Done</button>
          </div>

          {/* Categories */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-gray-500">Categories</h4>
            <div className="space-y-1.5">
              <button
                onClick={() => setSelectedCategory(null)}
                className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold transition-colors flex justify-between items-center ${
                  selectedCategory === null ? "bg-orange-100 text-primary" : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <span>All Categories</span>
                {selectedCategory === null && <Check size={12} />}
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold transition-colors flex justify-between items-center ${
                    selectedCategory === cat.id ? "bg-orange-100 text-primary" : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <span>{cat.name}</span>
                  {selectedCategory === cat.id && <Check size={12} />}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range Slider */}
          <div className="space-y-3 pt-6 border-t border-gray-100">
            <div className="flex justify-between items-center">
              <h4 className="text-xs font-black uppercase tracking-wider text-gray-500">Max Price</h4>
              <span className="text-xs font-black text-primary">₹{priceRange}</span>
            </div>
            <input
              type="range"
              min="50"
              max="1500"
              step="50"
              value={priceRange}
              onChange={(e) => setPriceRange(parseInt(e.target.value))}
              className="w-full accent-primary h-1 bg-gray-200 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-gray-400 font-semibold">
              <span>₹50</span>
              <span>₹1500</span>
            </div>
          </div>

          {/* Clear Filters */}
          <button
            onClick={clearFilters}
            className="w-full py-2.5 rounded-full border border-gray-200 hover:border-red-100 text-xs font-bold text-gray-600 hover:text-red-500 hover:bg-red-50/20 transition-all text-center"
          >
            Clear Filters
          </button>
        </aside>

        {/* Product Grid Area */}
        <section className="md:col-span-3">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-gray-100 animate-pulse h-80 rounded-3xl" />
              ))}
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-16 bg-white border border-gray-50 rounded-[2.5rem] p-8 shadow-sm">
              <div className="text-3xl mb-4">🍽️</div>
              <h3 className="text-base font-bold text-gray-700 mb-1">No products match your filters</h3>
              <p className="text-xs text-gray-400 max-w-[280px] mx-auto mb-6">
                Try widening your price range slider or clearing the category selection.
              </p>
              <button
                onClick={clearFilters}
                className="bg-primary hover:bg-primary/95 text-white text-xs font-bold uppercase tracking-wider px-6 py-2.5 rounded-full transition-colors shadow"
              >
                Reset Shop
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </section>

      </div>
    </div>
  );
}

export default function Shop() {
  return (
    <Suspense fallback={<div className="text-center py-20 font-bold">Loading Shop...</div>}>
      <ShopContent />
    </Suspense>
  );
}
