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

  function addProduct(productId, variant) {
    setCartProducts(prev => [...prev, {
      productId,
      variantId: variant._id || variant.size, 
      size: variant.size,
      price: variant.price
    }]);
  }

  function removeProduct(productId, variantId) {
    setCartProducts(prev => {
      const pos = prev.findIndex(item =>
        item.productId === productId && item.variantId === variantId
      );
      if (pos !== -1) {
        return prev.filter((_, index) => index !== pos);
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