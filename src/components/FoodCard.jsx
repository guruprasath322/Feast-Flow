import React from 'react';
import { Star, Clock, ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function FoodCard({ food }) {
  const { addToCart } = useCart();
  const { id, name, price, rating, prepTime, category, description, image, popular } = food;

  const handleAddToCart = (e) => {
    e.preventDefault(); // prevent routing to detail page when clicking add to cart
    addToCart(food, 1);
  };

  return (
    <Link to={`/food/${id}`} className="food-card anim-slide-up">
      <div className="card-img-wrapper">
        <img src={image} alt={name} loading="lazy" />
        {popular && <div className="card-badge-popular">Popular</div>}
      </div>

      <div className="card-content">
        <div className="card-meta">
          <span className="card-category">{category}</span>
          <div className="card-rating-wrapper">
            <Star size={16} fill="var(--accent-rating)" stroke="var(--accent-rating)" />
            {rating}
          </div>
        </div>

        <h3 className="card-title">{name}</h3>
        <p className="card-desc">{description}</p>

        <div className="card-footer">
          <div className="card-price">
            <span>$</span>{price.toFixed(2)}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '13px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Clock size={14} />
              {prepTime}
            </span>
            <button 
              onClick={handleAddToCart} 
              className="add-cart-btn" 
              title="Add to cart"
              aria-label={`Add ${name} to cart`}
            >
              <ShoppingCart size={18} />
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}
