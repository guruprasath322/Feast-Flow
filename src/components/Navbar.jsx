import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { ShoppingBag, Sun, Moon, ChefHat, ClipboardList } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function Navbar() {
  const { getCartCount, darkMode, toggleTheme } = useCart();
  const cartCount = getCartCount();

  return (
    <nav className="navbar">
      <div className="container">
        <Link to="/" className="logo">
          <ChefHat size={32} strokeWidth={2.5} />
          <span>Feast</span>Flow
        </Link>

        <div className="nav-links">
          <NavLink 
            to="/" 
            className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
          >
            Menu
          </NavLink>
          <NavLink 
            to="/cart" 
            className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
          >
            Cart
          </NavLink>
        </div>

        <div className="nav-actions">
          <button 
            onClick={toggleTheme} 
            className={`icon-btn theme-toggle-btn ${darkMode ? 'dark' : 'light'}`} 
            title={darkMode ? "Switch to Light Mode (☀️)" : "Switch to Dark Mode (🌙)"}
            aria-label="Toggle Theme"
          >
            <div className="theme-icon-container">
              {darkMode ? (
                <Sun size={20} className="theme-icon sun-icon" />
              ) : (
                <Moon size={20} className="theme-icon moon-icon" />
              )}
            </div>
          </button>

          <Link to="/cart" className="icon-btn cart-icon-wrapper" aria-label="Shopping Cart">
            <ShoppingBag size={20} />
            {cartCount > 0 && (
              <span className="cart-badge">{cartCount}</span>
            )}
          </Link>
        </div>
      </div>
    </nav>
  );
}
