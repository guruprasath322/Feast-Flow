import { useState, useEffect, useMemo } from 'react';
import { useParams, useLocation, Link, useNavigate } from 'react-router-dom';
import { 
  Bike, ChefHat, CheckCircle2, Clock, Phone, MessageSquare, 
  MapPin, ShieldCheck, Search, ArrowLeft, 
  Sparkles, Navigation, Check, Package, Utensils
} from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function OrderTracking() {
  const { orderId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { orders } = useCart();

  // Selected order determination
  const activeOrder = useMemo(() => {
    if (orderId && orders?.length > 0) {
      const found = orders.find(o => o.id.toLowerCase() === orderId.toLowerCase());
      if (found) return found;
    }
    if (location.state?.order) {
      return location.state.order;
    }
    if (orders && orders.length > 0) {
      return orders[0];
    }
    return null;
  }, [orderId, location.state, orders]);

  const [searchId, setSearchId] = useState('');
  const [currentStep, setCurrentStep] = useState(2); // 1 = Placed, 2 = Preparing, 3 = On the Way, 4 = Delivered
  const [secondsRemaining, setSecondsRemaining] = useState(1140); // ~19 mins
  const [driverModal, setDriverModal] = useState(null); // 'call' | 'message' | null
  const [chatMessages, setChatMessages] = useState([
    { sender: 'driver', text: "Hi! I've picked up your order and I'm heading your way safely!", time: 'Just now' }
  ]);
  const [chatInput, setChatInput] = useState('');

  // Countdown timer simulation
  useEffect(() => {
    if (currentStep === 4) return;
    const interval = setInterval(() => {
      setSecondsRemaining(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [currentStep]);

  // Stage simulation automation
  useEffect(() => {
    if (!activeOrder) return;
    // Auto simulate progression over time
    const timer1 = setTimeout(() => {
      if (currentStep < 2) setCurrentStep(2);
    }, 4000);
    const timer2 = setTimeout(() => {
      if (currentStep < 3) setCurrentStep(3);
    }, 14000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [activeOrder, currentStep]);

  const formatCountdown = (secs) => {
    const mins = Math.floor(secs / 60);
    const remainderSecs = secs % 60;
    return `${mins}m ${remainderSecs < 10 ? '0' : ''}${remainderSecs}s`;
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchId.trim()) return;
    const found = orders?.find(o => o.id.toLowerCase().includes(searchId.trim().toLowerCase()));
    if (found) {
      navigate(`/track/${found.id}`);
      setSearchId('');
    } else {
      alert(`Order "${searchId}" was not found in your saved records.`);
    }
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    const userMsg = { sender: 'user', text: chatInput.trim(), time: 'Just now' };
    setChatMessages(prev => [...prev, userMsg]);
    setChatInput('');

    setTimeout(() => {
      setChatMessages(prev => [
        ...prev,
        { sender: 'driver', text: "Thanks for the note! I will make sure everything is handled with care.", time: 'Just now' }
      ]);
    }, 1200);
  };

  if (!activeOrder) {
    return (
      <div className="container anim-fade-in" style={{ padding: '60px 0' }}>
        <div className="empty-state tracking-empty-card">
          <div className="empty-state-icon">
            <Navigation size={40} className="pulse-icon" />
          </div>
          <h3>No Active Delivery to Track</h3>
          <p>You haven't placed an order yet or no order matches this ID. Explore our freshly made dishes!</p>
          
          <div className="tracking-search-box" style={{ maxWidth: '420px', margin: '20px auto' }}>
            <form onSubmit={handleSearch} style={{ display: 'flex', gap: '8px' }}>
              <input 
                type="text" 
                placeholder="Enter Order ID (e.g. ORD-123456)" 
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                className="input-field"
                style={{ marginBottom: 0 }}
              />
              <button type="submit" className="btn-primary" style={{ padding: '10px 18px', whiteSpace: 'nowrap' }}>
                <Search size={16} /> Look Up
              </button>
            </form>
          </div>

          <Link to="/" className="btn-secondary" style={{ marginTop: '12px' }}>
            <ArrowLeft size={16} /> Browse Menu
          </Link>
        </div>
      </div>
    );
  }

  const { id, date, items, deliveryInfo, pricing } = activeOrder;

  // Calculate live map marker position based on step
  const getRiderProgress = () => {
    switch (currentStep) {
      case 1: return 10;
      case 2: return 35;
      case 3: return 72;
      case 4: return 100;
      default: return 20;
    }
  };

  return (
    <div className="container anim-fade-in tracking-page-wrapper">
      {/* Page Header */}
      <div className="tracking-page-header">
        <div>
          <Link to="/orders" className="back-link">
            <ArrowLeft size={16} /> Back to Order History
          </Link>
          <h1 className="tracking-title">Live Delivery Tracker</h1>
          <p className="tracking-subtitle">
            Tracking Order <span className="order-tag">#{id}</span> • Placed {new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>

        {/* Order Selector dropdown if user has multiple orders */}
        {orders?.length > 1 && (
          <div className="order-switcher">
            <label htmlFor="order-select">Select Order:</label>
            <select 
              id="order-select" 
              value={activeOrder.id} 
              onChange={(e) => navigate(`/track/${e.target.value}`)}
              className="order-select-dropdown"
            >
              {orders.map(o => (
                <option key={o.id} value={o.id}>
                  #{o.id} (${o.pricing?.total?.toFixed(2) || '0.00'}) - {new Date(o.date).toLocaleDateString()}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      <div className="tracking-grid">
        {/* Left Column: Live Map Simulation & Visual Stages */}
        <div className="tracking-main-col">
          {/* Status banner with ETA */}
          <div className="eta-card anim-slide-up">
            <div className="eta-content">
              <div className="eta-badge">
                <span className="live-dot"></span> LIVE STATUS
              </div>
              <h2 className="eta-headline">
                {currentStep === 1 && "Order Placed & Awaiting Confirmation"}
                {currentStep === 2 && "Kitchen is Preparing Your Feast"}
                {currentStep === 3 && "Courier is On The Way!"}
                {currentStep === 4 && "Order Delivered! Bon Appétit! 🎉"}
              </h2>
              <p className="eta-subtext">
                {currentStep < 4 
                  ? `Estimated Arrival in ${formatCountdown(secondsRemaining)}`
                  : `Delivered at ${deliveryInfo.address}, ${deliveryInfo.city}`}
              </p>
            </div>

            <div className="eta-progress-badge">
              <Clock size={20} />
              <span>{currentStep === 4 ? 'Complete' : `${Math.round(getRiderProgress())}% Finished`}</span>
            </div>
          </div>

          {/* Interactive Simulated Map Canvas */}
          <div className="tracking-map-card">
            <div className="map-canvas-container">
              {/* Stylized vector map elements */}
              <div className="map-grid-bg"></div>
              <div className="map-road-network">
                <svg viewBox="0 0 800 320" className="map-route-svg">
                  <defs>
                    <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="var(--primary)" />
                      <stop offset="100%" stopColor="#10b981" />
                    </linearGradient>
                  </defs>
                  {/* Road Path */}
                  <path 
                    d="M 80 160 C 200 60, 320 260, 440 140 S 640 220, 720 160" 
                    fill="none" 
                    stroke="var(--border)" 
                    strokeWidth="12" 
                    strokeLinecap="round"
                  />
                  {/* Traveled Active Route */}
                  <path 
                    d="M 80 160 C 200 60, 320 260, 440 140 S 640 220, 720 160" 
                    fill="none" 
                    stroke="url(#routeGradient)" 
                    strokeWidth="8" 
                    strokeDasharray="800"
                    strokeDashoffset={800 - (800 * (getRiderProgress() / 100))}
                    strokeLinecap="round"
                    className="route-active-line"
                  />
                </svg>

                {/* Restaurant Hub Pin */}
                <div className="map-pin restaurant-pin" style={{ left: '10%', top: '50%' }}>
                  <div className="pin-tooltip">FeastFlow Kitchen</div>
                  <div className="pin-icon-wrapper restaurant-icon">
                    <Utensils size={18} />
                  </div>
                </div>

                {/* Destination Pin */}
                <div className="map-pin destination-pin" style={{ left: '90%', top: '50%' }}>
                  <div className="pin-tooltip">{deliveryInfo.name}'s Place</div>
                  <div className="pin-icon-wrapper destination-icon">
                    <MapPin size={18} />
                  </div>
                </div>

                {/* Dynamic Courier Marker */}
                <div 
                  className={`courier-marker ${currentStep === 4 ? 'arrived' : 'moving'}`}
                  style={{ 
                    left: `${getRiderProgress()}%`,
                    top: currentStep === 1 ? '50%' : currentStep === 2 ? '40%' : currentStep === 3 ? '45%' : '50%'
                  }}
                >
                  <div className="radar-pulse"></div>
                  <div className="courier-vehicle-icon">
                    <Bike size={20} />
                  </div>
                  <div className="courier-badge">
                    {currentStep === 4 ? 'Delivered' : 'Rider En Route'}
                  </div>
                </div>
              </div>
            </div>

            {/* Map Simulation Info Strip */}
            <div className="map-footer-strip">
              <div className="route-info-item">
                <span className="route-label">Destination</span>
                <span className="route-val">{deliveryInfo.address}, {deliveryInfo.city}</span>
              </div>
              <div className="route-divider"></div>
              <div className="route-info-item">
                <span className="route-label">Distance Left</span>
                <span className="route-val">{currentStep === 4 ? '0.0 miles' : currentStep === 3 ? '1.2 miles' : '2.8 miles'}</span>
              </div>
              <div className="route-divider"></div>
              <div className="route-info-item">
                <span className="route-label">Safety Guarantee</span>
                <span className="route-val text-green">
                  <ShieldCheck size={14} style={{ display: 'inline', verticalAlign: 'middle' }} /> Contactless & Sealed
                </span>
              </div>
            </div>
          </div>

          {/* Stepper Pipeline */}
          <div className="tracking-timeline-card">
            <h3 className="section-subtitle">Delivery Milestones</h3>
            <div className="steps-container">
              {/* Step 1 */}
              <div className={`step-item ${currentStep >= 1 ? 'active' : ''} ${currentStep > 1 ? 'completed' : ''}`}>
                <div className="step-circle">
                  {currentStep > 1 ? <Check size={16} /> : <Package size={16} />}
                </div>
                <div className="step-details">
                  <h4 className="step-title">Order Confirmed</h4>
                  <p className="step-desc">Order #{id} received and queued.</p>
                </div>
              </div>

              {/* Step 2 */}
              <div className={`step-item ${currentStep >= 2 ? 'active' : ''} ${currentStep > 2 ? 'completed' : ''}`}>
                <div className="step-circle">
                  {currentStep > 2 ? <Check size={16} /> : <ChefHat size={16} />}
                </div>
                <div className="step-details">
                  <h4 className="step-title">Kitchen Preparing</h4>
                  <p className="step-desc">Fresh ingredients being cooked to perfection.</p>
                </div>
              </div>

              {/* Step 3 */}
              <div className={`step-item ${currentStep >= 3 ? 'active' : ''} ${currentStep > 3 ? 'completed' : ''}`}>
                <div className="step-circle">
                  {currentStep > 3 ? <Check size={16} /> : <Bike size={16} />}
                </div>
                <div className="step-details">
                  <h4 className="step-title">Out for Delivery</h4>
                  <p className="step-desc">Driver is navigating towards your location.</p>
                </div>
              </div>

              {/* Step 4 */}
              <div className={`step-item ${currentStep >= 4 ? 'active' : ''} ${currentStep === 4 ? 'completed' : ''}`}>
                <div className="step-circle">
                  <CheckCircle2 size={16} />
                </div>
                <div className="step-details">
                  <h4 className="step-title">Delivered</h4>
                  <p className="step-desc">Enjoy your delicious meal!</p>
                </div>
              </div>
            </div>

            {/* Simulation Controller for demo purposes */}
            <div className="simulation-toolbar">
              <span className="sim-label"><Sparkles size={14} /> Stage Simulator:</span>
              <div className="sim-buttons">
                <button 
                  onClick={() => setCurrentStep(1)} 
                  className={`btn-sim ${currentStep === 1 ? 'active' : ''}`}
                >
                  1. Placed
                </button>
                <button 
                  onClick={() => setCurrentStep(2)} 
                  className={`btn-sim ${currentStep === 2 ? 'active' : ''}`}
                >
                  2. Cooking
                </button>
                <button 
                  onClick={() => setCurrentStep(3)} 
                  className={`btn-sim ${currentStep === 3 ? 'active' : ''}`}
                >
                  3. Out
                </button>
                <button 
                  onClick={() => setCurrentStep(4)} 
                  className={`btn-sim ${currentStep === 4 ? 'active' : ''}`}
                >
                  4. Delivered
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Driver Profile, Order Receipt & Live Chat */}
        <div className="tracking-side-col">
          {/* Driver Contact Card */}
          <div className="driver-card anim-slide-up">
            <div className="driver-header">
              <div className="driver-avatar-wrap">
                <img 
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80" 
                  alt="Delivery Partner Alex" 
                  className="driver-avatar"
                />
                <span className="driver-online-badge"></span>
              </div>
              <div className="driver-info">
                <h4 className="driver-name">Alex Vance</h4>
                <div className="driver-meta">
                  <span className="driver-rating">⭐ 4.9 (420+ trips)</span>
                  <span className="driver-vehicle">• Electric Scooter</span>
                </div>
              </div>
            </div>

            <div className="driver-actions">
              <button 
                onClick={() => setDriverModal('call')} 
                className="btn-driver btn-call"
                title="Simulate Call"
              >
                <Phone size={16} /> Call Driver
              </button>
              <button 
                onClick={() => setDriverModal('message')} 
                className="btn-driver btn-msg"
                title="Chat with Driver"
              >
                <MessageSquare size={16} /> Message
              </button>
            </div>
          </div>

          {/* Activity / Notification Feed */}
          <div className="activity-card">
            <h4 className="card-heading">Live Order Updates</h4>
            <div className="activity-feed">
              <div className="activity-entry">
                <span className="entry-dot dot-green"></span>
                <div className="entry-content">
                  <div className="entry-msg">Order registered in the system</div>
                  <div className="entry-time">{new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                </div>
              </div>

              {currentStep >= 2 && (
                <div className="activity-entry anim-slide-up">
                  <span className="entry-dot dot-primary"></span>
                  <div className="entry-content">
                    <div className="entry-msg">Chef started cooking {items.length} item{items.length > 1 ? 's' : ''}</div>
                    <div className="entry-time">2 mins ago</div>
                  </div>
                </div>
              )}

              {currentStep >= 3 && (
                <div className="activity-entry anim-slide-up">
                  <span className="entry-dot dot-orange"></span>
                  <div className="entry-content">
                    <div className="entry-msg">Alex Vance picked up the package & verified insulation seal</div>
                    <div className="entry-time">Just now</div>
                  </div>
                </div>
              )}

              {currentStep >= 4 && (
                <div className="activity-entry anim-slide-up">
                  <span className="entry-dot dot-delivered"></span>
                  <div className="entry-content">
                    <div className="entry-msg">Package delivered safely at doorstep!</div>
                    <div className="entry-time">Now</div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Order Summary & Items List */}
          <div className="order-summary-card">
            <div className="summary-top">
              <h4 className="card-heading" style={{ margin: 0 }}>Order Summary</h4>
              <span className="items-count-badge">{items.length} {items.length === 1 ? 'item' : 'items'}</span>
            </div>

            <div className="tracking-items-list">
              {items.map((item, idx) => (
                <div key={idx} className="tracking-item-row">
                  <img src={item.product.image} alt={item.product.name} className="item-thumb" />
                  <div className="item-meta">
                    <span className="item-name">{item.product.name}</span>
                    <span className="item-sub">Qty: {item.quantity} × ${item.product.price.toFixed(2)}</span>
                  </div>
                  <div className="item-price">
                    ${(item.quantity * item.product.price).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>

            <div className="summary-pricing-footer">
              <div className="pricing-line">
                <span>Subtotal</span>
                <span>${pricing.subtotal.toFixed(2)}</span>
              </div>
              {pricing.discount > 0 && (
                <div className="pricing-line discount-line">
                  <span>Discount</span>
                  <span>-${pricing.discount.toFixed(2)}</span>
                </div>
              )}
              <div className="pricing-line">
                <span>Delivery Fee</span>
                <span>{pricing.deliveryFee === 0 ? 'FREE' : `$${pricing.deliveryFee.toFixed(2)}`}</span>
              </div>
              <div className="pricing-line total-line">
                <span>Total Paid ({deliveryInfo.paymentMethod.toUpperCase()})</span>
                <span className="total-amount">${pricing.total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Driver Interactive Modal (Call / Message simulation) */}
      {driverModal && (
        <div className="modal-backdrop" onClick={() => setDriverModal(null)}>
          <div className="modal-card anim-scale-up" onClick={e => e.stopPropagation()}>
            {driverModal === 'call' ? (
              <div className="call-modal-content">
                <div className="call-avatar-wrap">
                  <img 
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80" 
                    alt="Driver Alex" 
                    className="call-avatar"
                  />
                  <div className="call-rings"></div>
                </div>
                <h3>Calling Alex Vance...</h3>
                <p className="call-subtitle">FeastFlow Masked Number: +1 (555) 392-8819</p>
                <div className="call-status">Connected • High Definition Audio</div>

                <div className="call-buttons">
                  <button onClick={() => setDriverModal(null)} className="btn-end-call">
                    End Call
                  </button>
                </div>
              </div>
            ) : (
              <div className="chat-modal-content">
                <div className="chat-modal-header">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <img 
                      src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80" 
                      alt="Driver Alex" 
                      className="chat-header-avatar"
                    />
                    <div>
                      <h4 style={{ margin: 0, fontSize: '15px' }}>Alex Vance (Driver)</h4>
                      <span style={{ fontSize: '12px', color: '#10b981' }}>● Active on route</span>
                    </div>
                  </div>
                  <button onClick={() => setDriverModal(null)} className="btn-close-modal">✕</button>
                </div>

                <div className="chat-messages-area">
                  {chatMessages.map((msg, i) => (
                    <div key={i} className={`chat-bubble ${msg.sender === 'user' ? 'user' : 'driver'}`}>
                      <div className="bubble-text">{msg.text}</div>
                      <div className="bubble-time">{msg.time}</div>
                    </div>
                  ))}
                </div>

                <form onSubmit={handleSendMessage} className="chat-input-row">
                  <input 
                    type="text" 
                    placeholder="Leave a note or gate code for Alex..." 
                    value={chatInput} 
                    onChange={e => setChatInput(e.target.value)}
                    className="chat-input"
                  />
                  <button type="submit" className="btn-primary" style={{ padding: '8px 16px' }}>
                    Send
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
