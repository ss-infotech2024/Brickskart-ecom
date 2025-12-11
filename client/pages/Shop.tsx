import { useState, useMemo } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { Search, Star, Filter, X } from "lucide-react";
import Layout from "@/components/Layout";
import products from "@/data/products.json";
import { addToCart, getUser } from "@/utils/storage";

const Shop = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const user = getUser();
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    searchParams.get("category") ? [searchParams.get("category")!] : []
  );
  const [sortBy, setSortBy] = useState<string>("featured");
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const handleAddToCart = (e: React.MouseEvent, product: any) => {
    e.preventDefault();
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

  const categories = Array.from(new Set(products.map((p) => p.category)));

  const filteredProducts = useMemo(() => {
    let filtered = products.filter((product) => {
      const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(product.category);
      const matchesSearch =
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });

    if (sortBy === "price-low") {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-high") {
      filtered.sort((a, b) => b.price - a.price);
    } else if (sortBy === "rating") {
      filtered.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === "name") {
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    }

    return filtered;
  }, [selectedCategories, sortBy, searchQuery]);

  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]
    );
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-6 text-gray-900">Shop All Products</h1>

          {/* Search Bar */}
          <div className="relative mb-6">
            <div className="flex items-center bg-white rounded-full border-2 border-gray-100 px-4 py-2 focus-within:border-[#B22222] transition-colors">
              <Search size={20} className="text-gray-400" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="ml-2 flex-1 outline-none text-gray-900"
              />
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Sidebar - Desktop */}
          <div className="hidden lg:block">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <Filter size={18} />
                Filters
              </h3>

              {/* Categories */}
              <div className="mb-6">
                <h4 className="font-bold text-gray-900 mb-3 text-sm">Categories</h4>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <label
                      key={category}
                      className="flex items-center gap-2 cursor-pointer hover:text-pink-600 transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(category)}
                        onChange={() => toggleCategory(category)}
                        className="w-4 h-4 text-[#B22222] rounded cursor-pointer"
                      />
                      <span className="text-sm text-gray-700">{category}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Sort */}
              <div className="border-t pt-4">
                <h4 className="font-bold text-gray-900 mb-3 text-sm">Sort By</h4>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B22222] text-sm"
                >
                  <option value="featured">Featured</option>
                  <option value="name">Name A-Z</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Rating: High to Low</option>
                </select>
              </div>
            </div>
          </div>

          {/* Mobile Filter Button */}
          <div className="lg:hidden mb-6">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="w-full flex items-center justify-center gap-2 bg-white border-2 border-gray-200 px-4 py-3 rounded-lg font-semibold text-gray-900 hover:border-[#B22222] transition-colors"
            >
              <Filter size={18} />
              Filters
            </button>
          </div>

          {/* Mobile Filters */}
          {showFilters && (
            <div className="lg:hidden bg-white rounded-xl shadow-sm p-6 mb-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-lg">Filters</h3>
                <button onClick={() => setShowFilters(false)}>
                  <X size={20} />
                </button>
              </div>

              <div className="mb-6">
                <h4 className="font-bold text-gray-900 mb-3">Categories</h4>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <label key={category} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(category)}
                        onChange={() => toggleCategory(category)}
                        className="w-4 h-4"
                      />
                      <span className="text-sm">{category}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-bold text-gray-900 mb-3">Sort By</h4>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg text-sm"
                >
                  <option value="featured">Featured</option>
                  <option value="name">Name A-Z</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Rating: High to Low</option>
                </select>
              </div>
            </div>
          )}

          {/* Products Grid */}
          <div className="lg:col-span-3">
            {filteredProducts.length > 0 ? (
              <>
                <p className="text-gray-600 mb-6 font-semibold">
                  Showing {filteredProducts.length} products
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredProducts.map((product) => (
                    <Link
                      key={product.id}
                      to={`/product/${product.id}`}
                      className="group bg-white rounded-xl shadow-sm hover:shadow-lg transition-all overflow-hidden border border-gray-100 hover:border-pink-200"
                    >
                      {/* Product Image */}
                      <div className="relative overflow-hidden bg-gray-100 h-40 sm:h-48">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                        <div className="absolute top-2 right-2 bg-[#B22222] text-white text-xs font-bold px-2.5 py-1 rounded-full">
                          {Math.floor(Math.random() * 30 + 10)}% OFF
                        </div>
                        {product.stock < 20 && (
                          <div className="absolute bottom-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                            Low Stock
                          </div>
                        )}
                      </div>

                      {/* Product Info */}
                      <div className="p-4">
                        <p className="text-xs text-[#B22222] font-bold uppercase mb-1">
                          {product.category}
                        </p>
                        <h3 className="font-bold text-sm line-clamp-2 mb-2 group-hover:text-pink-600 transition-colors">
                          {product.name}
                        </h3>

                        {/* Rating */}
                        <div className="flex items-center gap-1 mb-2">
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                size={12}
                                className={`${
                                  i < Math.floor(product.rating)
                                    ? "fill-yellow-400 text-yellow-400"
                                    : "text-gray-300"
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-xs text-gray-600">
                            ({Math.floor(Math.random() * 1000 + 100)})
                          </span>
                        </div>

                        {/* Price */}
                        <div className="mb-3">
                          <p className="text-[#B22222] font-bold text-lg">₹{product.price}</p>
                          <p className="text-xs text-gray-500 line-through">
                            ₹{Math.floor(product.price * 1.3)}
                          </p>
                        </div>

                        {/* Delivery Info */}
                        <p className="text-xs text-green-600 font-semibold mb-3">
                          ✓ Fast Delivery Available
                        </p>

                        {/* Add to Cart Button */}
                        <button
                          onClick={(e) => handleAddToCart(e, product)}
                          className="w-full bg-[#B22222] text-white py-2 rounded-lg text-xs font-bold hover:bg-[#8B1A1A] transition-colors active:scale-95"
                        >
                          Add to Cart
                        </button>
                      </div>
                    </Link>
                  ))}
                </div>
              </>
            ) : (
              <div className="bg-white rounded-xl p-12 text-center col-span-full">
                <h3 className="text-xl font-bold mb-2">No products found</h3>
                <p className="text-gray-600 mb-6">Try adjusting your filters or search query</p>
                <button
                  onClick={() => {
                    setSelectedCategories([]);
                    setSearchQuery("");
                  }}
                  className="px-6 py-2 bg-[#B22222] text-white rounded-lg hover:bg-[#8B1A1A] transition-colors font-bold"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Shop;
