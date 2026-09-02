import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { CreditCard, Truck, Wallet, ShieldCheck, ArrowLeft, Loader2 } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function Checkout() {
  const { cart, getCartSubtotal, getDiscountAmount, getDeliveryFee, getCartTotal, placeOrder } = useCart();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    zipCode: ''
  });
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    // If cart is empty, send back to cart page
    if (cart.length === 0 && !loading) {
      navigate('/cart');
    }
  }, [cart, navigate, loading]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error for this field
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = 'Full name is required';
    if (!formData.email.trim()) {
      errors.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }
    if (!formData.phone.trim()) {
      errors.phone = 'Phone number is required';
    } else if (!/^\+?[0-9\s-]{8,15}$/.test(formData.phone)) {
      errors.phone = 'Please enter a valid phone number';
    }
    if (!formData.address.trim()) errors.address = 'Delivery address is required';
    if (!formData.city.trim()) errors.city = 'City is required';
    if (!formData.zipCode.trim()) errors.zipCode = 'ZIP / Postal code is required';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);

    // Simulate order placement processing network delay
    setTimeout(() => {
      const order = placeOrder({
        ...formData,
        paymentMethod
      });
      setLoading(false);
      navigate('/order-confirmation', { state: { order } });
    }, 2000);
  };

  if (cart.length === 0 && !loading) return null;

  return (
    <div className="container anim-fade-in">
      <Link to="/cart" className="details-back-link">
        <ArrowLeft size={16} /> Return to Cart
      </Link>

      <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '36px', marginBottom: '24px' }}>Checkout</h2>

      {loading ? (
        <div className="spinner-wrapper" style={{ padding: '80px 0' }}>
          <div className="spinner"></div>
          <h3 style={{ marginTop: '16px' }}>Placing Your Gourmet Order...</h3>
          <p style={{ color: 'var(--text-muted)' }}>We are confirming your items with the kitchen.</p>
        </div>
      ) : (
        <div className="checkout-layout">
          {/* Checkout Form */}
          <form onSubmit={handleSubmit} className="checkout-form-panel">
            {/* Delivery Details */}
            <div className="form-section">
              <h3 className="form-section-title">1. Delivery Address</h3>
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="name">Full Name</label>
                  <input 
                    type="text" 
                    id="name" 
                    name="name" 
                    className="form-input" 
                    value={formData.name} 
                    onChange={handleInputChange} 
                  />
                  {formErrors.name && <span style={{ color: 'var(--primary)', fontSize: '12px' }}>{formErrors.name}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="phone">Phone Number</label>
                  <input 
                    type="tel" 
                    id="phone" 
                    name="phone" 
                    className="form-input" 
                    placeholder="e.g. +1 555-0199"
                    value={formData.phone} 
                    onChange={handleInputChange} 
                  />
                  {formErrors.phone && <span style={{ color: 'var(--primary)', fontSize: '12px' }}>{formErrors.phone}</span>}
                </div>

                <div className="form-group full-width">
                  <label htmlFor="email">Email Address</label>
                  <input 
                    type="email" 
                    id="email" 
                    name="email" 
                    className="form-input" 
                    value={formData.email} 
                    onChange={handleInputChange} 
                  />
                  {formErrors.email && <span style={{ color: 'var(--primary)', fontSize: '12px' }}>{formErrors.email}</span>}
                </div>

                <div className="form-group full-width">
                  <label htmlFor="address">Address Street & Apt</label>
                  <input 
                    type="text" 
                    id="address" 
                    name="address" 
                    className="form-input" 
                    value={formData.address} 
                    onChange={handleInputChange} 
                  />
                  {formErrors.address && <span style={{ color: 'var(--primary)', fontSize: '12px' }}>{formErrors.address}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="city">City</label>
                  <input 
                    type="text" 
                    id="city" 
                    name="city" 
                    className="form-input" 
                    value={formData.city} 
                    onChange={handleInputChange} 
                  />
                  {formErrors.city && <span style={{ color: 'var(--primary)', fontSize: '12px' }}>{formErrors.city}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="zipCode">ZIP / Postal Code</label>
                  <input 
                    type="text" 
                    id="zipCode" 
                    name="zipCode" 
                    className="form-input" 
                    value={formData.zipCode} 
                    onChange={handleInputChange} 
                  />
                  {formErrors.zipCode && <span style={{ color: 'var(--primary)', fontSize: '12px' }}>{formErrors.zipCode}</span>}
                </div>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="form-section">
              <h3 className="form-section-title">2. Payment Method</h3>
              <div className="payment-options">
                <label className={`payment-radio-label ${paymentMethod === 'card' ? 'selected' : ''}`}>
                  <input 
                    type="radio" 
                    name="payment" 
                    value="card" 
                    checked={paymentMethod === 'card'} 
                    onChange={() => setPaymentMethod('card')} 
                  />
                  <CreditCard size={20} />
                  <span>Credit / Debit Card</span>
                  <span className="payment-radio-label-icon">💳</span>
                </label>

                <label className={`payment-radio-label ${paymentMethod === 'upi' ? 'selected' : ''}`}>
                  <input 
                    type="radio" 
                    name="payment" 
                    value="upi" 
                    checked={paymentMethod === 'upi'} 
                    onChange={() => setPaymentMethod('upi')} 
                  />
                  <Wallet size={20} />
                  <span>UPI Payment</span>
                  <span className="payment-radio-label-icon">⚡</span>
                </label>

                <label className={`payment-radio-label ${paymentMethod === 'cod' ? 'selected' : ''}`}>
                  <input 
                    type="radio" 
                    name="payment" 
                    value="cod" 
                    checked={paymentMethod === 'cod'} 
                    onChange={() => setPaymentMethod('cod')} 
                  />
                  <Truck size={20} />
                  <span>Cash on Delivery</span>
                  <span className="payment-radio-label-icon">💵</span>
                </label>
              </div>
            </div>

            <button type="submit" className="btn-primary" style={{ width: '100%', height: '54px', marginTop: '20px' }}>
              Confirm & Pay ${(getCartTotal()).toFixed(2)}
            </button>
          </form>

          {/* Right Column: Mini Order Review */}
          <div className="review-panel">
            <h3 className="summary-title" style={{ fontSize: '18px', paddingBottom: '12px', marginBottom: '16px' }}>Review Your Order</h3>
            <div className="review-items-list">
              {cart.map(item => (
                <div key={item.product.id} className="review-item">
                  <div className="review-item-details">
                    <span className="review-item-name">{item.product.name}</span>
                    <span className="review-item-qty">Qty: {item.quantity}</span>
                  </div>
                  <span className="review-item-price">${(item.product.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="summary-divider"></div>

            <div className="summary-row">
              <span>Subtotal</span>
              <span>${getCartSubtotal().toFixed(2)}</span>
            </div>

            {getDiscountAmount() > 0 && (
              <div className="summary-row discount">
                <span>Discount</span>
                <span>-${getDiscountAmount().toFixed(2)}</span>
              </div>
            )}

            <div className="summary-row">
              <span>Delivery Fee</span>
              <span>
                {getDeliveryFee() === 0 ? 'FREE' : `$${getDeliveryFee().toFixed(2)}`}
              </span>
            </div>

            <div className="summary-divider"></div>

            <div className="summary-total" style={{ marginBottom: '16px', fontSize: '18px' }}>
              <span>Total</span>
              <span>${getCartTotal().toFixed(2)}</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', fontSize: '13px', justifyContent: 'center' }}>
              <ShieldCheck size={16} style={{ color: 'var(--accent-success)' }} /> Securing checkout using 256-bit encryption
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
