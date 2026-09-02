import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Star, Clock, Flame, Shield, Minus, Plus, ShoppingCart } from 'lucide-react';
import { foodData } from '../data/foodData';
import { useCart } from '../context/CartContext';
import FoodCard from '../components/FoodCard';

export default function FoodDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [addedFeedback, setAddedFeedback] = useState(false);

  // Find current food item
  const food = foodData.find(item => item.id === parseInt(id));

  // Reset quantity when viewing a new item
  useEffect(() => {
    setQuantity(1);
    setAddedFeedback(false);
    window.scrollTo(0, 0);
  }, [id]);

  if (!food) {
    return (
      <div className="container spinner-wrapper">
        <h2>Dish Not Found</h2>
        <p>The culinary delight you are looking for does not exist or has been removed.</p>
        <Link to="/" className="btn-primary">
          <ArrowLeft size={18} /> Back to Menu
        </Link>
      </div>
    );
  }

  const { name, price, rating, prepTime, category, description, ingredients, image, calories, popular } = food;

  const handleIncrement = () => setQuantity(prev => prev + 1);
  const handleDecrement = () => setQuantity(prev => prev > 1 ? prev - 1 : 1);

  const handleAddToCart = () => {
    addToCart(food, quantity);
    setAddedFeedback(true);
    setTimeout(() => {
      setAddedFeedback(false);
    }, 2000);
  };

  // Get recommended food items (same category, excluding current item)
  const recommendations = foodData
    .filter(item => item.category === category && item.id !== food.id)
    .slice(0, 3);

  return (
    <div className="container anim-fade-in">
      <Link to="/" className="details-back-link">
        <ArrowLeft size={16} /> Back to Menu
      </Link>

      <div className="details-wrapper">
        {/* Left column: Image */}
        <div className="details-image-container anim-pop-in">
          <img src={image} alt={name} />
        </div>

        {/* Right column: Specs and purchase */}
        <div className="details-info">
          <span className="details-category">{category}</span>
          <h2 className="details-title">{name}</h2>
          
          <div className="details-meta-grid">
            <div className="details-meta-item">
              <span className="details-meta-label">Rating</span>
              <span className="details-meta-val" style={{ color: 'var(--accent-rating)' }}>
                <Star size={16} fill="var(--accent-rating)" stroke="var(--accent-rating)" />
                {rating}
              </span>
            </div>
            <div className="details-meta-item">
              <span className="details-meta-label">Prep Time</span>
              <span className="details-meta-val">
                <Clock size={16} />
                {prepTime}
              </span>
            </div>
            <div className="details-meta-item">
              <span className="details-meta-label">Calories</span>
              <span className="details-meta-val">
                <Flame size={16} style={{ color: 'var(--primary)' }} />
                {calories} kcal
              </span>
            </div>
          </div>

          <p className="details-desc">{description}</p>

          <div className="details-ingredients">
            <h4>Ingredients</h4>
            <div className="ingredients-list">
              {ingredients.map((ing, i) => (
                <span key={i} className="ingredient-tag">{ing}</span>
              ))}
            </div>
          </div>

          <div className="details-purchase-zone">
            <div className="price-box">
              <span>Total Price</span>
              <span>${(price * quantity).toFixed(2)}</span>
            </div>

            <div style={{ display: 'flex', gap: '12px', flex: 1, alignItems: 'center' }}>
              <div className="quantity-picker">
                <button 
                  onClick={handleDecrement} 
                  className="quantity-btn" 
                  disabled={quantity <= 1}
                  aria-label="Decrease quantity"
                >
                  <Minus size={16} />
                </button>
                <span className="quantity-val">{quantity}</span>
                <button 
                  onClick={handleIncrement} 
                  className="quantity-btn" 
                  aria-label="Increase quantity"
                >
                  <Plus size={16} />
                </button>
              </div>

              <button 
                onClick={handleAddToCart} 
                className="btn-primary details-add-btn"
                style={{
                  backgroundColor: addedFeedback ? 'var(--accent-success)' : 'var(--primary)',
                  boxShadow: addedFeedback ? '0 8px 30px rgba(16, 185, 129, 0.25)' : 'var(--shadow-primary)'
                }}
              >
                <ShoppingCart size={18} />
                {addedFeedback ? 'Added to Cart!' : 'Add to Cart'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Recommendations Section */}
      {recommendations.length > 0 && (
        <section className="catalog-section" style={{ marginTop: '60px' }}>
          <span className="card-category">More Delights</span>
          <h3 className="details-title" style={{ fontSize: '28px', marginBottom: '24px' }}>You May Also Like</h3>
          <div className="food-grid">
            {recommendations.map(item => (
              <FoodCard key={item.id} food={item} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
