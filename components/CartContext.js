"use client";
import { createContext, useState, useEffect, useRef } from "react";

export const CartContext = createContext({});

export function CartContextProvider({ children }) {
  const ls = typeof window !== "undefined" ? window.localStorage : null;
  const [cartProducts, setCartProducts] = useState([]);
  const [cartLoaded, setCartLoaded] = useState(false);
  const addProductTimeoutRef = useRef(null);

  // Load cart from localStorage on mount (runs once)
  useEffect(() => {
    if (ls && ls.getItem('cart')) {
      try {
        setCartProducts(JSON.parse(ls.getItem('cart')));
      } catch (error) {
        console.error('Failed to load cart from localStorage:', error);
        // Clear corrupted cart data
        ls.removeItem('cart');

        // Show user-friendly notification
        if (typeof window !== 'undefined') {
          alert('Your cart data was corrupted and has been reset. We apologize for the inconvenience.');
        }
      }
    }
    setCartLoaded(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run once on mount - ls is stable

  // Save cart to localStorage whenever it changes (runs after cart is loaded)
  useEffect(() => {
    // Don't save until cart has been loaded from localStorage
    if (!cartLoaded) return;

    if (ls) {
      try {
        if (cartProducts?.length > 0) {
          ls.setItem('cart', JSON.stringify(cartProducts));
        } else {
          // Clear localStorage when cart is empty to ensure it persists correctly
          ls.removeItem('cart');
        }
      } catch (error) {
        console.error('Failed to save cart to localStorage:', error);
      }
    }
  }, [cartProducts, ls, cartLoaded]);

  function addProduct(productId, variant) {
    // Validate required variant properties
    if (!variant || !variant.size || variant.price === undefined || variant.price === null) {
      console.error('Invalid variant data:', { productId, variant });
      return;
    }

    // Validate productId
    if (!productId) {
      console.error('Missing productId');
      return;
    }

    // Debounce to prevent double-click issues
    if (addProductTimeoutRef.current) {
      clearTimeout(addProductTimeoutRef.current);
    }

    addProductTimeoutRef.current = setTimeout(() => {
      setCartProducts(prev => [...prev, {
        productId,
        variantId: variant._id || variant.size,
        size: variant.size,
        price: variant.price
      }]);
      addProductTimeoutRef.current = null;
    }, 300); // 300ms debounce
  }

  function removeProduct(productId, variantId) {
    setCartProducts(prev => {
      const pos = prev.findIndex(item =>
        item.productId === productId && item.variantId === variantId
      );
      if (pos === -1) return prev; // Item not found

      // Remove only the first matching item (allows multiple of same product)
      return [...prev.slice(0, pos), ...prev.slice(pos + 1)];
    });
  }

  function clearCart() {
    setCartProducts([]);
    try {
      ls?.removeItem('cart');
    } catch (error) {
      console.error('Failed to clear cart from localStorage:', error);
    }
  }

  return (
    <CartContext.Provider value={{
      cartProducts,
      setCartProducts,
      addProduct,
      removeProduct,
      clearCart,
      cartLoaded
    }}>
      {children}
    </CartContext.Provider>
  );
}