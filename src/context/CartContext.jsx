import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('food_cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  const [orders, setOrders] = useState(() => {
    const savedOrders = localStorage.getItem('food_orders');
    return savedOrders ? JSON.parse(savedOrders) : [];
  });

  const [darkMode, setDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme === 'dark';
  });

  const [appliedPromo, setAppliedPromo] = useState(null);

  useEffect(() => {
    localStorage.setItem('food_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('food_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');
    if (darkMode) {
      document.documentElement.classList.add('dark-theme');
    } else {
      document.documentElement.classList.remove('dark-theme');
    }
  }, [darkMode]);

  const toggleTheme = () => {
    setDarkMode(prev => !prev);
  };

  const addToCart = (product, quantity = 1) => {
    setCart(prevCart => {
      const existingItemIndex = prevCart.findIndex(item => item.product.id === product.id);
      if (existingItemIndex > -1) {
        const newCart = [...prevCart];
        newCart[existingItemIndex].quantity += quantity;
        return newCart;
      }
      return [...prevCart, { product, quantity }];
    });
  };

  const removeFromCart = (productId) => {
    setCart(prevCart => prevCart.filter(item => item.product.id !== productId));
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prevCart =>
      prevCart.map(item =>
        item.product.id === productId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
    setAppliedPromo(null);
  };

  const applyPromoCode = (code) => {
    const cleanCode = code.trim().toUpperCase();
    if (cleanCode === 'FEAST20') {
      setAppliedPromo({
        code: 'FEAST20',
        discountPercent: 20
      });
      return { success: true, message: 'Promo code FEAST20 applied! 20% discount.' };
    }
    return { success: false, message: 'Invalid promo code. Try FEAST20.' };
  };

  const removePromoCode = () => {
    setAppliedPromo(null);
  };

  const getCartCount = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const getCartSubtotal = () => {
    return cart.reduce((total, item) => total + item.product.price * item.quantity, 0);
  };

  const getDiscountAmount = () => {
    if (!appliedPromo) return 0;
    return (getCartSubtotal() * appliedPromo.discountPercent) / 100;
  };

  const getDeliveryFee = () => {
    const subtotal = getCartSubtotal();
    if (subtotal === 0) return 0;
    return subtotal > 40 ? 0 : 3.99; // Free delivery over $40
  };

  const getCartTotal = () => {
    return getCartSubtotal() - getDiscountAmount() + getDeliveryFee();
  };

  const placeOrder = (deliveryInfo) => {
    const newOrder = {
      id: `ORD-${Math.floor(100000 + Math.random() * 900000)}`,
      date: new Date().toISOString(),
      items: [...cart],
      deliveryInfo,
      pricing: {
        subtotal: getCartSubtotal(),
        discount: getDiscountAmount(),
        deliveryFee: getDeliveryFee(),
        total: getCartTotal(),
        promoCode: appliedPromo ? appliedPromo.code : null
      },
      status: 'Placed' // Placed -> Preparing -> Out for Delivery -> Delivered
    };
    
    setOrders(prevOrders => [newOrder, ...prevOrders]);
    clearCart();
    return newOrder;
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        orders,
        darkMode,
        appliedPromo,
        toggleTheme,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        applyPromoCode,
        removePromoCode,
        getCartCount,
        getCartSubtotal,
        getDiscountAmount,
        getDeliveryFee,
        getCartTotal,
        placeOrder
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
