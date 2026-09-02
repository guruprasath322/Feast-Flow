import React from 'react';
import { ChefHat, Mail, Phone, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-info">
            <Link to="/" className="logo" style={{ marginBottom: '10px' }}>
              <ChefHat size={32} strokeWidth={2.5} />
              <span>Feast</span>Flow
            </Link>
            <p>
              Bringing gourmet meals right to your doorstep. Prepared by professional chefs with local, fresh, organic ingredients.
            </p>
            <div className="social-links">
              <a href="#" className="icon-btn" aria-label="Instagram">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
              </a>
              <a href="#" className="icon-btn" aria-label="Twitter">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
              </a>
              <a href="#" className="icon-btn" aria-label="Github">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/></svg>
              </a>
            </div>
          </div>

          <div className="footer-col">
            <h4>Quick Links</h4>
            <div className="footer-col-links">
              <Link to="/">Our Menu</Link>
              <Link to="/cart">Shopping Cart</Link>
              <a href="#about">About Us</a>
              <a href="#careers">Careers</a>
            </div>
          </div>

          <div className="footer-col">
            <h4>Categories</h4>
            <div className="footer-col-links">
              <Link to="/?category=Burger">Burgers</Link>
              <Link to="/?category=Pizza">Pizza</Link>
              <Link to="/?category=Sushi">Sushi Platter</Link>
              <Link to="/?category=Desserts">Desserts</Link>
            </div>
          </div>

          <div className="footer-col">
            <h4>Contact Info</h4>
            <div className="footer-col-links">
              <a href="tel:+1234567890" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Phone size={16} /> +1 (234) 567-890
              </a>
              <a href="mailto:support@feastflow.com" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Mail size={16} /> support@feastflow.com
              </a>
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)' }}>
                <MapPin size={16} /> 123 Gourmet Ave, Food City
              </span>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} FeastFlow. All rights reserved.</p>
          <div style={{ display: 'flex', gap: '20px' }}>
            <a href="#privacy">Privacy Policy</a>
            <a href="#terms">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
