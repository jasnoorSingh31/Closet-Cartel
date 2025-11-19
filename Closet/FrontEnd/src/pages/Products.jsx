import React from "react";
import Navbar from "../components/Navbar";
import { ShoppingCart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
// adjust path if your file is in another folder:
import { useProducts } from "../context/ProductContext";

const Products = () => {
  const navigate = useNavigate();
  const { cart, addToCart, updateQty } = useCart();
  const { products, loading, error } = useProducts();

  // helper to get current quantity for a product
  const getQty = (id) => {
    const item = cart.find((c) => c.id === id);
    return item ? item.quantity : 0;
  };

  return (
    <div>
      <div>
      <Navbar />
      </div>

      <div className="min-h-screen bg-[rgb(17,17,17)] pt-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {loading ? (
            <p className="text-white">Loading products…</p>
          ) : error ? (
            <p className="text-red-400">{error}</p>
          ) : products.length === 0 ? (
            <p className="text-white">No products available yet.</p>
          ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 justify-items-center">
            {products.map((product) => {
              const productId = product.id || product._id;
              const filledStars = Math.round(product.rating || 0);
              const displayRating =
                typeof product.rating === "number"
                  ? product.rating.toFixed(1)
                  : product.rating || "0.0";
              const stock = Number(product.stock ?? 0);
              const currentQty = getQty(productId);
              const soldOut = stock <= 0;
              const reachedMax = currentQty >= stock && stock > 0;
              return (
                <div
                  key={productId}
                  className="border border-gray-500/20 px-4 py-3 bg-white min-w-56 max-w-56 w-full shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="group cursor-pointer flex items-center justify-center px-2">
                    <img
                      className="group-hover:scale-105 transition object-contain max-w-26 md:max-w-36 h-32 w-full"
                      src={product.image}
                      alt={product.name}
                    />
                  </div>

                  <div className="text-gray-500/60 text-sm mt-2">
                    <p>{product.category}</p>
                    <p className="text-gray-700 font-medium text-lg truncate w-full">{product.name}</p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {soldOut
                        ? "Out of stock"
                        : `${stock} in stock${
                            currentQty
                              ? ` · ${Math.max(stock - currentQty, 0)} left`
                              : ""
                          }`}
                    </p>

                    <div className="flex items-center gap-0.5 mt-1">
                      {Array(5).fill("").map((_, i) =>
                        filledStars > i ? (
                          <svg key={i} width="14" height="13" viewBox="0 0 18 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M8.049.927c.3-.921 1.603-.921 1.902 0l1.294 3.983a1 1 0 0 0 .951.69h4.188c.969 0 1.371 1.24.588 1.81l-3.388 2.46a1 1 0 0 0-.364 1.118l1.295 3.983c.299.921-.756 1.688-1.54 1.118L9.589 13.63a1 1 0 0 0-1.176 0l-3.389 2.46c-.783.57-1.838-.197-1.539-1.118L4.78 10.99a1 1 0 0 0-.363-1.118L1.028 7.41c-.783-.57-.38-1.81.588-1.81h4.188a1 1 0 0 0 .95-.69z" fill="#97DFF0" />
                          </svg>
                        ) : (
                          <svg key={i} width="14" height="13" viewBox="0 0 18 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M8.049.927c.3-.921 1.603-.921 1.902 0l1.294 3.983a1 1 0 0 0 .951.69h4.188c.969 0 1.371 1.24.588 1.81l-3.388 2.46a1 1 0 0 0-.364 1.118l1.295 3.983c.299.921-.756 1.688-1.54 1.118L9.589 13.63a1 1 0 0 0-1.176 0l-3.389 2.46c-.783.57-1.838-.197-1.539-1.118L4.78 10.99a1 1 0 0 0-.363-1.118L1.028 7.41c-.783-.57-.38-1.81.588-1.81h4.188a1 1 0 0 0 .95-.69z" fill="#6366f1" fillOpacity="0.35" />
                          </svg>
                        )
                      )}
                      <p className="ml-1">({displayRating})</p>
                    </div>

                    <div className="flex items-end justify-between mt-3">
                      <p className="md:text-xl text-base font-medium text-green-600">
                        ${product.offerPrice}{" "}
                        <span className="text-black md:text-sm text-xs line-through">
                          ${product.price}
                        </span>
                      </p>

                      <div className="text-nav">
                        {currentQty === 0 ? (
                          <button
                            className={`flex items-center justify-center gap-1 md:w-[80px] w-[64px] h-[34px] text-black font-medium border transition-colors ${
                              soldOut
                                ? "bg-gray-200 border-gray-300 cursor-not-allowed text-gray-500"
                                : "bg-white border-nav hover:bg-icon cursor-pointer"
                            }`}
                            disabled={soldOut}
                            onClick={() => addToCart({ ...product, id: productId })}
                          >
                            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M.583.583h2.333l1.564 7.81a1.17 1.17 0 0 0 1.166.94h5.67a1.17 1.17 0 0 0 1.167-.94l.933-4.893H3.5m2.333 8.75a.583.583 0 1 1-1.167 0 .583.583 0 0 1 1.167 0m6.417 0a.583.583 0 1 1-1.167 0 .583.583 0 0 1 1.167 0" stroke="#212121" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            Add
                            {soldOut && <span className="sr-only">Sold out</span>}
                          </button>
                        ) : (
                          <div className="flex items-center justify-center gap-2 md:w-20 w-16 h-[34px] bg-indigo-500/25 rounded select-none">
                            <button
                              onClick={() => updateQty(productId, Math.max(0, currentQty - 1))}
                              className="cursor-pointer text-md px-2 h-full hover:bg-indigo-500/10 transition-colors disabled:opacity-40"
                              disabled={currentQty <= 0}
                            >
                              -
                            </button>
                            <span className="w-5 text-center font-medium">{currentQty}</span>
                            <button
                              onClick={() => updateQty(productId, currentQty + 1)}
                              className="cursor-pointer text-md px-2 h-full hover:bg-indigo-500/10 transition-colors disabled:opacity-40"
                              disabled={reachedMax}
                            >
                              +
                            </button>
                          </div>
                        )}
                        {reachedMax && (
                          <p className="text-[10px] text-gray-500 text-center mt-1">
                            Max stock reached
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          )}

          {/* Cart Summary */}
          {cart.length > 0 && (
            <div className="mt-8 bg-white p-6 rounded-lg shadow-lg border">
              <h3 className="text-lg font-semibold mb-4">Cart Summary</h3>
              <div className="space-y-2">
                {cart.map((item) => (
                  <div key={item.id} className="flex justify-between items-center">
                    <span className="text-sm">{item.name} x {item.quantity}</span>
                    <span className="font-medium">${(item.offerPrice * item.quantity).toFixed(2)}</span>
                  </div>
                ))}

                <div className="border-t pt-2 mt-2">
                  <div className="flex justify-between items-center font-bold">
                    <span>Total:</span>
                    <span className="text-lg text-green-600">
                      ${cart.reduce((total, item) => total + item.offerPrice * item.quantity, 0).toFixed(2)}
                    </span>

                    <div className="flex justify-between items-center font-bold">
                      <button onClick={() => navigate("/cart")} className="hover:text-icon cursor-pointer transition-all duration-300">
                        Checkout <ShoppingCart />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default Products;
