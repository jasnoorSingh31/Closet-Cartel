import React from "react";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import { API_BASE_URL } from "../utils/constants";
import { useNavigate } from "react-router-dom";

const MyOrders = () => {
  const { token, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    const fetchOrders = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}/orders/mine`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        if (!data.success) {
          throw new Error(data.message || "Unable to load orders");
        }
        setOrders(data.orders || []);
      } catch (err) {
        setError(err.message || "Unable to load orders");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [token]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-nav text-white">
        <Navbar />
        <div className="pt-32 flex flex-col items-center gap-4 px-6 text-center">
          <p className="text-lg">Please log in to view your orders.</p>
          <button
            onClick={() => navigate("/login")}
            className="px-8 py-3 bg-white text-black rounded-full cursor-pointer hover:bg-gray-200 transition"
          >
            Go to login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-nav text-white">
      <Navbar />
      <div className="pt-32 max-w-5xl mx-auto px-6 pb-20">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-sm uppercase text-icon tracking-widest">
              Order history
            </p>
            <h1 className="text-3xl font-semibold">My Orders</h1>
          </div>
          <button
            onClick={() => navigate("/product")}
            className="px-6 py-3 bg-white text-black rounded-full cursor-pointer hover:bg-gray-200 transition"
          >
            Browse more
          </button>
        </div>

        {loading ? (
          <p className="text-white/70">Loading your orders…</p>
        ) : error ? (
          <p className="text-red-400">{error}</p>
        ) : orders.length === 0 ? (
          <div className="bg-white/5 border border-white/10 rounded-xl p-8 text-center">
            <p>You haven't placed any orders yet.</p>
            <button
              onClick={() => navigate("/product")}
              className="mt-4 px-6 py-3 bg-white text-black rounded-full cursor-pointer hover:bg-gray-200 transition"
            >
              Start shopping
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-white/5 border border-white/10 rounded-xl p-5 text-sm"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div>
                    <p className="text-white font-semibold">
                      Order #{order.orderNumber}
                    </p>
                    <p className="text-white/60">
                      {new Date(order.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-white text-lg font-semibold">
                      ${order.totals?.total?.toFixed(2)}
                    </p>
                    <p className="text-white/60 text-xs">
                      {order.paymentMethod}
                    </p>
                  </div>
                </div>

                <div className="mt-4 space-y-2">
                  {order.items.map((item) => (
                    <div
                      key={`${item.productId}-${item.selectedSize}`}
                      className="flex items-center justify-between bg-white/5 rounded-lg px-3 py-2"
                    >
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-white/60 text-xs">
                          Size {item.selectedSize} · Qty {item.quantity}
                        </p>
                      </div>
                      <p className="font-semibold">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrders;

