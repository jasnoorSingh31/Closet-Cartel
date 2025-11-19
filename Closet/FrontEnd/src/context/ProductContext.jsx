import React, { createContext, useContext, useEffect, useState } from 'react';
import { API_BASE_URL } from '../utils/constants';

const ProductContext = createContext();

export const useProducts = () => {
  const ctx = useContext(ProductContext);
  if (!ctx) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return ctx;
};

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${API_BASE_URL}/products`);

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || 'Unable to load products');
      }

      setProducts(data.products || []);
      return data.products || [];
    } catch (err) {
      console.error('fetchProducts error:', err);
      setError(err.message || 'Unable to load products');
      return [];
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchAdminProducts = async (token) => {
    try {
      const response = await fetch(`${API_BASE_URL}/products/admin`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || 'Unable to load admin products');
      }

      return data.products || [];
    } catch (error) {
      console.error('fetchAdminProducts error:', error);
      throw error;
    }
  };

  const value = {
    products,
    loading,
    error,
    refreshProducts: fetchProducts,
    setProducts,
    fetchAdminProducts,
  };

  return (
    <ProductContext.Provider value={value}>
      {children}
    </ProductContext.Provider>
  );
};

