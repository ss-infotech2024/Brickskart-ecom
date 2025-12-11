import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Minus, Plus, ShoppingCart, Zap } from "lucide-react";
import Layout from "@/components/Layout";
import products from "@/data/products.json";
import { addToCart, getUser } from "@/utils/storage";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [notification, setNotification] = useState("");

  const product = products.find((p) => p.id === Number(id));
  const user = getUser();

  if (!product) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 py-16 text-center">
          <h1 className="text-3xl font-bold mb-4">Product Not Found</h1>
          <Link to="/shop" className="text-blue-600 hover:underline">
            Back to Shop
          </Link>
        </div>
      </Layout>
    );
  }

  const relatedProducts = products.filter(
    (p) => p.category === product.category && p.id !== product.id
  );

  const handleAddToCart = () => {
    if (!user) {
      navigate("/login");
      return;
    }

    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity,
      image: product.image,
    });

    setNotification("Added to cart!");
    setTimeout(() => setNotification(""), 3000);
  };

  const handleBuyNow = () => {
    if (!user) {
      navigate("/login");
      return;
    }

    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity,
      image: product.image,
    });

    navigate("/checkout");
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="flex gap-2 mb-8 text-sm text-gray-600">
          <Link to="/shop" className="hover:text-[#B22222]">
            Shop
          </Link>
          <span>/</span>
          <Link to={`/shop?category=${product.category}`} className="hover:text-[#B22222]">
            {product.category}
          </Link>
          <span>/</span>
          <span className="text-gray-900 font-semibold">{product.name}</span>
        </div>

        {/* Product Details */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <div>
            <img
              src={product.image}
              alt={product.name}
              className="w-full rounded-lg shadow-lg"
            />
          </div>

          <div>
            <p className="text-blue-600 font-semibold text-sm mb-2">{product.category}</p>
            <h1 className="text-4xl font-bold mb-4">{product.name}</h1>

            <div className="flex items-center gap-4 mb-6">
              <span className="text-3xl font-bold text-[#B22222]">₹{product.price}</span>
              <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                product.stock > 0
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}>
                {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
              </span>
            </div>

            <p className="text-gray-700 text-lg mb-8">{product.description}</p>

            <div className="bg-gray-50 p-4 rounded-lg mb-8 space-y-2">
              <p className="text-gray-700"><strong>Category:</strong> {product.category}</p>
              <p className="text-gray-700"><strong>Stock Available:</strong> {product.stock} units</p>
            </div>

            {notification && (
              <div className="mb-6 p-4 bg-green-100 text-green-800 rounded-lg font-semibold">
                {notification}
              </div>
            )}

            {product.stock > 0 ? (
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <span className="font-semibold">Quantity:</span>
                  <div className="flex items-center border border-gray-300 rounded-lg">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="p-2 hover:bg-gray-100"
                    >
                      <Minus size={18} />
                    </button>
                    <span className="px-4 py-2 font-semibold">{quantity}</span>
                    <button
                      onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                      className="p-2 hover:bg-gray-100"
                    >
                      <Plus size={18} />
                    </button>
                  </div>
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={handleAddToCart}
                    className="flex-1 px-6 py-3 bg-[#F7F3E9] border-2 border-[#B22222] text-[#B22222] font-bold rounded-lg hover:bg-[#B22222]/10 transition-colors flex items-center justify-center gap-2"
                  >
                    <ShoppingCart size={20} />
                    Add to Cart
                  </button>
                  <button
                    onClick={handleBuyNow}
                    className="flex-1 px-6 py-3 bg-[#B22222] text-white font-bold rounded-lg hover:bg-[#8B1A1A] transition-colors flex items-center justify-center gap-2"
                  >
                    <Zap size={20} />
                    Buy Now
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-4 bg-red-100 text-red-800 rounded-lg font-semibold text-center">
                Out of Stock
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div>
            <h2 className="text-3xl font-bold mb-8">Related Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relProduct) => (
                <Link
                  key={relProduct.id}
                  to={`/product/${relProduct.id}`}
                  className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden group border border-[#B22222]/10"
                >
                  <img
                    src={relProduct.image}
                    alt={relProduct.name}
                    className="w-full h-40 object-cover group-hover:scale-105 transition-transform"
                  />
                  <div className="p-4">
                    <p className="text-sm text-[#B22222] font-semibold mb-1">{relProduct.category}</p>
                    <h3 className="font-bold mb-2 line-clamp-2">{relProduct.name}</h3>
                    <p className="text-lg font-bold text-[#B22222]">₹{relProduct.price}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ProductDetails;
