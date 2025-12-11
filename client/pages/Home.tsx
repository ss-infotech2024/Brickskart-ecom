import { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, ShoppingBag, Star } from "lucide-react";
import Layout from "@/components/Layout";
import products from "@/data/products.json";
import { addToCart, getUser } from "@/utils/storage";

const CategoryIcon = ({ name, icon, href }: { name: string; icon: string; href: string }) => (
  <Link
    to={href}
    className="flex flex-col items-center gap-2 p-4 hover:scale-105 transition-transform"
  >
    <div className="w-16 h-16 bg-gradient-to-br from-pink-100 to-purple-100 rounded-full flex items-center justify-center text-3xl">
      {icon}
    </div>
    <span className="text-xs font-semibold text-center text-gray-700 line-clamp-2">{name}</span>
  </Link>
);

const BrandLogo = ({ name, color }: { name: string; color: string }) => (
  <div
    className={`px-6 py-8 rounded-lg font-bold text-white flex items-center justify-center h-20 text-sm text-center`}
    style={{ backgroundColor: color }}
  >
    {name}
  </div>
);

const Home = () => {
  const navigate = useNavigate();
  const user = getUser();
  const [currentBanner, setCurrentBanner] = useState(0);
  const [categoryScroll, setCategoryScroll] = useState(0);

  const handleAddToCart = (product: any) => {
    if (!user) {
      navigate("/login");
      return;
    }
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: product.image,
    });
  };

  const banners = [
    {
      title: "BricksKart Sale",
      subtitle: "25% OFF on Cement Orders",
      gradient: "from-[#B22222] to-[#D2691E]",
      icon: "🏗️",
    },
    {
      title: "Bulk Discounts",
      subtitle: "for Contractors",
      gradient: "from-[#F2A900] to-[#FF8C00]",
      icon: "📦",
    },
    {
      title: "Fast Delivery",
      subtitle: "for All Orders",
      gradient: "from-[#6E6E6E] to-[#808080]",
      icon: "🚚",
    },
    {
      title: "Premium Quality",
      subtitle: "Guaranteed",
      gradient: "from-[#B22222] to-[#F2A900]",
      icon: "⭐",
    },
  ];

  const categories = [
    { name: "Cement", icon: "🏢", href: "/shop?category=Cement" },
    { name: "Steel Rods", icon: "🔗", href: "/shop?category=Steel Rods" },
    { name: "Bricks", icon: "🧱", href: "/shop?category=Bricks" },
    { name: "Sand", icon: "🏖️", href: "/shop?category=Sand" },
    { name: "Tiles", icon: "🪟", href: "/shop?category=Tiles & Marble" },
    { name: "Pipes", icon: "🔧", href: "/shop?category=Pipes & Plumbing" },
    { name: "Paints", icon: "🎨", href: "/shop?category=Paints" },
    { name: "Tools", icon: "🛠️", href: "/shop?category=Construction Tools" },
    { name: "Safety", icon: "🦺", href: "/shop?category=Safety Gear" },
    { name: "Electrical", icon: "⚡", href: "/shop?category=Electrical Items" },
  ];

  const brands = [
    { name: "UltraTech", color: "#FF6B6B" },
    { name: "ACC", color: "#4ECDC4" },
    { name: "JK Cement", color: "#45B7D1" },
    { name: "Birla", color: "#FFA07A" },
    { name: "Tata Tiscon", color: "#98D8C8" },
    { name: "JSW", color: "#F7DC6F" },
    { name: "Supreme", color: "#BB8FCE" },
    { name: "Asian Paints", color: "#85C1E2" },
  ];

  const premiumProducts = products.filter(
    (p) => p.rating >= 4.6 && (p.category === "Cement" || p.category === "Steel Rods" || p.category === "Tiles & Marble")
  );

  const featuredProducts = products.slice(0, 8);

  const nextBanner = () => setCurrentBanner((prev) => (prev + 1) % banners.length);
  const prevBanner = () => setCurrentBanner((prev) => (prev - 1 + banners.length) % banners.length);

  return (
    <Layout>
      {/* Hero Carousel */}
      <div className="relative bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="relative h-64 sm:h-72 md:h-80 rounded-2xl overflow-hidden">
            {/* Banner */}
            <div
              className={`absolute inset-0 bg-gradient-to-r ${banners[currentBanner].gradient} flex items-center justify-between px-8 transition-all duration-300`}
            >
              <div>
                <div className="text-5xl sm:text-6xl mb-4">{banners[currentBanner].icon}</div>
                <h1 className="text-3xl sm:text-5xl font-bold text-white mb-2">
                  {banners[currentBanner].title}
                </h1>
                <p className="text-lg sm:text-xl text-white/90">{banners[currentBanner].subtitle}</p>
                <Link
                  to="/shop"
                  className="inline-block mt-4 px-6 py-2 bg-white text-gray-900 font-bold rounded-full hover:scale-105 transition-transform"
                >
                  Shop Now
                </Link>
              </div>
            </div>

            {/* Navigation Buttons */}
            <button
              onClick={prevBanner}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white p-2 rounded-full transition-all"
            >
              <ChevronLeft size={24} className="text-gray-900" />
            </button>
            <button
              onClick={nextBanner}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white p-2 rounded-full transition-all"
            >
              <ChevronRight size={24} className="text-gray-900" />
            </button>

            {/* Dots */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
              {banners.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentBanner(i)}
                  className={`h-2 rounded-full transition-all ${
                    i === currentBanner ? "bg-white w-8" : "bg-white/50 w-2"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Category Icons Slider */}
      <div className="bg-white py-8 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold mb-6">Shop by Category</h2>
          <div className="flex overflow-x-auto gap-4 pb-4 snap-x snap-mandatory">
            {categories.map((cat) => (
              <div key={cat.name} className="flex-shrink-0 snap-center">
                <CategoryIcon name={cat.name} icon={cat.icon} href={cat.href} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Premium Section */}
      <div className="bg-gradient-to-r from-[#B22222] to-[#8B4513] text-white py-12 my-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-4">✨ Premium Construction Materials</h2>
              <p className="text-xl text-gray-200 mb-6">
                Experience the finest quality products with superior durability and performance. Perfect for professional contractors and homeowners.
              </p>
              <Link
                to="/shop"
                className="inline-block px-8 py-3 bg-white text-purple-900 font-bold rounded-full hover:scale-105 transition-transform"
              >
                Shop Premium Collection
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {premiumProducts.slice(0, 4).map((prod) => (
                <div key={prod.id} className="bg-white/10 backdrop-blur rounded-lg p-4 text-center">
                  <p className="font-bold text-sm">{prod.name}</p>
                  <p className="text-pink-300 font-semibold">₹{prod.price}</p>
                  <div className="flex items-center justify-center gap-1 mt-2">
                    <Star size={14} className="fill-yellow-300 text-yellow-300" />
                    <span className="text-xs">{prod.rating}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Brand Logos */}
      <div className="bg-gray-50 py-12 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold mb-8">Original Brands</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 overflow-x-auto pb-4">
            {brands.map((brand) => (
              <BrandLogo key={brand.name} name={brand.name} color={brand.color} />
            ))}
          </div>
        </div>
      </div>

      {/* Promotional Banners */}
      <div className="bg-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-gradient-to-r from-[#F2A900] to-[#FF8C00] rounded-2xl p-8 text-gray-900">
              <h3 className="text-2xl font-bold mb-2">🎉 Up to 35% OFF</h3>
              <p className="text-sm mb-4">On first order through our app</p>
              <button className="px-6 py-2 bg-white text-[#F2A900] font-bold rounded-full hover:scale-105 transition-transform">
                Download Now
              </button>
            </div>

            <div className="bg-gradient-to-r from-[#B22222] to-[#8B4513] rounded-2xl p-8 text-white">
              <h3 className="text-2xl font-bold mb-2">🔥 Trending Now</h3>
              <p className="text-sm mb-4">Budget Buys | Top Rated | Daily Essentials</p>
              <button className="px-6 py-2 bg-white text-[#B22222] font-bold rounded-full hover:scale-105 transition-transform">
                Shop Trending
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Products Grid */}
      <div className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold mb-8">Featured Products</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {featuredProducts.map((product) => (
              <Link
                key={product.id}
                to={`/product/${product.id}`}
                className="group bg-white rounded-xl shadow-sm hover:shadow-lg transition-shadow overflow-hidden"
              >
                <div className="relative overflow-hidden bg-gray-100 h-40 sm:h-48">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                  />
                  <div className="absolute top-2 right-2 bg-[#B22222] text-white text-xs font-bold px-2 py-1 rounded-full">
                    Sale
                  </div>
                </div>
                <div className="p-3">
                  <p className="text-xs text-[#B22222] font-semibold mb-1">{product.category}</p>
                  <h3 className="font-bold text-sm line-clamp-2 mb-2">{product.name}</h3>
                  <div className="flex items-center gap-1 mb-2">
                    <Star size={14} className="fill-[#F2A900] text-[#F2A900]" />
                    <span className="text-xs text-gray-600">{product.rating}</span>
                  </div>
                  <p className="text-[#B22222] font-bold text-lg mb-2">₹{product.price}</p>
                  <button onClick={() => handleAddToCart(product)} className="w-full bg-[#B22222] text-white py-1 rounded-lg text-xs font-bold hover:bg-[#8B1A1A] transition-colors">
                    Add to Cart
                  </button>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Home;
