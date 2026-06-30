"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/services/api";
import { getProductImage } from "@/components/ProductCard";
import ProductCard, { ProductType } from "@/components/ProductCard";
import { Star, Truck, Calendar, ShoppingCart, Plus, Minus, Send, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";

interface ReviewType {
  id: number;
  user: {
    name: string;
  };
  rating: number;
  comment: string;
  reviewDate: string;
}

export default function ProductDetail() {
  const params = useParams();
  const router = useRouter();
  const { addToCart } = useCart();
  const { user } = useAuth();
  
  const idStr = params.id as string;
  const productId = parseInt(idStr);

  const [product, setProduct] = useState<ProductType | null>(null);
  const [reviews, setReviews] = useState<ReviewType[]>([]);
  const [recommendations, setRecommendations] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState(true);

  // Detail inputs
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description"); // description, ingredients, nutrition
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState(false);

  useEffect(() => {
    if (isNaN(productId)) return;
    
    async function loadData() {
      setLoading(true);
      try {
        const [prod, revs, recs] = await Promise.all([
          api.products.getById(productId),
          api.products.getReviews(productId),
          api.products.getRecommendations(productId)
        ]);
        setProduct(prod);
        setReviews(revs);
        setRecommendations(recs);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [productId, submitSuccess]);

  if (loading) {
    return <div className="max-w-7xl mx-auto px-4 py-16 text-center font-bold">Loading product details...</div>;
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h2 className="text-xl font-bold text-gray-800 mb-2">Product Not Found</h2>
        <button onClick={() => router.push("/shop")} className="text-primary font-semibold hover:underline">
          Return to Shop
        </button>
      </div>
    );
  }

  const handleAddReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      router.push("/login");
      return;
    }
    try {
      await api.products.addReview(productId, reviewRating, reviewComment);
      setReviewComment("");
      setSubmitSuccess(!submitSuccess);
    } catch (err) {
      console.error(err);
    }
  };

  const priceAfterDiscount = product.price * (1 - product.discountPercentage / 100);
  const isOutOfStock = product.stockQuantity === 0;
  const imageUrl = getProductImage(product.name);

  // Thumbnail generation (subtle color shifts or rotations to simulate multiple images)
  const thumbnails = [imageUrl, imageUrl, imageUrl];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      
      {/* Product Information Panel */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 bg-white p-6 sm:p-10 border border-gray-100 rounded-[2.5rem] shadow-sm">
        
        {/* Gallery Drawer */}
        <div className="space-y-4">
          <div className="aspect-square bg-gray-50 border border-gray-100 rounded-3xl overflow-hidden shadow-inner">
            <img src={imageUrl} alt={product.name} className="w-full h-full object-cover" />
          </div>
          <div className="grid grid-cols-3 gap-4">
            {thumbnails.map((thumb, index) => (
              <div key={index} className="aspect-square bg-gray-50 border border-gray-100 rounded-2xl overflow-hidden cursor-pointer hover:border-primary transition-colors">
                <img src={thumb} alt="thumbnail" className="w-full h-full object-cover opacity-80 hover:opacity-100 transition-opacity" />
              </div>
            ))}
          </div>
        </div>

        {/* Action Form Panel */}
        <div className="flex flex-col space-y-6">
          <div>
            <span className="text-xs bg-orange-100 text-primary font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              {product.shelfLife} Shelf Life
            </span>
            <h1 className="text-3xl font-black text-gray-900 mt-3 mb-2">{product.name}</h1>
            <div className="flex items-center gap-4">
              <span className="text-xs text-gray-400 font-semibold">{product.weight}</span>
              <div className="flex items-center gap-1 bg-orange-50 px-2.5 py-0.5 rounded-full">
                <Star size={12} className="text-amber-500 fill-amber-500" />
                <span className="text-xs font-bold text-amber-700">{product.rating}</span>
                <span className="text-[10px] text-gray-400">({reviews.length} reviews)</span>
              </div>
            </div>
          </div>

          <div className="flex items-baseline gap-2 border-y border-gray-50 py-4">
            <span className="text-3xl font-extrabold text-primary">₹{Math.round(priceAfterDiscount)}</span>
            {product.discountPercentage > 0 && (
              <span className="text-sm text-gray-400 line-through">₹{product.price}</span>
            )}
          </div>

          {/* Delivery Slot Indicator */}
          <div className="bg-orange-50/50 border border-orange-100 rounded-2xl p-4 flex items-start gap-3">
            <Truck className="text-primary flex-shrink-0 mt-0.5" size={18} />
            <div>
              <h4 className="text-xs font-bold text-gray-800">Bengaluru Delivery Estimate</h4>
              <p className="text-[11px] text-gray-500 mt-0.5">Order in the next 2 hours for Next Day Delivery (24-48 Hours maximum).</p>
            </div>
          </div>

          {/* Adjuster & Action */}
          <div className="space-y-4">
            {!isOutOfStock && (
              <div className="flex items-center gap-4">
                <span className="text-xs text-gray-500 font-bold">Quantity</span>
                <div className="flex items-center bg-gray-50 border border-gray-200 rounded-full px-3 py-1.5">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-1.5 text-gray-400 hover:text-primary transition-colors"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="text-sm font-black text-gray-700 w-8 text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-1.5 text-gray-400 hover:text-primary transition-colors"
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>
            )}

            {isOutOfStock ? (
              <button disabled className="w-full bg-gray-100 text-gray-400 py-4 rounded-full border border-gray-100 cursor-not-allowed uppercase font-black tracking-widest text-xs">
                Out of Stock
              </button>
            ) : (
              <button
                onClick={() => addToCart(product, quantity)}
                className="w-full bg-primary hover:bg-primary/95 text-white py-4 rounded-full flex items-center justify-center gap-2 transition-all font-black uppercase tracking-widest text-xs shadow-md hover:shadow-lg"
              >
                <ShoppingCart size={16} /> Add to Basket
              </button>
            )}
          </div>
        </div>

      </div>

      {/* Accordion Specs Panel */}
      <div className="bg-white border border-gray-100 rounded-[2.5rem] overflow-hidden shadow-sm">
        <div className="flex border-b border-gray-100 bg-gray-50/50">
          {["description", "ingredients", "nutrition"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 text-center py-4 text-xs font-bold uppercase tracking-wider transition-colors border-b-2 ${
                activeTab === tab ? "border-primary text-primary bg-white" : "border-transparent text-gray-500"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        <div className="p-8 text-sm text-gray-600 leading-relaxed font-medium">
          {activeTab === "description" && (
            <p>{product.description}</p>
          )}
          {activeTab === "ingredients" && (
            <p>{(product as any).ingredients || "Refer to outer package. Sourced from authentic Odia traditional kitchens."}</p>
          )}
          {activeTab === "nutrition" && (
            <p>{(product as any).nutrition || "High protein, calcium rich traditional grains and cottage cheese values."}</p>
          )}
        </div>
      </div>

      {/* Related Products Showcase */}
      {recommendations.length > 0 && (
        <section>
          <h2 className="text-xl font-black text-gray-900 mb-6">AI-Powered Recommendations</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {recommendations.map((prod) => (
              <ProductCard key={prod.id} product={prod} />
            ))}
          </div>
        </section>
      )}

      {/* Customer Reviews List & Form */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Reviews List */}
        <div className="md:col-span-2 space-y-6">
          <h2 className="text-xl font-black text-gray-900">Customer Reviews ({reviews.length})</h2>
          <div className="space-y-4">
            {reviews.length === 0 ? (
              <div className="text-xs text-gray-400 py-4 font-semibold italic">No reviews yet for this product. Be the first to review!</div>
            ) : (
              reviews.map((rev) => (
                <div key={rev.id} className="bg-white p-5 border border-gray-50 rounded-3xl space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-gray-700">{rev.user.name}</span>
                    <span className="text-[10px] text-gray-400">{new Date(rev.reviewDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex gap-1 text-amber-500">
                    {[...Array(Math.round(rev.rating))].map((_, i) => (
                      <Star key={i} size={12} className="fill-amber-500" />
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 font-medium">{rev.comment}</p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Submit Review Form */}
        <div className="bg-white p-6 border border-gray-100 rounded-[2rem] shadow-sm self-start space-y-4">
          <h3 className="text-sm font-black uppercase tracking-wider text-gray-800">Add a Review</h3>
          {user ? (
            <form onSubmit={handleAddReview} className="space-y-4">
              <div>
                <label className="text-[10px] font-black uppercase tracking-wider text-gray-400 block mb-1">Your Rating</label>
                <div className="flex gap-1.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReviewRating(star)}
                      className="text-amber-500"
                    >
                      <Star size={20} className={star <= reviewRating ? "fill-amber-500" : ""} />
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-[10px] font-black uppercase tracking-wider text-gray-400 block mb-1">Your Comments</label>
                <textarea
                  required
                  rows={4}
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="Share your experience (taste, quality, freshness)..."
                  className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-3 text-xs focus:outline-none focus:ring-1 focus:ring-primary focus:bg-white text-gray-700"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-forest hover:bg-forest/95 text-white text-xs font-black uppercase tracking-widest py-3 rounded-full flex items-center justify-center gap-1.5 shadow transition-colors"
              >
                <Send size={12} /> Submit Review
              </button>
            </form>
          ) : (
            <div className="text-center p-4 border border-dashed border-gray-200 rounded-2xl">
              <p className="text-xs text-gray-400 mb-3">You must be logged in to leave a product review.</p>
              <button
                onClick={() => router.push("/login")}
                className="text-xs font-bold text-primary hover:underline"
              >
                Login Now
              </button>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}

export async function generateStaticParams() {
  return Array.from({ length: 20 }, (_, i) => ({
    id: (i + 1).toString(),
  }));
}
