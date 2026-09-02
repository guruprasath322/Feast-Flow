import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Flame, ShieldCheck, X, SlidersHorizontal, Sparkles, Star, Clock, Filter } from 'lucide-react';
import { foodData } from '../data/foodData';
import FoodCard from '../components/FoodCard';

const CATEGORIES = [
  { name: "All", icon: "🍽️" },
  { name: "Burger", icon: "🍔" },
  { name: "Pizza", icon: "🍕" },
  { name: "Sushi", icon: "🍣" },
  { name: "Pasta", icon: "🍝" },
  { name: "Desserts", icon: "🍰" },
  { name: "Healthy", icon: "🥗" },
  { name: "Tacos", icon: "🌮" },
  { name: "Ramen", icon: "🍜" },
  { name: "Steak", icon: "🥩" },
];

const QUICK_TAGS = [
  { label: "🔥 Popular", query: "popular" },
  { label: "🍕 Truffle Pizza", query: "Truffle" },
  { label: "🍔 Cheeseburger", query: "Burger" },
  { label: "🍣 Sushi Platter", query: "Sushi" },
  { label: "🥗 Healthy Bowls", query: "Healthy" },
  { label: "🍰 Lava Cake", query: "Cake" },
];

export default function Home() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('popular');
  const [popularOnly, setPopularOnly] = useState(false);
  const [underFifteen, setUnderFifteen] = useState(false);
  const [topRatedOnly, setTopRatedOnly] = useState(false);

  const selectedCategory = searchParams.get('category') || 'All';

  // Calculate dynamic dish count for each category
  const categoryCounts = useMemo(() => {
    const counts = { All: foodData.length };
    foodData.forEach(item => {
      counts[item.category] = (counts[item.category] || 0) + 1;
    });
    return counts;
  }, []);

  // Synchronize URL category query param with tabs
  const handleCategorySelect = (category) => {
    if (category === 'All') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', category);
    }
    setSearchParams(searchParams);
  };

  // Quick tag click handler
  const handleQuickTagClick = (tagQuery) => {
    if (tagQuery === 'popular') {
      setPopularOnly(prev => !prev);
    } else {
      setSearchQuery(tagQuery);
    }
  };

  // Reset all search and filter controls
  const handleResetFilters = () => {
    setSearchQuery('');
    handleCategorySelect('All');
    setSortBy('popular');
    setPopularOnly(false);
    setUnderFifteen(false);
    setTopRatedOnly(false);
  };

  // Check if any filter is active
  const hasActiveFilters = searchQuery.trim() !== '' || selectedCategory !== 'All' || popularOnly || underFifteen || topRatedOnly || sortBy !== 'popular';

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
        item.category.toLowerCase().includes(query) ||
        item.ingredients.some(ing => ing.toLowerCase().includes(query))
      );
    }

    // Secondary Quick Filters
    if (popularOnly) {
      result = result.filter(item => item.popular);
    }

    if (underFifteen) {
      result = result.filter(item => item.price < 15.00);
    }

    if (topRatedOnly) {
      result = result.filter(item => item.rating >= 4.8);
    }

    // Sorting Logic
    if (sortBy === 'price-low') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      result.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'prep-fast') {
      result.sort((a, b) => {
        const timeA = parseInt(a.prepTime) || 99;
        const timeB = parseInt(b.prepTime) || 99;
        return timeA - timeB;
      });
    } else {
      // Popularity default sort
      result.sort((a, b) => {
        if (a.popular && !b.popular) return -1;
        if (!a.popular && b.popular) return 1;
        return b.rating - a.rating;
      });
    }

    return result;
  }, [selectedCategory, searchQuery, sortBy, popularOnly, underFifteen, topRatedOnly]);

  return (
    <div className="container anim-fade-in">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-text">
          <h1>Super Fast Gourmet <span>Food Delivery</span> At Your Door</h1>
          <p>
            Experience chef-crafted premium delicacies cooked with organic ingredients and delivered hot, fresh, and exceptionally fast.
          </p>

          {/* Interactive Live Search Container */}
          <div className="search-container">
            <div className="search-input-wrapper">
              <Search size={20} className="search-icon" />
              <input 
                type="text" 
                placeholder="Craving pizza, burgers, sushi...?" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button 
                  className="search-clear-btn"
                  onClick={() => setSearchQuery('')}
                  title="Clear search"
                  aria-label="Clear search text"
                >
                  <X size={16} />
                </button>
              )}
            </div>
            <button className="search-btn">
              <span>Search</span>
            </button>
          </div>

          {/* Quick Search Tag Pills */}
          <div className="quick-tags">
            <span className="quick-tags-title">Try searching:</span>
            <div className="tags-wrapper">
              {QUICK_TAGS.map(tag => (
                <button
                  key={tag.label}
                  onClick={() => handleQuickTagClick(tag.query)}
                  className={`tag-pill ${searchQuery === tag.query || (tag.query === 'popular' && popularOnly) ? 'active' : ''}`}
                >
                  {tag.label}
                </button>
              ))}
            </div>
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

          <div className="catalog-controls-top">
            {/* Sort Select */}
            <div className="sort-wrapper">
              <SlidersHorizontal size={16} className="sort-icon" />
              <select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value)} 
                className="sort-select"
                aria-label="Sort food list"
              >
                <option value="popular">Popularity</option>
                <option value="rating">Highest Rated ⭐</option>
                <option value="price-low">Price: Low to High 💰</option>
                <option value="price-high">Price: High to Low 💎</option>
                <option value="prep-fast">Fastest Prep ⚡</option>
              </select>
            </div>
          </div>
        </div>

        {/* Categories Tab Bar with Icons and Counts */}
        <div className="categories-container">
          {CATEGORIES.map(cat => {
            const count = categoryCounts[cat.name] || 0;
            return (
              <button
                key={cat.name}
                onClick={() => handleCategorySelect(cat.name)}
                className={`category-tab ${selectedCategory === cat.name ? 'active' : ''}`}
              >
                <span className="cat-icon">{cat.icon}</span>
                <span className="cat-name">{cat.name}</span>
                <span className="cat-count">{count}</span>
              </button>
            );
          })}
        </div>

        {/* Secondary Quick Filter Pills */}
        <div className="secondary-filters-bar">
          <div className="filter-pills-group">
            <button 
              className={`filter-pill ${popularOnly ? 'active' : ''}`}
              onClick={() => setPopularOnly(prev => !prev)}
            >
              <Flame size={14} /> Popular Dishes
            </button>
            <button 
              className={`filter-pill ${underFifteen ? 'active' : ''}`}
              onClick={() => setUnderFifteen(prev => !prev)}
            >
              <Sparkles size={14} /> Under $15
            </button>
            <button 
              className={`filter-pill ${topRatedOnly ? 'active' : ''}`}
              onClick={() => setTopRatedOnly(prev => !prev)}
            >
              <Star size={14} /> 4.8+ Rating
            </button>
          </div>

          <div className="results-status">
            <span>Showing <strong>{filteredAndSortedFood.length}</strong> delicacies</span>
            {hasActiveFilters && (
              <button onClick={handleResetFilters} className="reset-link-btn">
                Clear Filters
              </button>
            )}
          </div>
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
            <p>We couldn't find anything matching your filters or search terms. Try adjusting your query or category selection.</p>
            <button 
              onClick={handleResetFilters} 
              className="btn-primary"
            >
              Reset All Filters
            </button>
          </div>
        )}
      </section>
    </div>
  );
}

