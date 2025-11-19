import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useProducts } from '../context/ProductContext';

const BestSeller = () => {
  const { products, loading } = useProducts();
  const navigate = useNavigate();
  const featured = products.slice(0, 4);

  return (
    <div className="mt-10 px-4">
      <p className="text-2xl md:text-3xl font-bold mb-6 text-center">Best Sellers</p>
      {loading ? (
        <p className="text-center text-gray-400">Loading best sellers…</p>
      ) : featured.length === 0 ? (
        <p className="text-center text-gray-400">Products will appear soon.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 justify-items-center">
          {featured.map((product) => {
            const productId = product.id || product._id;
            const rating = typeof product.rating === 'number' ? product.rating : 0;
            return (
              <div key={productId} className="border border-gray-500/20 px-4 py-3 bg-white min-w-56 max-w-56 w-full">
                <div className="group cursor-pointer flex items-center justify-center px-2">
                  <img
                    className="group-hover:scale-105 transition object-contain max-w-26 md:max-w-36 h-32"
                    src={product.image}
                    alt={product.name}
                  />
                </div>
                <div className="text-gray-500/60 text-sm mt-2">
                  <p>{product.category}</p>
                  <p className="text-gray-700 font-medium text-lg truncate w-full">{product.name}</p>
                  <div className="flex items-center gap-0.5 mt-1">
                    {Array(5).fill('').map((_, i) => (
                      rating > i ? (
                        <svg key={i} width="14" height="13" viewBox="0 0 18 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M8.049.927c.3-.921 1.603-.921 1.902 0l1.294 3.983a1 1 0 0 0 .951.69h4.188c.969 0 1.371 1.24.588 1.81l-3.388 2.46a1 1 0 0 0-.364 1.118l1.295 3.983c.299.921-.756 1.688-1.54 1.118L9.589 13.63a1 1 0 0 0-1.176 0l-3.389 2.46c-.783.57-1.838-.197-1.539-1.118L4.78 10.99a1 1 0 0 0-.363-1.118L1.028 7.41c-.783-.57-.38-1.81.588-1.81h4.188a1 1 0 0 0 .95-.69z" fill="#97DFF0" />
                        </svg>
                      ) : (
                        <svg key={i} width="14" height="13" viewBox="0 0 18 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M8.049.927c.3-.921 1.603-.921 1.902 0l1.294 3.983a1 1 0 0 0 .951.69h4.188c.969 0 1.371 1.24.588 1.81l-3.388 2.46a1 1 0 0 0-.364 1.118l1.295 3.983c.299.921-.756 1.688-1.54 1.118L9.589 13.63a1 1 0 0 0-1.176 0l-3.389 2.46c-.783.57-1.838-.197-1.539-1.118L4.78 10.99a1 1 0 0 0-.363-1.118L1.028 7.41c-.783-.57-.38-1.81.588-1.81h4.188a1 1 0 0 0 .95-.69z" fill="#615fff" fillOpacity="0.35" />
                        </svg>
                      )
                    ))}
                    <p>({rating.toFixed ? rating.toFixed(1) : rating})</p>
                  </div>

                  <div className="flex items-end justify-between mt-3">
                    <p className="md:text-xl text-base font-medium text-green">
                      ${product.offerPrice}{' '}
                      <span className="text-black md:text-sm text-xs line-through">
                        ${product.price}
                      </span>
                    </p>

                    <button
                      onClick={() => navigate('/product')}
                      className="text-indigo-500 hover:text-indigo-400 text-sm"
                    >
                      View
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default BestSeller;
