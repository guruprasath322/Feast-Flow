import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Flame, ShieldCheck, Heart } from 'lucide-react';
import { foodData } from '../data/foodData';
import FoodCard from '../components/FoodCard';

const CATEGORIES = ["All", "Burger", "Pizza", "Sushi", "Desserts", "Healthy", "Tacos", "Ramen", "Steak"];

export default function Home() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('popular');

  const selectedCategory = searchParams.get('category') || 'All';

  // Synchronize URL category query param with tabs
  const handleCategorySelect = (category) => {
    if (category === 'All') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', category);
    }
    setSearchParams(searchParams);
  };

  // Filter and Sort Data
  const filteredAndSortedFood = useMemo(() => {
    let result = [...foodData];

    // Filter by Category
    if (selectedCategory !== 'All') {
      result = result.filter(item => item.category === selectedCategory);
    }

    // Filter by Search Query
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter(item => 
        item.name.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query) ||
        item.ingredients.some(ing => ing.toLowerCase().includes(query))
      );
    }

    // Sorting Logic
    if (sortBy === 'price-low') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      result.sort((a, b) => b.rating - a.rating);
    } else {
      // Sort by popularity (popular item first, then highest rating)
      result.sort((a, b) => {
        if (a.popular && !b.popular) return -1;
        if (!a.popular && b.popular) return 1;
        return b.rating - a.rating;
      });
    }

    return result;
  }, [selectedCategory, searchQuery, sortBy]);

  return (
    <div className="container anim-fade-in">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-text">
          <h1>Super Fast Gourmet <span>Food Delivery</span> At Your Door</h1>
          <p>
            Experience chef-crafted premium delicacies cooked with organic ingredients and delivered hot, fresh, and exceptionally fast.
          </p>

          <div className="search-container">
            <div className="search-input-wrapper">
              <Search size={20} />
              <input 
                type="text" 
                placeholder="Craving something? Search here..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button className="search-btn">Search</button>
          </div>
        </div>

        <div className="hero-image-container">
          <div className="hero-image-wrapper">
            <img 
              src="https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&auto=format&fit=crop&q=80" 
              alt="Delicious Pizza and Burger gourmet setup" 
            />
          </div>
          
          <div className="floating-badge badge-1">
            <div className="badge-icon">
              <Flame size={20} />
            </div>
            <div className="badge-text">
              <div>Popular Order</div>
              <div>Truffle Pizza</div>
            </div>
          </div>

          <div className="floating-badge badge-2">
            <div className="badge-icon">
              <ShieldCheck size={20} />
            </div>
            <div className="badge-text">
              <div>Quality Checked</div>
              <div>100% Organic</div>
            </div>
          </div>
        </div>
      </section>

      {/* Catalog & Shop Section */}
      <section className="catalog-section">
        <div className="section-header">
          <div>
            <span className="card-category" style={{ display: 'block', marginBottom: '8px' }}>Our Specialties</span>
            <h2>Browse Our Exquisite Menu</h2>
          </div>
          <div>
            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)} 
              className="sort-select"
              aria-label="Sort food list"
            >
              <option value="popular">Popularity</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>
        </div>

        {/* Categories Tab Bar */}
        <div className="categories-container">
          {CATEGORIES.map(category => (
            <button
              key={category}
              onClick={() => handleCategorySelect(category)}
              className={`category-tab ${selectedCategory === category ? 'active' : ''}`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Food Grid Display */}
        {filteredAndSortedFood.length > 0 ? (
          <div className="food-grid">
            {filteredAndSortedFood.map(food => (
              <FoodCard key={food.id} food={food} />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-state-icon">
              <Search size={40} />
            </div>
            <h3>No Delicacies Found</h3>
            <p>We couldn't find anything matching your search. Please adjust your keywords or category filter.</p>
            <button 
              onClick={() => { setSearchQuery(''); handleCategorySelect('All'); }} 
              className="btn-primary"
            >
              Reset Filters
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
