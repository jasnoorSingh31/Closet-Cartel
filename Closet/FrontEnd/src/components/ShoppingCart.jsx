import React from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { API_BASE_URL } from "../utils/constants";
import { useProducts } from "../context/ProductContext";
import { useAuth } from "../context/AuthContext";

const ShoppingCart = () => {
  const navigate = useNavigate();
  const { cart, updateQty, removeFromCart, clearCart } = useCart();
  const { refreshProducts } = useProducts();
  const { token } = useAuth();
  const [showAddressModal, setShowAddressModal] = React.useState(false);
  const [isPlacingOrder, setIsPlacingOrder] = React.useState(false);
  const [orderError, setOrderError] = React.useState(null);

  // Address state
  const [address, setAddress] = React.useState({
    fullName: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "India"
  });
  const [savedAddress, setSavedAddress] = React.useState(null);

  const paymentMethod = "Cash On Delivery";

  const getItemPrice = (item) => Number(item.offerPrice ?? item.price ?? 0);

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce(
    (sum, item) => sum + getItemPrice(item) * item.quantity,
    0
  );
  const tax = subtotal * 0.02;
  const shippingFee = subtotal > 0 ? 0 : 0;
  const totalAmount = subtotal + tax + shippingFee;

  const handleQuantityChange = (id, quantity) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }
    updateQty(id, quantity);
  };

  const handleRemove = (id) => {
    removeFromCart(id);
  };

  const handleAddressSubmit = (e) => {
    e.preventDefault();
    setSavedAddress(address);
    setShowAddressModal(false);
  };

  const handlePlaceOrder = async () => {
    if (!cart.length || isPlacingOrder) return;
    
    if (!savedAddress) {
      setOrderError("Please add a delivery address");
      setShowAddressModal(true);
      return;
    }

    setIsPlacingOrder(true);
    setOrderError(null);

    const payload = {
      items: cart.map((item) => ({
        productId: item.productId || item.id,
        name: item.name,
        quantity: item.quantity,
        selectedSize: item.selectedSize || item.size || "M",
        price: getItemPrice(item),
      })),
      totals: {
        subtotal: Number(subtotal.toFixed(2)),
        tax: Number(tax.toFixed(2)),
        shippingFee: Number(shippingFee.toFixed(2)),
        total: Number(totalAmount.toFixed(2)),
      },
      paymentMethod,
      shippingAddress: savedAddress,
    };

    try {
      const response = await fetch(`${API_BASE_URL}/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (!data.success) {
        throw new Error(data.message || "Unable to place order");
      }

      if (typeof refreshProducts === "function") {
        await refreshProducts();
      }
      clearCart();
      navigate("/order-confirmation", {
        state: {
          order: data.order,
          breakdown: payload.totals,
        },
      });
    } catch (error) {
      setOrderError(error.message || "Unable to place order");
    } finally {
      setIsPlacingOrder(false);
    }
  };

  return (
    <div className="bg-CartBg w-full min-h-screen pt-[100px]">
      <div className="flex flex-col md:flex-row py-16 max-w-6xl w-full px-6 mx-auto gap-20">
        {/* Cart Products */}
        <div className="flex-1 max-w-xl max-md:mx-auto">
          <h1 className="text-white text-3xl font-medium mb-6">
            Shopping Cart{" "}
            <span className="text-sm text-icon">{totalItems} items</span>
          </h1>

          {cart.length === 0 ? (
            <div className="border border-gray-500/20 bg-white p-6 rounded-lg text-center text-gray-600">
              <p>Your cart is empty.</p>
              <button
                onClick={() => navigate("/product")}
                className="mt-4 inline-flex items-center justify-center gap-2 bg-black text-white px-6 py-2 rounded-full cursor-pointer hover:bg-gray-900 transition-colors"
              >
                Browse products
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {cart.map((product) => (
                <div
                  key={product.id}
                  className="border border-gray-500/20 bg-white p-4 rounded-lg"
                >
                  <div className="gap-4">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="group cursor-pointer flex items-center justify-center">
                        <img
                          className="group-hover:scale-105 transition object-contain w-24 h-24 md:w-32 md:h-32"
                          src={product.image}
                          alt={product.name}
                        />
                      </div>

                      <div className="flex-1">
                        <div className="text-gray-500/60 text-sm">
                          <p>{product.category || "Apparel"}</p>
                          <p className="text-gray-700 font-medium text-lg">
                            {product.name}
                          </p>
                          {product.description && (
                            <ul className="list-disc list-inside text-gray-500 text-xs mt-1 space-y-0.5">
                              {product.description.slice(0, 3).map((line) => (
                                <li key={line}>{line}</li>
                              ))}
                            </ul>
                          )}
                          <p className="mt-2 text-xs text-gray-500">
                            Size:{" "}
                            <span className="font-medium text-gray-700">
                              {product.selectedSize || product.size || "N/A"}
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-8">
                      <div className="text-center md:text-left">
                        <p className="text-xl font-medium text-green-600">
                          ${getItemPrice(product).toFixed(2)}{" "}
                          {product.price && (
                            <span className="text-black text-sm line-through">
                              ${Number(product.price).toFixed(2)}
                            </span>
                          )}
                        </p>
                        <p className="text-sm text-gray-500">
                          Subtotal: $
                          {(getItemPrice(product) * product.quantity).toFixed(2)}
                        </p>
                      </div>

                      <div className="flex items-center justify-center">
                        <div className="flex flex-col items-center justify-center text-indigo-500">
                          <div className="flex items-center justify-center gap-2 w-20 h-9 bg-indigo-500/25 rounded select-none">
                            <button
                              onClick={() =>
                                handleQuantityChange(product.id, product.quantity - 1)
                              }
                              className="cursor-pointer text-md px-2 h-full hover:bg-indigo-500/10 rounded disabled:opacity-40"
                              disabled={product.quantity <= 1}
                            >
                              -
                            </button>
                            <span className="w-5 text-center text-black font-medium">
                              {product.quantity}
                            </span>
                            <button
                              onClick={() =>
                                handleQuantityChange(product.id, product.quantity + 1)
                              }
                              className="cursor-pointer text-md px-2 h-full hover:bg-indigo-500/10 rounded disabled:opacity-40"
                              disabled={
                                product.stock !== undefined &&
                                product.stock !== null &&
                                product.quantity >= product.stock
                              }
                            >
                              +
                            </button>
                          </div>
                          {product.stock !== undefined &&
                            product.stock !== null &&
                            product.quantity >= product.stock && (
                              <p className="text-[10px] text-gray-500 mt-1">
                                Reached stock limit ({product.stock})
                              </p>
                            )}
                        </div>
                      </div>

                      <button
                        onClick={() => handleRemove(product.id)}
                        className="cursor-pointer p-2 hover:bg-red-50 rounded"
                      >
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 20 20"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="m12.5 7.5-5 5m0-5 5 5m5.833-2.5a8.333 8.333 0 1 1-16.667 0 8.333 8.333 0 0 1 16.667 0"
                            stroke="#FF532E"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <button
            onClick={() => navigate("/")}
            className="group cursor-pointer flex items-center mt-8 gap-2 text-white font-bold"
          >
            <svg
              width="15"
              height="11"
              viewBox="0 0 15 11"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M14.09 5.5H1M6.143 10 1 5.5 6.143 1"
                stroke="#97DFF0"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="relative">
              Continue Shopping
              <div className="absolute bottom-0 left-0 bg-white h-0.5 w-0 group-hover:w-full transition-all duration-300" />
            </span>
          </button>
        </div>

        {/* Order Summary */}
        <div className="max-w-[360px] w-full h-fit mt-16 bg-gray-100/40 p-5 max-md:mt-16 max-md:mx-auto border border-gray-300/70">
          <h2 className="text-xl md:text-xl font-medium">Order Summary</h2>
          <hr className="border-gray-300 my-5" />

          {/* Address */}
          <div className="mb-6">
            <p className="text-sm font-medium uppercase">Delivery Address</p>
            <div className="mt-2">
              {savedAddress ? (
                <div className="bg-white border border-gray-300 p-3 rounded text-sm">
                  <p className="font-medium text-gray-800">{savedAddress.fullName}</p>
                  <p className="text-gray-600">{savedAddress.phone}</p>
                  <p className="text-gray-600 mt-1">{savedAddress.street}</p>
                  <p className="text-gray-600">
                    {savedAddress.city}, {savedAddress.state} {savedAddress.zipCode}
                  </p>
                  <p className="text-gray-600">{savedAddress.country}</p>
                  <button
                    onClick={() => setShowAddressModal(true)}
                    className="text-icon hover:underline cursor-pointer mt-2 text-xs"
                  >
                    Change address
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowAddressModal(true)}
                  className="w-full bg-white border border-gray-300 px-3 py-3 text-gray-500 hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  + Add delivery address
                </button>
              )}
            </div>

            {/* Payment */}
            <p className="text-sm font-medium uppercase mt-6">Payment Method</p>
            <div className="w-full border border-gray-300 bg-white px-3 py-2 mt-2 text-gray-700">
              {paymentMethod}
            </div>
          </div>

          <hr className="border-gray-300" />

          {/* Dynamic totals */}
          <div className="text-white mt-4 space-y-2">
            <p className="flex justify-between">
              <span>Price</span>
              <span>${subtotal.toFixed(2)}</span>
            </p>
            <p className="flex justify-between">
              <span>Shipping Fee</span>
              <span className="text-green-600">
                {shippingFee === 0 ? "Free" : `$${shippingFee}`}
              </span>
            </p>
            <p className="flex justify-between">
              <span>Tax (2%)</span>
              <span>${tax.toFixed(2)}</span>
            </p>
            <p className="flex justify-between text-lg font-medium mt-3">
              <span>Total Amount:</span>
              <span>${totalAmount.toFixed(2)}</span>
            </p>
          </div>

          {orderError && (
            <p className="text-sm text-red-400 mt-4">{orderError}</p>
          )}

          <button
            className="w-full py-3 mt-6 cursor-pointer bg-black text-white font-medium disabled:opacity-40 hover:bg-gray-900 transition-colors"
            disabled={cart.length === 0 || isPlacingOrder}
            onClick={handlePlaceOrder}
          >
            {isPlacingOrder ? "Placing order..." : "Place Order"}
          </button>
        </div>
      </div>

      {/* Address Modal */}
      {showAddressModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full p-8 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-medium">
                {savedAddress ? "Edit Address" : "Add Delivery Address"}
              </h3>
              <button
                onClick={() => setShowAddressModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleAddressSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={address.fullName}
                  onChange={(e) => setAddress({ ...address, fullName: e.target.value })}
                  className="w-full border border-gray-300 rounded px-4 py-3 text-base outline-indigo-500"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  required
                  value={address.phone}
                  onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                  className="w-full border border-gray-300 rounded px-4 py-3 text-base outline-indigo-500"
                  placeholder="+91 1234567890"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Street Address *
                </label>
                <input
                  type="text"
                  required
                  value={address.street}
                  onChange={(e) => setAddress({ ...address, street: e.target.value })}
                  className="w-full border border-gray-300 rounded px-4 py-3 text-base outline-indigo-500"
                  placeholder="House no., Building name, Street"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City *
                  </label>
                  <input
                    type="text"
                    required
                    value={address.city}
                    onChange={(e) => setAddress({ ...address, city: e.target.value })}
                    className="w-full border border-gray-300 rounded px-4 py-3 text-base outline-indigo-500"
                    placeholder="Chandigarh"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    State *
                  </label>
                  <input
                    type="text"
                    required
                    value={address.state}
                    onChange={(e) => setAddress({ ...address, state: e.target.value })}
                    className="w-full border border-gray-300 rounded px-4 py-3 text-base outline-indigo-500"
                    placeholder="Punjab"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ZIP Code *
                  </label>
                  <input
                    type="text"
                    required
                    value={address.zipCode}
                    onChange={(e) => setAddress({ ...address, zipCode: e.target.value })}
                    className="w-full border border-gray-300 rounded px-4 py-3 text-base outline-indigo-500"
                    placeholder="160001"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Country *
                  </label>
                  <input
                    type="text"
                    required
                    value={address.country}
                    onChange={(e) => setAddress({ ...address, country: e.target.value })}
                    className="w-full border border-gray-300 rounded px-4 py-3 text-base outline-indigo-500"
                    placeholder="India"
                  />
                </div>
              </div>

              <div className="flex gap-4 mt-8">
                <button
                  type="button"
                  onClick={() => setShowAddressModal(false)}
                  className="flex-1 px-6 py-3 text-base border border-gray-300 rounded hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 text-base bg-black text-white rounded hover:bg-gray-900 transition-colors"
                >
                  Save Address
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShoppingCart;