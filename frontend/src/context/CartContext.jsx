import { createContext, useContext, useMemo, useState } from "react";

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const rawItems = localStorage.getItem("cart_items");
    return rawItems ? JSON.parse(rawItems) : [];
  });

  const persist = (items) => {
    setCartItems(items);
    localStorage.setItem("cart_items", JSON.stringify(items));
  };

  const addToCart = (item) => {
    const itemKey = `${item.product}|${item.selectedSize || ""}|${item.selectedShape || ""}`;
    const existing = cartItems.find(
      (cartItem) =>
        `${cartItem.product}|${cartItem.selectedSize || ""}|${cartItem.selectedShape || ""}` ===
        itemKey
    );

    if (existing) {
      const nextItems = cartItems.map((cartItem) =>
        `${cartItem.product}|${cartItem.selectedSize || ""}|${cartItem.selectedShape || ""}` ===
          itemKey
          ? { ...cartItem, quantity: cartItem.quantity + (item.quantity || 1) }
          : cartItem
      );
      persist(nextItems);
      return;
    }

    persist([...cartItems, { ...item, quantity: item.quantity || 1 }]);
  };

  const updateCartItemQty = (itemKey, quantity) => {
    const nextItems = cartItems.map((item) =>
      `${item.product}|${item.selectedSize || ""}|${item.selectedShape || ""}` === itemKey
        ? { ...item, quantity }
        : item
    );
    persist(nextItems);
  };

  const removeCartItem = (itemKey) => {
    const nextItems = cartItems.filter(
      (item) =>
        `${item.product}|${item.selectedSize || ""}|${item.selectedShape || ""}` !== itemKey
    );
    persist(nextItems);
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem("cart_items");
  };

  const value = useMemo(
  () => ({
    cartItems,
    addToCart,
    updateCartItemQty,
    removeCartItem,
    clearCart,
  }),
  [
    cartItems,
    addToCart,
    updateCartItemQty,
    removeCartItem,
    clearCart,
  ]
);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used inside CartProvider");
  }
  return context;
};

