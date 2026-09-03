import { Link } from 'react-router-dom';
import { Calendar, MapPin, ArrowRight, RotateCcw, PackageCheck, Clock } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function Orders() {
  const { orders, addToCart } = useCart();

  const handleReorder = (items) => {
    items.forEach(item => {
      addToCart(item.product, item.quantity);
    });
  };

  if (!orders || orders.length === 0) {
    return (
      <div className="container anim-fade-in" style={{ padding: '60px 0' }}>
        <div className="empty-state">
          <div className="empty-state-icon">
            <PackageCheck size={40} />
          </div>
          <h3>No Orders Yet</h3>
          <p>You haven't placed any orders yet. Check out our exquisite menu and enjoy mouth-watering delicacies delivered fast!</p>
          <Link to="/" className="btn-primary">
            Explore Menu
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container anim-fade-in">
      <div className="section-header" style={{ marginBottom: '24px' }}>
        <div>
          <span className="card-category" style={{ display: 'block', marginBottom: '8px' }}>Your Activity</span>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '36px' }}>Order History</h2>
        </div>
        <div style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
          <strong>{orders.length}</strong> {orders.length === 1 ? 'order' : 'orders'} placed
        </div>
      </div>

      <div className="orders-list">
        {orders.map((order) => {
          const { id, date, items, deliveryInfo, pricing, status } = order;
          return (
            <div key={id} className="order-history-card anim-slide-up">
              <div className="order-history-header">
                <div>
                  <div className="order-id-badge">Order ID: #{id}</div>
                  <div className="order-date-text">
                    <Calendar size={14} /> {new Date(date).toLocaleDateString()} at {new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>

                <div className="order-header-right">
                  <span className="order-status-pill status-placed">
                    <Clock size={14} /> {status || 'Placed'}
                  </span>
                  <div className="order-total-price">${pricing.total.toFixed(2)}</div>
                </div>
              </div>

              <div className="order-items-preview">
                {items.map((item, index) => (
                  <div key={index} className="order-item-chip">
                    <img src={item.product.image} alt={item.product.name} />
                    <div className="order-chip-info">
                      <span className="chip-name">{item.product.name}</span>
                      <span className="chip-qty">Qty: {item.quantity} × ${item.product.price.toFixed(2)}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="order-history-footer">
                <div className="order-delivery-snippet">
                  <MapPin size={15} style={{ color: 'var(--primary)', flexShrink: 0 }} />
                  <span>Delivered to <strong>{deliveryInfo.address}, {deliveryInfo.city}</strong></span>
                </div>

                <div className="order-actions-group">
                  <Link 
                    to="/order-confirmation" 
                    state={{ order }} 
                    className="btn-secondary" 
                    style={{ padding: '8px 16px', fontSize: '13px' }}
                  >
                    View Status Tracker <ArrowRight size={14} />
                  </Link>

                  <button
                    onClick={() => handleReorder(items)}
                    className="btn-primary"
                    style={{ padding: '8px 16px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}
                    title="Add all items from this order to cart"
                  >
                    <RotateCcw size={14} /> Reorder All
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
