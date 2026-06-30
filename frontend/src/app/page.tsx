"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { api } from "@/services/api";
import ProductCard, { ProductType } from "@/components/ProductCard";
import { Star, ShieldCheck, Heart, Truck, Award, ChevronRight, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

interface CategoryType {
  id: number;
  name: string;
  slug: string;
  description: string;
  imagePath: string;
}

export default function Home() {
  const router = useRouter();
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [bestsellers, setBestsellers] = useState<ProductType[]>([]);
  const [newarrivals, setNewarrivals] = useState<ProductType[]>([]);
  const [specials, setSpecials] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [cats, bests, news, fests] = await Promise.all([
          api.products.getCategories(),
          api.products.getBestSellers(),
          api.products.getNewArrivals(),
          api.products.getFestivalSpecials(),
        ]);
        setCategories(cats);
        setBestsellers(bests);
        setNewarrivals(news);
        setSpecials(fests);
      } catch (err) {
        console.error("Error fetching homepage data", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const features = [
    {
      icon: <Award className="w-6 h-6 text-primary" />,
      title: "Authentic Recipes",
      desc: "Prepared by master karigars from Kendrapara, Puri, and local villages.",
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-forest" />,
      title: "100% Pure & Fresh",
      desc: "Sourced directly, made with premium ingredients, no artificial preservatives.",
    },
    {
      icon: <Truck className="w-6 h-6 text-primary" />,
      title: "Bengaluru Delivery",
      desc: "Fresh batches delivered right to your home in temperature-controlled boxes.",
    },
  ];

  const testimonials = [
    {
      name: "Lipsa Mohapatra",
      role: "Software Engineer, HSR Layout",
      quote: "The Chhena Poda took me back to my home in Cuttack! It was baked to perfection with that beautiful burnt sugar crust. Bengaluru finally has authentic Odia sweets!",
      rating: 5,
    },
    {
      name: "Debasish Nayak",
      role: "Product Manager, Whitefield",
      quote: "Highly recommend the Kardi (Bamboo shoot) pickle and Keonjhar Phula Badi. They are exactly how my grandmother makes them. Delivery was prompt and packaging was premium.",
      rating: 5,
    },
    {
      name: "Priyanka Mishra",
      role: "Architect, Koramangala",
      quote: "Ordered the Raja Festival box. Poda Pitha was fresh and sweet, and the Puri Khaja was crispy and delicious. A lifesaver for festival celebrations away from home.",
      rating: 5,
    },
  ];

  return (
    <div className="space-y-16 pb-20">
      
      {/* Hero Banner Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-orange-50 to-orange-100/50 py-16 sm:py-24 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6 max-w-xl text-center lg:text-left"
          >
            <span className="inline-flex items-center gap-1.5 bg-orange-100 text-primary text-xs font-black tracking-widest uppercase px-4 py-1.5 rounded-full">
              Authentic Odia Taste Sourced Directly
            </span>
            <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-gray-900 leading-tight">
              Authentic Odisha.<br />
              <span className="text-primary">Delivered</span> to Your Home.
            </h1>
            <p className="text-base sm:text-lg text-gray-600 font-medium">
              Savor the sweetness of freshly baked Kendrapara Rasabali, Puri Khaja, and homemade pickles. Handcrafted in Odisha, delivered fresh to Bengaluru.
            </p>
            <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
              <Link
                href="/shop"
                className="bg-primary hover:bg-primary/95 text-white text-xs font-black uppercase tracking-widest px-8 py-4 rounded-full transition-all shadow-md hover:shadow-lg flex items-center gap-2"
              >
                Order Now <ArrowRight size={14} />
              </Link>
              <Link
                href="/shop?filter=festival"
                className="bg-white hover:bg-gray-50 text-gray-800 text-xs font-black uppercase tracking-widest px-8 py-4 rounded-full transition-all border border-gray-200 shadow-sm"
              >
                Festival Combos
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative flex justify-center items-center"
          >
            {/* Display a stunning plate of sweets */}
            <div className="relative w-full max-w-md aspect-square rounded-[2rem] overflow-hidden shadow-2xl border-4 border-white bg-white">
              <img
                src="/hero-odishabox.jpg"
                alt="Traditional Odia Sweets"
                className="w-full h-full object-cover"
              />
            </div>
            {/* Micro floating badget */}
            <div className="absolute -bottom-6 -left-6 bg-white border border-orange-100 rounded-3xl p-4 shadow-xl flex items-center gap-3">
              <div className="bg-orange-100 text-primary w-10 h-10 rounded-full flex items-center justify-center font-black">
                ★
              </div>
              <div>
                <div className="text-xs font-bold text-gray-800">4.9/5 Rating</div>
                <div className="text-[10px] text-gray-400">10,000+ happy customers</div>
              </div>
            </div>
          </motion.div>

        </div>
      </section>

      {/* Categories Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-2xl font-black text-gray-900">Explore by Category</h2>
            <p className="text-xs text-gray-400 font-semibold mt-1">Sourced from top regional hubs of Odisha</p>
          </div>
          <Link href="/shop" className="text-xs font-black uppercase tracking-wider text-forest hover:text-forest/90 flex items-center gap-1">
            See All Shop <ChevronRight size={14} />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="bg-gray-100 animate-pulse h-40 rounded-3xl" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
            {categories.map((cat) => {
              // Custom illustrations for categories
              let catImg = "https://images.unsplash.com/photo-1544025162-d76694265947?w=300&auto=format&fit=crop&q=80";
              if (cat.slug.includes("sweets") || cat.slug.includes("pitha")) {
                catImg = "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=300&auto=format&fit=crop&q=80";
              } else if (cat.slug.includes("grocery")) {
                catImg = "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=300&auto=format&fit=crop&q=80";
              } else if (cat.slug.includes("spices")) {
                catImg = "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=300&auto=format&fit=crop&q=80";
              } else if (cat.slug.includes("pickles")) {
                catImg = "https://images.unsplash.com/photo-1601050690597-df056fb4ce78?w=300&auto=format&fit=crop&q=80";
              } else if (cat.slug.includes("snacks")) {
                catImg = "https://images.unsplash.com/photo-1547058886-f33f9a5bef1a?w=300&auto=format&fit=crop&q=80";
              } else if (cat.slug.includes("combos") || cat.slug.includes("boxes")) {
                catImg = "/hero-odishabox.jpg";
              }
              return (
                <Link
                  key={cat.id}
                  href={`/shop?category=${cat.id}`}
                  className="group bg-white rounded-3xl p-5 border border-gray-100 hover:border-orange-100 hover:shadow-lg transition-all text-center"
                >
                  <div className="w-16 h-16 rounded-full overflow-hidden mx-auto mb-4 border border-gray-100 bg-gray-50 group-hover:scale-110 transition-transform">
                    <img src={catImg} alt={cat.name} className="w-full h-full object-cover" />
                  </div>
                  <h3 className="text-xs font-black tracking-wider uppercase text-gray-800 group-hover:text-primary transition-colors">
                    {cat.name}
                  </h3>
                </Link>
              );
            })}
          </div>
        )}
      </section>

      {/* Specials Showcase */}
      {specials.length > 0 && (
        <section className="bg-orange-50/50 py-12 border-y border-orange-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-8">
              <h2 className="text-2xl font-black text-gray-900">Festival Special Offers 🎉</h2>
              <p className="text-xs text-gray-400 font-semibold mt-1">Make your special occasions memorable with OdishaBox combos</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {specials.slice(0, 3).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Best Sellers Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h2 className="text-2xl font-black text-gray-900">Our Best Sellers 🔥</h2>
          <p className="text-xs text-gray-400 font-semibold mt-1">Highly rated delicacies that customers love</p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-gray-100 animate-pulse h-80 rounded-3xl" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {bestsellers.slice(0, 4).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* Why Choose OdishaBox */}
      <section className="bg-white py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border border-gray-100 rounded-[2.5rem] shadow-sm">
        <div className="text-center max-w-xl mx-auto mb-12">
          <h2 className="text-2xl font-black text-gray-900">Why Choose OdishaBox?</h2>
          <p className="text-xs text-gray-400 font-semibold mt-1">Bringing authentic Odia heritage to Bengaluru families</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          {features.map((feat, index) => (
            <div key={index} className="p-6 space-y-3">
              <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mx-auto shadow-inner">
                {feat.icon}
              </div>
              <h3 className="text-sm font-black tracking-wide uppercase text-gray-800">{feat.title}</h3>
              <p className="text-xs text-gray-500 font-medium">{feat.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* New Arrivals Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h2 className="text-2xl font-black text-gray-900">Fresh New Arrivals ✨</h2>
          <p className="text-xs text-gray-400 font-semibold mt-1">Newly stocked batches from local markets</p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-gray-100 animate-pulse h-80 rounded-3xl" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {newarrivals.slice(0, 4).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* Testimonials section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-12">
          <h2 className="text-2xl font-black text-gray-900">Delighted Customer Reviews</h2>
          <p className="text-xs text-gray-400 font-semibold mt-1">Hear what other Odias in Bengaluru are saying</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((test, index) => (
            <div key={index} className="bg-white p-6 border border-gray-50 shadow-sm rounded-3xl flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex gap-1">
                  {[...Array(test.rating)].map((_, i) => (
                    <Star key={i} size={14} className="text-amber-500 fill-amber-500" />
                  ))}
                </div>
                <p className="text-xs italic text-gray-500 font-medium leading-relaxed">
                  &ldquo;{test.quote}&rdquo;
                </p>
              </div>
              <div className="mt-6 border-t border-gray-50 pt-4">
                <h4 className="text-xs font-black text-gray-800">{test.name}</h4>
                <span className="text-[10px] text-gray-400 font-semibold">{test.role}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
