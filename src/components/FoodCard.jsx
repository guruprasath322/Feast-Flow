import { Star, Clock, ShoppingCart, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function FoodCard({ food }) {
  const { addToCart, toggleFavorite, isFavorite } = useCart();
  const { id, name, price, rating, prepTime, category, description, image, popular } = food;
  const favorite = isFavorite(id);

  const handleAddToCart = (e) => {
    e.preventDefault(); // prevent routing to detail page when clicking add to cart
    addToCart(food, 1);
  };

  const handleToggleFav = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(food);
  };

  return (
    <Link to={`/food/${id}`} className="food-card anim-slide-up">
      <div className="card-img-wrapper">
        <img src={image} alt={name} loading="lazy" />
        {popular && <div className="card-badge-popular">Popular</div>}
        <button 
          onClick={handleToggleFav}
          className={`card-fav-btn ${favorite ? 'active' : ''}`}
          title={favorite ? "Remove from favorites" : "Add to favorites"}
          aria-label={favorite ? `Remove ${name} from favorites` : `Add ${name} to favorites`}
        >
          <Heart size={16} fill={favorite ? "var(--primary)" : "none"} color={favorite ? "var(--primary)" : "#ffffff"} />
        </button>
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

