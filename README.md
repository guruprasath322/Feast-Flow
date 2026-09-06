# 🍔 FeastFlow - Super Fast Gourmet Food Delivery

<p align="center">
  <img src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200&auto=format&fit=crop&q=80" alt="FeastFlow Banner" width="100%" style="border-radius: 12px; max-height: 380px; object-fit: cover;" />
</p>

<p align="center">
  <strong>FeastFlow</strong> is a modern, responsive, full-featured gourmet food delivery web application built with React, Vite, and modern CSS design tokens. Experience fast ordering, smooth animations, dynamic menus, and live order tracking.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-19.2-blue?style=for-the-badge&logo=react" alt="React" />
  <img src="https://img.shields.io/badge/Vite-8.1-646CFF?style=for-the-badge&logo=vite" alt="Vite" />
  <img src="https://img.shields.io/badge/Lucide_Icons-1.21-F56565?style=for-the-badge&logo=feather" alt="Lucide React" />
  <img src="https://img.shields.io/badge/Status-Active-success?style=for-the-badge" alt="Status" />
</p>

---

## ✨ Features

- 🌟 **Interactive Gourmet Menu**: Browse artisan dishes across 10 categories (Burgers, Pizza, Sushi, Pasta, Ramen, Steaks, Healthy Bowls, Desserts, and more).
- 🔍 **Live Search & Quick Tag Filtering**: Instant search by dish name, category, or ingredients with instant keyword pills.
- ⚡ **Multi-Criteria Sorting & Quick Filters**: Filter by Popularity, 4.8+ Ratings, Under $15, Price Low-to-High, and Fastest Prep time.
- ❤️ **Favorites / Wishlist**: Heart dishes and save them locally to your personal favorites list.
- 🛒 **Dynamic Shopping Cart**: Manage item quantities, subtotal calculations, free delivery thresholds ($40+), and promo discount codes (`FEAST20`).
- 💳 **Checkout with Multiple Payment Options**: Credit/Debit card, UPI, and Cash on Delivery with form validation.
- 🚚 **Interactive Live Order Tracking**: Real-time vector map route simulation with animated courier radar, live countdown ETA timer, stage-by-stage progression controls, activity log, and driver call/chat modal simulation.
- 📋 **Order History & Quick Re-Order**: View all past orders with details, address, receipts, and 1-click re-order to cart.
- ⭐ **Customer Reviews & Rating System**: Read verified reviews, submit your own star ratings and feedback, and upvote helpful reviews.
- 🌓 **Dark / Light Mode**: Smooth theme toggling with persistent user preference storage in `localStorage`.
- 📱 **Fully Responsive & Fluid UI**: Optimized for desktop, tablets, and mobile screens.

---

## 🛠️ Tech Stack

- **Frontend Library**: [React 19](https://react.dev/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Routing**: [React Router v7](https://reactrouter.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Styling**: Vanilla CSS Design System with CSS Custom Properties, Smooth Transitions, and Glassmorphism

---

## 📁 Project Structure

```
Feast-Flow/
├── public/
├── src/
│   ├── assets/             # Static assets and icons
│   ├── components/
│   │   ├── FoodCard.jsx    # Menu item card with rating, tags, add-to-cart, & favorites
│   │   ├── Footer.jsx      # Global footer with quick links and brand info
│   │   └── Navbar.jsx      # Navigation bar with theme toggle, cart, & order badges
│   ├── context/
│   │   └── CartContext.jsx # Global state for Cart, Orders, Favorites, & Dark Mode
│   ├── data/
│   │   └── foodData.js     # Gourmet culinary menu catalog
│   ├── pages/
│   │   ├── Home.jsx        # Landing page with search, filters, & category browser
│   │   ├── FoodDetails.jsx # Detailed dish view with reviews & recommendation engine
│   │   ├── Cart.jsx        # Cart management, promo coupons, & bill breakdown
│   │   ├── Checkout.jsx    # Delivery address and payment method selector
│   │   ├── OrderConfirmation.jsx # Live order confirmation & receipt
│   │   ├── OrderTracking.jsx     # Interactive live map delivery tracking & driver simulator
│   │   └── Orders.jsx      # Order history & re-order dashboard
│   ├── App.css
│   ├── App.jsx
│   ├── index.css           # Global design system, animations, & themes
│   └── main.jsx
├── eslint.config.js
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

---

## 🚀 Getting Started

### 1. Prerequisites
Ensure you have **Node.js** (v18 or higher) and **npm** installed.

### 2. Clone the Repository
```bash
git clone https://github.com/guruprasath-s-b/Feast-Flow.git
cd Feast-Flow
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Run Development Server
```bash
npm run dev
```
Open your browser at [http://localhost:5173](http://localhost:5173) to view FeastFlow.

### 5. Build for Production
```bash
npm run build
```

---

## 🏷️ Demo Promo Code
Try applying `FEAST20` in the Shopping Cart for a **20% discount** on your order!

---

## 📄 License
This project is open source and available under the [MIT License](LICENSE).

