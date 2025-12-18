"use client";
import { createContext, useState, useEffect } from "react";

export const CartContext = createContext({});

export function CartContextProvider({ children }) {
  const ls = typeof window !== "undefined" ? window.localStorage : null;
  const [cartProducts, setCartProducts] = useState([]);

  useEffect(() => {
    if (cartProducts?.length > 0) {
      ls?.setItem('cart', JSON.stringify(cartProducts));
    }
  }, [cartProducts, ls]);

  useEffect(() => {
    if (ls && ls.getItem('cart')) {
      setCartProducts(JSON.parse(ls.getItem('cart')));
    }
  }, [ls]);

  // Add product with variant info: { productId, variantId, size, price }
  function addProduct(productId, variant = null) {
    if (variant) {
      // Adding with variant (new system)
      setCartProducts(prev => [...prev, { 
        productId, 
        variantId: variant._id || variant.size, // Use size as ID if no _id
        size: variant.size,
        price: variant.price
      }]);
    } else {
      // Backward compatibility - adding without variant (old system)
      setCartProducts(prev => [...prev, productId]);
    }
  }

  // Remove one instance of product with matching variant
  function removeProduct(productId, variantId = null) {
    setCartProducts(prev => {
      if (variantId) {
        // Remove by productId + variantId
        const pos = prev.findIndex(item => 
          (typeof item === 'object' ? item.productId === productId && item.variantId === variantId : false)
        );
        if (pos !== -1) {
          return prev.filter((value, index) => index !== pos);
        }
      } else {
        // Old system - remove by productId only
        const pos = prev.findIndex(item => 
          typeof item === 'string' ? item === productId : item.productId === productId
        );
        if (pos !== -1) {
          return prev.filter((value, index) => index !== pos);
        }
      }
      return prev;
    });
  }

  function clearCart() {
    setCartProducts([]);
    ls?.removeItem('cart');
  }

  return (
    <CartContext.Provider value={{
      cartProducts,
      setCartProducts,
      addProduct,
      removeProduct,
      clearCart
    }}>
      {children}
    </CartContext.Provider>
  );
}