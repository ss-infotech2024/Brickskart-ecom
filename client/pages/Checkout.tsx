import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { CreditCard, Truck, CheckCircle } from "lucide-react";
import Layout from "@/components/Layout";
import { getCart, getUser, saveOrder, generateOrderId, clearCart } from "@/utils/storage";

const Checkout = () => {
  const navigate = useNavigate();
  const cartItems = getCart();
  const user = getUser();
  const [paymentMethod, setPaymentMethod] = useState<"online" | "cod">("cod");
  const [isProcessing, setIsProcessing] = useState(false);
  const [step, setStep] = useState<"address" | "payment" | "confirm">("address");
  const [address, setAddress] = useState({
    fullName: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    street: "",
    city: "",
    state: "",
    pincode: "",
  });

  const total = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cartItems]
  );

  const tax = Math.round(total * 0.18);
  const finalTotal = total + tax;

  if (!user) {
    return (
      <Layout>
        <div className="max-w-3xl mx-auto px-4 py-16 text-center">
          <h1 className="text-3xl font-bold mb-4">Please Log In</h1>
          <p className="text-gray-600 mb-8">You need to be logged in to checkout</p>
        </div>
      </Layout>
    );
  }

  if (cartItems.length === 0) {
    return (
      <Layout>
        <div className="max-w-3xl mx-auto px-4 py-16 text-center">
          <h1 className="text-3xl font-bold mb-4">Your Cart is Empty</h1>
          <button
            onClick={() => navigate("/shop")}
            className="px-6 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Shop
          </button>
        </div>
      </Layout>
    );
  }

  const handleAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep("payment");
  };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    // Simulate payment processing
    setTimeout(() => {
      const order = {
        id: generateOrderId(),
        items: cartItems,
        total: finalTotal,
        date: new Date().toISOString(),
        paymentMethod,
        status: "pending" as const,
        userEmail: user.email,
      };

      saveOrder(order);
      clearCart();

      setStep("confirm");
      setIsProcessing(false);
    }, 2000);
  };

  if (step === "confirm") {
    return (
      <Layout>
        <div className="max-w-3xl mx-auto px-4 py-16">
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <CheckCircle className="w-20 h-20 text-green-600 mx-auto mb-4" />
            <h1 className="text-3xl font-bold mb-4 text-green-600">Order Confirmed!</h1>
            <p className="text-gray-600 mb-6 text-lg">
              Thank you for your order. You'll receive a confirmation email shortly.
            </p>

            <div className="bg-gray-50 p-6 rounded-lg text-left mb-8">
              <p className="text-gray-700 mb-2">
                <strong>Order ID:</strong> {cartItems[0]?.id || ""}
              </p>
              <p className="text-gray-700 mb-2">
                <strong>Total Amount:</strong> ₹{finalTotal}
              </p>
              <p className="text-gray-700">
                <strong>Payment Method:</strong>{" "}
                {paymentMethod === "online" ? "Online Payment" : "Cash on Delivery"}
              </p>
            </div>

            <button
              onClick={() => navigate("/my-orders")}
              className="px-6 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors mr-4"
            >
              View My Orders
            </button>

            <button
              onClick={() => navigate("/shop")}
              className="px-6 py-3 bg-gray-200 text-gray-800 font-bold rounded-lg hover:bg-gray-300 transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-4xl font-bold mb-8">Checkout</h1>

        {/* Steps */}
        <div className="flex gap-4 mb-12">
          <div className={`flex-1 p-4 rounded-lg ${step === "address" ? "bg-blue-100 border-2 border-blue-600" : "bg-gray-100"}`}>
            <p className="font-bold text-center">1. Delivery Address</p>
          </div>
          <div className={`flex-1 p-4 rounded-lg ${step === "payment" ? "bg-blue-100 border-2 border-blue-600" : "bg-gray-100"}`}>
            <p className="font-bold text-center">2. Payment</p>
          </div>
          <div className={`flex-1 p-4 rounded-lg ${step === "confirm" ? "bg-blue-100 border-2 border-blue-600" : "bg-gray-100"}`}>
            <p className="font-bold text-center">3. Confirmation</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2">
            {step === "address" && (
              <form onSubmit={handleAddressSubmit} className="bg-white rounded-lg shadow-md p-8">
                <h2 className="text-2xl font-bold mb-6">Delivery Address</h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Full Name</label>
                    <input
                      type="text"
                      value={address.fullName}
                      onChange={(e) => setAddress({ ...address, fullName: e.target.value })}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-700 font-semibold mb-2">Email</label>
                      <input
                        type="email"
                        value={address.email}
                        onChange={(e) => setAddress({ ...address, email: e.target.value })}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 font-semibold mb-2">Phone</label>
                      <input
                        type="tel"
                        value={address.phone}
                        onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Street Address</label>
                    <input
                      type="text"
                      value={address.street}
                      onChange={(e) => setAddress({ ...address, street: e.target.value })}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-gray-700 font-semibold mb-2">City</label>
                      <input
                        type="text"
                        value={address.city}
                        onChange={(e) => setAddress({ ...address, city: e.target.value })}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 font-semibold mb-2">State</label>
                      <input
                        type="text"
                        value={address.state}
                        onChange={(e) => setAddress({ ...address, state: e.target.value })}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 font-semibold mb-2">Pincode</label>
                      <input
                        type="text"
                        value={address.pincode}
                        onChange={(e) => setAddress({ ...address, pincode: e.target.value })}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full mt-8 px-6 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Continue to Payment
                </button>
              </form>
            )}

            {step === "payment" && (
              <form onSubmit={handlePaymentSubmit} className="bg-white rounded-lg shadow-md p-8">
                <h2 className="text-2xl font-bold mb-6">Payment Method</h2>

                <div className="space-y-4 mb-8">
                  <label className="flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all" style={{borderColor: paymentMethod === "cod" ? "#2563eb" : "#d1d5db", backgroundColor: paymentMethod === "cod" ? "#eff6ff" : "white"}}>
                    <input
                      type="radio"
                      value="cod"
                      checked={paymentMethod === "cod"}
                      onChange={(e) => setPaymentMethod(e.target.value as "cod")}
                      className="w-5 h-5"
                    />
                    <div className="ml-4">
                      <Truck className="w-5 h-5 text-blue-600 mb-1" />
                      <p className="font-bold">Cash on Delivery (COD)</p>
                      <p className="text-sm text-gray-600">Pay when you receive your order</p>
                    </div>
                  </label>

                  <label className="flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all" style={{borderColor: paymentMethod === "online" ? "#2563eb" : "#d1d5db", backgroundColor: paymentMethod === "online" ? "#eff6ff" : "white"}}>
                    <input
                      type="radio"
                      value="online"
                      checked={paymentMethod === "online"}
                      onChange={(e) => setPaymentMethod(e.target.value as "online")}
                      className="w-5 h-5"
                    />
                    <div className="ml-4">
                      <CreditCard className="w-5 h-5 text-blue-600 mb-1" />
                      <p className="font-bold">Online Payment</p>
                      <p className="text-sm text-gray-600">Pay now with card or UPI</p>
                    </div>
                  </label>
                </div>

                {paymentMethod === "online" && (
                  <div className="bg-yellow-50 p-4 rounded-lg mb-8 border border-yellow-200">
                    <p className="text-sm text-yellow-800">
                      <strong>Demo Note:</strong> This is a fake payment. In production, you would integrate with Stripe or similar payment gateway.
                    </p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isProcessing}
                  className={`w-full px-6 py-3 font-bold rounded-lg transition-colors ${
                    isProcessing
                      ? "bg-gray-400 text-white cursor-not-allowed"
                      : "bg-blue-600 text-white hover:bg-blue-700"
                  }`}
                >
                  {isProcessing ? "Processing..." : "Place Order"}
                </button>

                <button
                  type="button"
                  onClick={() => setStep("address")}
                  className="w-full mt-4 px-6 py-3 border-2 border-gray-300 text-gray-700 font-bold rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Back to Address
                </button>
              </form>
            )}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
              <h2 className="text-2xl font-bold mb-6">Order Summary</h2>

              <div className="space-y-4 mb-6 pb-6 border-b border-gray-200">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex justify-between">
                    <span className="text-gray-700">
                      {item.name} x {item.quantity}
                    </span>
                    <span className="font-semibold">₹{item.price * item.quantity}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-3 pb-6 border-b border-gray-200">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-semibold">₹{total}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax (18%)</span>
                  <span className="font-semibold">₹{tax}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-semibold">Free</span>
                </div>
              </div>

              <div className="flex justify-between mt-6 text-xl font-bold">
                <span>Total</span>
                <span className="text-blue-600">₹{finalTotal}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Checkout;
