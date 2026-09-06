import { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Check, Calendar, MapPin, ChevronRight, Home as HomeIcon } from 'lucide-react';

export default function OrderConfirmation() {
  const location = useLocation();
  const order = location.state?.order;

  const [step, setStep] = useState(1); // 1 = Placed, 2 = Preparing, 3 = Out for Delivery, 4 = Delivered

  useEffect(() => {
    if (!order) return;

    // Simulate food preparation stages
    const timer1 = setTimeout(() => setStep(2), 5000);  // Preparing in 5s
    const timer2 = setTimeout(() => setStep(3), 12000); // Out for Delivery in 12s
    const timer3 = setTimeout(() => setStep(4), 22000); // Delivered in 22s

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [order]);

  if (!order) {
    return (
      <div className="container spinner-wrapper" style={{ padding: '60px 0' }}>
        <h2>No Active Orders</h2>
        <p>You haven't placed an order recently or your session has expired.</p>
        <Link to="/" className="btn-primary">
          <HomeIcon size={18} /> Go to Menu
        </Link>
      </div>
    );
  }

  const { id, date, items, deliveryInfo, pricing } = order;

  // Calculate timeline progress width
  const getProgressWidth = () => {
    if (step === 1) return '0%';
    if (step === 2) return '33.33%';
    if (step === 3) return '66.66%';
    return '100%';
  };

  return (
    <div className="container anim-fade-in">
      <div className="confirmation-card">
        {/* Animated Checkmark */}
        <div className="success-icon-wrapper">
          <Check size={40} strokeWidth={3} />
        </div>

        <h2>Order Placed Successfully!</h2>
        <p>Thank you for choosing FeastFlow. Your order has been registered and is being sent to the kitchen.</p>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginBottom: '30px', fontSize: '14px', color: 'var(--text-muted)' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Calendar size={16} /> {new Date(date).toLocaleDateString()}
          </span>
          <span>•</span>
          <span>Order ID: <strong>{id}</strong></span>
        </div>

        {/* Simulated Delivery Timeline */}
        <h4 style={{ textAlign: 'left', marginBottom: '16px', fontWeight: '700' }}>Live Delivery Tracker</h4>
        <div className="tracking-timeline">
          <div className="tracking-progress-bar" style={{ width: getProgressWidth() }}></div>
          
          <div className={`timeline-step ${step >= 1 ? 'active' : ''} ${step > 1 ? 'completed' : ''}`}>
            <div className="step-dot">
              {step > 1 ? <Check size={14} /> : 1}
            </div>
            <span className="step-label">Placed</span>
          </div>

          <div className={`timeline-step ${step >= 2 ? 'active' : ''} ${step > 2 ? 'completed' : ''}`}>
            <div className="step-dot">
              {step > 2 ? <Check size={14} /> : 2}
            </div>
            <span className="step-label">Preparing</span>
          </div>

          <div className={`timeline-step ${step >= 3 ? 'active' : ''} ${step > 3 ? 'completed' : ''}`}>
            <div className="step-dot">
              {step > 3 ? <Check size={14} /> : 3}
            </div>
            <span className="step-label">Out for Delivery</span>
          </div>

          <div className={`timeline-step ${step >= 4 ? 'active' : ''}`}>
            <div className="step-dot">
              {step >= 4 ? <Check size={14} /> : 4}
            </div>
            <span className="step-label">Delivered</span>
          </div>
        </div>

        {/* Delivery Details */}
        <div className="order-receipt" style={{ marginBottom: '24px' }}>
          <div className="receipt-header" style={{ border: 'none', padding: 0, marginBottom: '8px' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><MapPin size={16} style={{ color: 'var(--primary)' }} /> Delivery Address</span>
          </div>
          <div style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: '1.5' }}>
            <strong>{deliveryInfo.name}</strong><br />
            {deliveryInfo.address}, {deliveryInfo.city} - {deliveryInfo.zipCode}<br />
            Phone: {deliveryInfo.phone}
          </div>
        </div>

        {/* Order Receipt Details */}
        <div className="order-receipt">
          <div className="receipt-header">
            <span>Recipe Receipt Summary</span>
            <span>Quantity</span>
          </div>
          
          {items.map(item => (
            <div key={item.product.id} className="receipt-item">
              <span className="receipt-item-name">{item.product.name}</span>
              <span>{item.quantity} x ${item.product.price.toFixed(2)}</span>
            </div>
          ))}

          <div className="receipt-total">
            <span>Total Paid ({deliveryInfo.paymentMethod.toUpperCase()})</span>
            <span>${pricing.total.toFixed(2)}</span>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '24px' }}>
          <Link 
            to={`/track/${id}`} 
            state={{ order }} 
            className="btn-primary" 
            style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
          >
            Open Interactive Live Tracker <ChevronRight size={18} />
          </Link>
          <Link 
            to="/" 
            className="btn-secondary" 
            style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
          >
            Order Something Else <ChevronRight size={18} />
          </Link>
        </div>
      </div>
    </div>
  );
}
