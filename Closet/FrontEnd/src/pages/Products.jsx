import React, { useState } from 'react'
import Navbar from '../components/Navbar'
import { ShoppingCart } from 'lucide-react';
import {useNavigate } from 'react-router-dom';

const Products = () => {
    const navigate= useNavigate();

  // Sample product data
  const productImages = [
    {
      id: 1,
      name: "Wireless Bluetooth Headphones",
      category: "Electronics",
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop",
      rating: 4,
      price: 99.99,
      offerPrice: 79.99
    },
    {
      id: 2,
      name: "Smart Fitness Tracker",
      category: "Wearables",
      image: "https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=400&h=300&fit=crop",
      rating: 5,
      price: 129.99,
      offerPrice: 99.99
    },
    {
      id: 3,
      name: "Organic Coffee Beans",
      category: "Food & Beverage",
      image: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400&h=300&fit=crop",
      rating: 4,
      price: 24.99,
      offerPrice: 19.99
    },
    {
      id: 4,
      name: "Minimalist Desk Lamp",
      category: "Home & Office",
      image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400&h=300&fit=crop",
      rating: 3,
      price: 59.99,
      offerPrice: 49.99
    },
    {
      id: 5,
      name: "Ceramic Plant Pot Set",
      category: "Home Decor",
      image: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=400&h=300&fit=crop",
      rating: 5,
      price: 39.99,
      offerPrice: 29.99
    },
    {
      id: 6,
      name: "Premium Leather Wallet",
      category: "Accessories",
      image: "https://images.unsplash.com/photo-1627123424574-724758594e93?w=400&h=300&fit=crop",
      rating: 4,
      price: 89.99,
      offerPrice: 69.99
    },
    {
      id: 7,
      name: "Stainless Steel Water Bottle",
      category: "Sports & Outdoors",
      image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400&h=300&fit=crop",
      rating: 5,
      price: 34.99,
      offerPrice: 24.99
    },
    {
      id: 8,
      name: "Wireless Phone Charger",
      category: "Electronics",
      image: "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=400&h=300&fit=crop",
      rating: 4,
      price: 49.99,
      offerPrice: 39.99
    }
  ];

  // State to track item counts
  const [counts, setCounts] = useState({});

  // Handler functions
  const handleAdd = (productId) => {
    setCounts(prev => ({
      ...prev,
      [productId]: 1
    }));
  };

  const handleIncrement = (productId) => {
    setCounts(prev => ({
      ...prev,
      [productId]: (prev[productId] || 0) + 1
    }));
  };

  const handleDecrement = (productId) => {
    setCounts(prev => ({
      ...prev,
      [productId]: Math.max(0, (prev[productId] || 0) - 1)
    }));
  };

  return (
    <div>
      <Navbar />
      <div className="min-h-screen bg-nav pt-30">
    

        {/* Products Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 justify-items-center">
            {productImages.map((product) => (
              <div key={product.id} className="border border-gray-500/20 px-4 py-3 bg-white min-w-56 max-w-56 w-full shadow-sm hover:shadow-md transition-shadow">
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
                  <div className="flex items-center gap-0.5 mt-1">
                    {Array(5).fill('').map((_, i) => (
                      product.rating > i ? (
                        <svg key={i} width="14" height="13" viewBox="0 0 18 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M8.049.927c.3-.921 1.603-.921 1.902 0l1.294 3.983a1 1 0 0 0 .951.69h4.188c.969 0 1.371 1.24.588 1.81l-3.388 2.46a1 1 0 0 0-.364 1.118l1.295 3.983c.299.921-.756 1.688-1.54 1.118L9.589 13.63a1 1 0 0 0-1.176 0l-3.389 2.46c-.783.57-1.838-.197-1.539-1.118L4.78 10.99a1 1 0 0 0-.363-1.118L1.028 7.41c-.783-.57-.38-1.81.588-1.81h4.188a1 1 0 0 0 .95-.69z" fill="#97DFF0" />
                        </svg>
                      ) : (
                        <svg key={i} width="14" height="13" viewBox="0 0 18 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M8.049.927c.3-.921 1.603-.921 1.902 0l1.294 3.983a1 1 0 0 0 .951.69h4.188c.969 0 1.371 1.24.588 1.81l-3.388 2.46a1 1 0 0 0-.364 1.118l1.295 3.983c.299.921-.756 1.688-1.54 1.118L9.589 13.63a1 1 0 0 0-1.176 0l-3.389 2.46c-.783.57-1.838-.197-1.539-1.118L4.78 10.99a1 1 0 0 0-.363-1.118L1.028 7.41c-.783-.57-.38-1.81.588-1.81h4.188a1 1 0 0 0 .95-.69z" fill="#6366f1" fillOpacity="0.35" />
                        </svg>
                      )
                    ))}
                    <p className="ml-1">({product.rating})</p>
                  </div>

                  <div className="flex items-end justify-between mt-3">
                    <p className="md:text-xl text-base font-medium text-green-600">
                      ${product.offerPrice}{' '}
                      <span className="text-black md:text-sm text-xs line-through">
                        ${product.price}
                      </span>
                    </p>

                    <div className="text-nav">
                      {counts[product.id] === 0 || counts[product.id] === undefined ? (
                        <button
                          className="flex items-center justify-center gap-1 bg-white border border-nav md:w-[80px] w-[64px] h-[34px] text-black font-medium cursor-pointer hover:bg-icon transition-colors"
                          onClick={() => handleAdd(product.id)}
                        >
                          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M.583.583h2.333l1.564 7.81a1.17 1.17 0 0 0 1.166.94h5.67a1.17 1.17 0 0 0 1.167-.94l.933-4.893H3.5m2.333 8.75a.583.583 0 1 1-1.167 0 .583.583 0 0 1 1.167 0m6.417 0a.583.583 0 1 1-1.167 0 .583.583 0 0 1 1.167 0" stroke="#212121" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                          Add
                        </button>
                      ) : (
                        <div className="flex items-center justify-center gap-2 md:w-20 w-16 h-[34px] bg-indigo-500/25 rounded select-none">
                          <button 
                            onClick={() => handleDecrement(product.id)} 
                            className="cursor-pointer text-md px-2 h-full hover:bg-indigo-500/10 transition-colors"
                          >
                            -
                          </button>
                          <span className="w-5 text-center font-medium">{counts[product.id]}</span>
                          <button 
                            onClick={() => handleIncrement(product.id)} 
                            className="cursor-pointer text-md px-2 h-full hover:bg-indigo-500/10 transition-colors"
                          >
                            +
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Cart Summary */}
          {Object.values(counts).some(count => count > 0) && (
            <div className="mt-8 bg-white p-6 rounded-lg shadow-lg border">
              <h3 className="text-lg font-semibold mb-4">Cart Summary</h3>
              <div className="space-y-2">
                {Object.entries(counts).filter(([_, count]) => count > 0).map(([productId, count]) => {
                  const product = productImages.find(p => p.id === parseInt(productId));
                  return (
                    <div key={productId} className="flex justify-between items-center">
                      <span className="text-sm">{product.name} x {count}</span>
                      <span className="font-medium">${(product.offerPrice * count).toFixed(2)}</span>
                    </div>
                  );
                })}
                <div className="border-t pt-2 mt-2">
                  <div className="flex justify-between items-center font-bold">
                    <span>Total:</span>
                    <span className="text-lg text-green-600">
                      ${Object.entries(counts).reduce((total, [productId, count]) => {
                        const product = productImages.find(p => p.id === parseInt(productId));
                        return total + (product.offerPrice * count);
                      }, 0).toFixed(2)}
                    </span>
                    <div className="flex justify-between items-center font-bold">
                    <button onClick={()=> {navigate("/cart")}} className='hover:text-icon cursor-pointer transition-all duration-300'>Checkout <ShoppingCart /></button>
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