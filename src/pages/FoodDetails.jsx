import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Star, Clock, Flame, Minus, Plus, ShoppingCart, MessageSquare, ThumbsUp, CheckCircle, Send } from 'lucide-react';
import { foodData } from '../data/foodData';
import { useCart } from '../context/CartContext';
import FoodCard from '../components/FoodCard';

const INITIAL_REVIEWS = [
  {
    id: 1,
    name: "Alex Morgan",
    rating: 5,
    date: "2 days ago",
    comment: "Absolutely delicious! Arrived piping hot and the flavors were gourmet restaurant quality.",
    likes: 14,
    verified: true
  },
  {
    id: 2,
    name: "Sophia Chen",
    rating: 5,
    date: "1 week ago",
    comment: "The ingredients were so fresh and authentic. Definitely ordering this again for our family dinner!",
    likes: 9,
    verified: true
  },
  {
    id: 3,
    name: "Marcus Vance",
    rating: 4,
    date: "2 weeks ago",
    comment: "Great taste and prompt delivery. Generous portion size as well.",
    likes: 5,
    verified: true
  }
];

export default function FoodDetails() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [addedFeedback, setAddedFeedback] = useState(false);
  const [reviews, setReviews] = useState(INITIAL_REVIEWS);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewName, setReviewName] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  // Find current food item
  const food = foodData.find(item => item.id === parseInt(id));

  // Reset quantity and review form state when viewing a new item
  useEffect(() => {
    setQuantity(1);
    setAddedFeedback(false);
    setShowReviewForm(false);
    setReviewSubmitted(false);
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

  const { name, price, rating, prepTime, category, description, ingredients, image, calories } = food;

  const handleIncrement = () => setQuantity(prev => prev + 1);
  const handleDecrement = () => setQuantity(prev => prev > 1 ? prev - 1 : 1);

  const handleAddToCart = () => {
    addToCart(food, quantity);
    setAddedFeedback(true);
    setTimeout(() => {
      setAddedFeedback(false);
    }, 2000);
  };

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (!reviewName.trim() || !reviewComment.trim()) return;

    const newRev = {
      id: Date.now(),
      name: reviewName.trim(),
      rating: reviewRating,
      date: "Just now",
      comment: reviewComment.trim(),
      likes: 0,
      verified: true
    };

    setReviews([newRev, ...reviews]);
    setReviewName('');
    setReviewComment('');
    setReviewSubmitted(true);
    setTimeout(() => {
      setShowReviewForm(false);
      setReviewSubmitted(false);
    }, 1800);
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

      {/* Customer Reviews & Ratings Section */}
      <section className="reviews-section anim-slide-up">
        <div className="reviews-header">
          <div>
            <span className="card-category">Customer Voices</span>
            <h3 className="details-title" style={{ fontSize: '28px' }}>Verified Reviews & Ratings</h3>
          </div>
          <button 
            onClick={() => setShowReviewForm(!showReviewForm)}
            className="btn-secondary"
          >
            <MessageSquare size={16} />
            {showReviewForm ? "Close Form" : "Write a Review"}
          </button>
        </div>

        {/* Review Form */}
        {showReviewForm && (
          <form onSubmit={handleReviewSubmit} className="review-form anim-pop-in">
            <h4>Share Your Culinary Experience</h4>
            {reviewSubmitted ? (
              <div className="review-success-badge">
                <CheckCircle size={20} /> Thank you! Your review has been submitted.
              </div>
            ) : (
              <>
                <div className="form-group-row">
                  <div className="form-group" style={{ flex: 1 }}>
                    <label>Your Name</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Sarah Jenkins" 
                      value={reviewName}
                      onChange={(e) => setReviewName(e.target.value)}
                      required 
                    />
                  </div>
                  <div className="form-group" style={{ width: '160px' }}>
                    <label>Rating</label>
                    <select 
                      value={reviewRating} 
                      onChange={(e) => setReviewRating(Number(e.target.value))}
                      className="rating-select"
                    >
                      <option value={5}>⭐⭐⭐⭐⭐ (5/5)</option>
                      <option value={4}>⭐⭐⭐⭐ (4/5)</option>
                      <option value={3}>⭐⭐⭐ (3/5)</option>
                      <option value={2}>⭐⭐ (2/5)</option>
                      <option value={1}>⭐ (1/5)</option>
                    </select>
                  </div>
                </div>
                <div className="form-group">
                  <label>Your Review</label>
                  <textarea 
                    rows={3} 
                    placeholder="How was the flavor, delivery speed, and freshness?"
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    required
                  />
                </div>
                <button type="submit" className="btn-primary" style={{ alignSelf: 'flex-start' }}>
                  <Send size={16} /> Post Review
                </button>
              </>
            )}
          </form>
        )}

        {/* Reviews List */}
        <div className="reviews-grid">
          {reviews.map(rev => (
            <div key={rev.id} className="review-card">
              <div className="review-card-top">
                <div className="review-author">
                  <div className="author-avatar">{rev.name.charAt(0)}</div>
                  <div>
                    <div className="author-name">
                      {rev.name}
                      {rev.verified && <span className="verified-badge">✓ Verified Buyer</span>}
                    </div>
                    <div className="review-date">{rev.date}</div>
                  </div>
                </div>
                <div className="review-stars">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} size={14} fill="var(--accent-rating)" stroke="var(--accent-rating)" />
                  ))}
                </div>
              </div>
              <p className="review-comment">"{rev.comment}"</p>
              <div className="review-footer">
                <button className="review-helpful-btn" onClick={() => (rev.likes += 1)}>
                  <ThumbsUp size={13} /> Helpful ({rev.likes})
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

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

