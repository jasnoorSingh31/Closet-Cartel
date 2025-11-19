import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

const OrderConfirmation = () => {
  // order + breakdown are passed via router state right after checkout succeeds.
  const location = useLocation();
  const navigate = useNavigate();

  const order = location.state?.order;
  const breakdown = order?.totals || location.state?.breakdown;
  const items = order?.items || [];

  const placedAt = order?.placedAt
    ? new Date(order.placedAt).toLocaleString()
    : new Date().toLocaleString();

  if (!order) {
    return (
      <div className="min-h-screen bg-nav text-white">
        <Navbar />
        <div className="pt-32 flex flex-col items-center justify-center gap-4 px-6 text-center">
          <p className="text-lg">No order details found.</p>
          <button
            onClick={() => navigate("/product")}
            className="px-8 py-3 bg-white text-black rounded-full cursor-pointer hover:bg-gray-200 transition-colors"
          >
            Browse products
          </button>
        </div>
      </div>
    );
  }

  const totals = breakdown || {
    subtotal: items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    tax: 0,
    shippingFee: 0,
    total: items.reduce((sum, item) => sum + item.price * item.quantity, 0),
  };

  return (
    <div className="min-h-screen bg-nav text-white">
      <Navbar />
      <div className="pt-32 max-w-3xl mx-auto px-6 pb-20">
        <div className="bg-white/10 border border-white/10 rounded-2xl p-8 shadow-xl">
          <p className="text-sm uppercase tracking-widest text-icon">
            Order confirmed
          </p>
          <h1 className="text-3xl font-semibold mt-2">
            Thanks for shopping with us
          </h1>
          <p className="mt-2 text-sm text-white/70">
            Order #{order.orderNumber} · {placedAt}
          </p>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div className="bg-white/5 rounded-xl p-4">
              <p className="text-sm text-white/60 uppercase">Payment method</p>
              <p className="text-lg font-medium mt-1">
                {order.paymentMethod || "Cash On Delivery"}
              </p>
              <p className="text-xs text-white/60 mt-2">
                Pay ₹0 now. Settle in cash when the parcel arrives.
              </p>
            </div>
            <div className="bg-white/5 rounded-xl p-4">
              <p className="text-sm text-white/60 uppercase">Total amount</p>
              <p className="text-2xl font-semibold mt-1">
                ${totals.total.toFixed(2)}
              </p>
              <div className="text-xs text-white/60 mt-2 space-y-1">
                <p>Subtotal: ${totals.subtotal.toFixed(2)}</p>
                <p>Tax: ${totals.tax.toFixed(2)}</p>
                <p>Shipping: ${totals.shippingFee.toFixed(2)}</p>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <p className="text-sm font-semibold uppercase text-white/70">
              Items in this order
            </p>
            <div className="mt-4 space-y-3">
              {items.map((item) => (
                <div
                  key={`${item.productId}-${item.selectedSize}`}
                  className="flex items-center justify-between bg-white/5 rounded-lg px-4 py-3 text-sm"
                >
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-white/60">
                      Size {item.selectedSize || "M"} · Qty {item.quantity}
                    </p>
                  </div>
                  <p className="font-semibold">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-end">
            <button
              onClick={() => navigate("/product")}
              className="px-6 py-3 bg-white text-black rounded-full cursor-pointer hover:bg-gray-200 transition"
            >
              Keep shopping
            </button>
            <button
              onClick={() => navigate("/orders")}
              className="px-6 py-3 border border-white/30 rounded-full cursor-pointer hover:bg-white/10 transition"
            >
              View my orders
            </button>
            <button
              onClick={() => navigate("/")}
              className="px-6 py-3 border border-white/30 rounded-full cursor-pointer hover:bg-white/10 transition"
            >
              Go to home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;

