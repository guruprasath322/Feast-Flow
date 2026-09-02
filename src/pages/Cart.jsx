import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Minus, Plus, Trash2, ArrowRight, ShoppingBag, Tag, Percent } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function Cart() {
  const {
    cart,
    updateQuantity,
    removeFromCart,
    getCartSubtotal,
    getDiscountAmount,
    getDeliveryFee,
    getCartTotal,
    appliedPromo,
    applyPromoCode,
    removePromoCode
  } = useCart();

  const [promoInput, setPromoInput] = useState('');
  const [promoFeedback, setPromoFeedback] = useState({ success: null, message: '' });

  const subtotal = getCartSubtotal();
  const discount = getDiscountAmount();
  const delivery = getDeliveryFee();
  const total = getCartTotal();

  const handleApplyPromo = (e) => {
    e.preventDefault();
    if (!promoInput.trim()) return;

    const result = applyPromoCode(promoInput);
    setPromoFeedback({ success: result.success, message: result.message });
    if (result.success) {
      setPromoInput('');
    }
  };

  const handleRemovePromo = () => {
    removePromoCode();
    setPromoFeedback({ success: null, message: '' });
  };

  if (cart.length === 0) {
    return (
      <div className="container anim-fade-in" style={{ padding: '60px 0' }}>
        <div className="empty-state">
          <div className="empty-state-icon">
            <ShoppingBag size={40} />
          </div>
          <h3>Your Cart is Empty</h3>
          <p>Hungry? Add some delicious items from our menu and experience premium fast food delivery.</p>
          <Link to="/" className="btn-primary">
            Browse Menu
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container anim-fade-in">
      <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '36px', marginBottom: '24px' }}>Shopping Cart</h2>

      <div className="cart-layout">
        {/* Left Side: Cart Items List */}
        <div className="cart-items-panel">
          {cart.map(item => {
            const { product, quantity } = item;
            return (
              <div key={product.id} className="cart-card">
                <img src={product.image} alt={product.name} className="cart-card-img" />
                
                <div className="cart-card-info">
                  <span className="cart-card-cat">{product.category}</span>
                  <h3 className="cart-card-name">{product.name}</h3>
                  <div className="cart-card-price">${product.price.toFixed(2)}</div>
                </div>

                <div className="cart-card-actions">
                  <div className="quantity-picker" style={{ height: '42px' }}>
                    <button 
                      onClick={() => updateQuantity(product.id, quantity - 1)}
                      className="quantity-btn"
                      style={{ width: '32px', height: '32px' }}
                      aria-label="Decrease quantity"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="quantity-val" style={{ fontSize: '16px', width: '32px' }}>{quantity}</span>
                    <button 
                      onClick={() => updateQuantity(product.id, quantity + 1)}
                      className="quantity-btn"
                      style={{ width: '32px', height: '32px' }}
                      aria-label="Increase quantity"
                    >
                      <Plus size={14} />
                    </button>
                  </div>

                  <div className="cart-card-price" style={{ width: '80px', textAlign: 'right' }}>
                    ${(product.price * quantity).toFixed(2)}
                  </div>

                  <button 
                    onClick={() => removeFromCart(product.id)}
                    className="delete-btn"
                    title="Remove from cart"
                    aria-label={`Remove ${product.name} from cart`}
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Side: Bill Summary Panel */}
        <div className="summary-panel">
          <h3 className="summary-title">Order Summary</h3>

          {/* Promo Code Area */}
          {!appliedPromo ? (
            <form onSubmit={handleApplyPromo} className="promo-container">
              <input 
                type="text" 
                placeholder="Promo Code (FEAST20)" 
                className="promo-input" 
                value={promoInput}
                onChange={(e) => setPromoInput(e.target.value)}
              />
              <button type="submit" className="promo-apply-btn">Apply</button>
            </form>
          ) : (
            <div className="applied-badge">
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Tag size={16} />
                Code: {appliedPromo.code} ({appliedPromo.discountPercent}% OFF)
              </span>
              <span onClick={handleRemovePromo} className="remove-promo-btn" title="Remove promo code">
                ✕
              </span>
            </div>
          )}

          {promoFeedback.message && (
            <div className={`promo-feedback ${promoFeedback.success ? 'success' : 'error'}`}>
              {promoFeedback.message}
            </div>
          )}

          {/* Pricing breakdown */}
          <div className="summary-row">
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>

          {discount > 0 && (
            <div className="summary-row discount">
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Percent size={14} /> Discount
              </span>
              <span>-${discount.toFixed(2)}</span>
            </div>
          )}

          <div className="summary-row">
            <span>Delivery Fee</span>
            <span>
              {delivery === 0 ? (
                <strong style={{ color: 'var(--accent-success)' }}>FREE</strong>
              ) : (
                `$${delivery.toFixed(2)}`
              )}
            </span>
          </div>

          <div className="summary-divider"></div>

          <div className="summary-total">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>

          <Link to="/checkout" className="btn-primary btn-checkout">
            Proceed to Checkout <ArrowRight size={18} />
          </Link>

          {subtotal < 40 && (
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', textAlign: 'center', marginTop: '16px' }}>
              Add ${(40 - subtotal).toFixed(2)} more for <strong>FREE Delivery</strong>!
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
