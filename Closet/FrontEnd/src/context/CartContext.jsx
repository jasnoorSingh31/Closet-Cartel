import React, { createContext, useContext, useEffect, useState } from "react";

/*
  CartContext: holds cart array and helper functions:
  - addToCart(product)
  - updateQty(id, qty)
  - removeFromCart(id)
  Persists to localStorage.
*/
const CartContext = createContext();

export const CartProvider = ({ children }) => {
  // Initialize cart from localStorage (safe parse)
  const [cart, setCart] = useState(() => {
    try {
      const raw = localStorage.getItem("cart");
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  // Persist cart on change
  useEffect(() => {
    try {
      localStorage.setItem("cart", JSON.stringify(cart));
    } catch {}
  }, [cart]);

  // Add product (if exists increment quantity, else push with quantity=1)
  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find((p) => p.id === product.id);
      const stock = Number(
        product?.stock ?? existing?.stock ?? Number.POSITIVE_INFINITY
      );

      if (existing) {
        if (existing.quantity >= stock) {
          return prev;
        }
        return prev.map((p) =>
          p.id === product.id
            ? { ...p, quantity: Math.min(stock, p.quantity + 1) }
            : p
        );
      }

      if (stock <= 0) return prev;
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  // Set quantity (if qty <= 0 remove item)
  const updateQty = (id, quantity) => {
    setCart((prev) => {
      return prev
        .map((p) => {
          if (p.id !== id) return p;
          if (quantity <= 0) return null;
          const stock = Number(p.stock ?? Number.POSITIVE_INFINITY);
          const nextQty =
            stock === Number.POSITIVE_INFINITY
              ? quantity
              : Math.min(quantity, stock);
          return { ...p, quantity: nextQty };
        })
        .filter(Boolean);
    });
  };

  // Remove item entirely
  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, updateQty, removeFromCart }}>
      {children}
    </CartContext.Provider>
  );
};

// custom hook for easy access
export const useCart = () => useContext(CartContext);
