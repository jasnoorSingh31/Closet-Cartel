import React from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

const ShoppingCart = () => {
  const navigate = useNavigate();
  const { cart, updateQty, removeFromCart } = useCart();
  const [showAddress, setShowAddress] = React.useState(false);

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce(
    (sum, item) => sum + item.offerPrice * item.quantity,
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
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-8">
                      <div className="text-center md:text-left">
                        <p className="text-xl font-medium text-green-600">
                          ${product.offerPrice}{" "}
                          <span className="text-black text-sm line-through">
                            ${product.price}
                          </span>
                        </p>
                        <p className="text-sm text-gray-500">
                          Subtotal: $
                          {(product.offerPrice * product.quantity).toFixed(2)}
                        </p>
                      </div>

                      <div className="flex items-center justify-center">
                    <div className="flex flex-col items-center justify-center text-indigo-500">
                      <div className="flex items-center justify-center gap-2 w-20 h-9 bg-indigo-500/25 rounded select-none">
                        <button
                          onClick={() =>
                            handleQuantityChange(
                              product.id,
                              product.quantity - 1
                            )
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
                            handleQuantityChange(
                              product.id,
                              product.quantity + 1
                            )
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
            onClick={() => {
              navigate("/");
            }}
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
            </span>{" "}
          </button>
        </div>

        {/* Order Summary */}
        <div className="max-w-[360px] w-full h-[500px] mt-16 bg-gray-100/40 p-5 max-md:mt-16 max-md:mx-auto border border-gray-300/70">
          <h2 className="text-xl md:text-xl font-medium">Order Summary</h2>
          <hr className="border-gray-300 my-5" />

          {/* Address */}
          <div className="mb-6">
            <p className="text-sm font-medium uppercase">Delivery Address</p>
            <div className="relative flex justify-between items-start mt-2">
              <p className="text-white">No address found</p>
              <button
                onClick={() => setShowAddress(!showAddress)}
                className="text-icon hover:underline cursor-pointer"
              >
                Change
              </button>
              {showAddress && (
                <div className="absolute top-12 py-1 bg-white border border-gray-300 text-sm w-full z-10">
                  <p
                    onClick={() => setShowAddress(false)}
                    className="text-black p-2 hover:bg-gray-100 cursor-pointer"
                  >
                    Chandigarh, India
                  </p>
                  <p
                    onClick={() => setShowAddress(false)}
                    className="text-black text-center cursor-pointer p-2 hover:bg-icon/10"
                  >
                    Add address
                  </p>
                </div>
              )}
            </div>

            {/* Payment */}
            <p className="text-sm font-medium uppercase mt-6">Payment Method</p>
            <select className="w-full border border-gray-300 bg-white px-3 py-2 mt-2 outline-none">
              <option value="COD">Cash On Delivery</option>
              <option value="Online">Online Payment</option>
            </select>
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

          <button
            className="w-full py-3 mt-6 cursor-pointer bg-black text-white font-medium disabled:opacity-40"
            disabled={cart.length === 0}
          >
            Place Order
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShoppingCart;
