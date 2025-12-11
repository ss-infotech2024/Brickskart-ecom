import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import Layout from "@/components/Layout";
import { getOrders, getUser } from "@/utils/storage";
import type { Order } from "@/utils/storage";

const MyOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const navigate = useNavigate();
  const user = getUser();

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    setOrders(getOrders());
  }, [user, navigate]);

  if (!user) {
    return null;
  }

  if (orders.length === 0) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h1 className="text-3xl font-bold mb-4">No Orders Yet</h1>
          <p className="text-gray-600 mb-8">You haven't placed any orders. Start shopping now!</p>
          <Link
            to="/shop"
            className="inline-block px-6 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors"
          >
            Start Shopping
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-4xl font-bold mb-8">My Orders</h1>

        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              {/* Order Header */}
              <button
                onClick={() =>
                  setExpandedOrderId(
                    expandedOrderId === order.id ? null : order.id
                  )
                }
                className="w-full p-6 flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <div className="text-left flex-1">
                  <p className="text-sm text-gray-600">Order ID</p>
                  <p className="font-bold text-lg">{order.id}</p>

                  <div className="flex gap-8 mt-2 text-sm">
                    <div>
                      <p className="text-gray-600">Date</p>
                      <p className="font-semibold">
                        {new Date(order.date).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600">Total</p>
                      <p className="font-semibold text-blue-600">₹{order.total}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Payment</p>
                      <p className="font-semibold">
                        {order.paymentMethod === "cod"
                          ? "Cash on Delivery"
                          : "Online Payment"}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600">Status</p>
                      <p
                        className={`font-semibold capitalize ${
                          order.status === "delivered"
                            ? "text-green-600"
                            : "text-yellow-600"
                        }`}
                      >
                        {order.status}
                      </p>
                    </div>
                  </div>
                </div>

                <ChevronDown
                  size={24}
                  className={`text-gray-600 transition-transform ${
                    expandedOrderId === order.id ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Order Details */}
              {expandedOrderId === order.id && (
                <div className="border-t border-gray-200 p-6 bg-gray-50">
                  <h3 className="font-bold text-lg mb-4">Order Items</h3>

                  <div className="space-y-4 mb-6">
                    {order.items.map((item) => (
                      <div
                        key={item.id}
                        className="flex gap-4 bg-white p-4 rounded-lg"
                      >
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded"
                        />
                        <div className="flex-1">
                          <Link
                            to={`/product/${item.id}`}
                            className="font-bold hover:text-blue-600"
                          >
                            {item.name}
                          </Link>
                          <p className="text-gray-600 text-sm">
                            Qty: {item.quantity}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold">₹{item.price}</p>
                          <p className="text-gray-600 text-sm">
                            ₹{item.price * item.quantity} total
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <h3 className="font-bold mb-3">Order Summary</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Subtotal</span>
                        <span>₹{Math.round(order.total * (100 / 118))}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Tax (18%)</span>
                        <span>
                          ₹{Math.round(order.total * (18 / 118))}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Shipping</span>
                        <span>Free</span>
                      </div>
                      <div className="flex justify-between border-t border-gray-200 pt-2 mt-2 font-bold text-lg">
                        <span>Total</span>
                        <span className="text-blue-600">₹{order.total}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 flex gap-4">
                    <button className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-semibold">
                      Download Invoice
                    </button>
                    <Link
                      to="/shop"
                      className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold text-center"
                    >
                      Shop More
                    </Link>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default MyOrders;
