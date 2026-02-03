# AAZ International Enterprises - Medical E-Commerce Platform

A professional, production-ready frontend for AAZ International Enterprises Pvt. Ltd., a single-vendor medical equipment e-commerce platform built with React and Vite.

## 🏥 Company Information

**Company Name:** AAZ International Enterprises Pvt. Ltd.  
**Location:** Karachi, Pakistan  
**Email:** aazint808@gmail.com  
**WhatsApp:** +92 345 3450644

**Business:** Healthcare solutions provider specializing in:

- Hospital medical equipment supply
- Orthopedic implants
- Cardiac angiography implants
- Neuro surgery implants
- Patient care devices
- Medical equipment maintenance & repair
- Worldwide import & export

## 🚀 Features

### ✅ Core Functionality

- 🏠 **Home Page**: Hero section, features, categories, and featured products
- ℹ️ **About Us**: Company information, mission, and values
- 🛍️ **Products**: Filterable product catalog with category navigation
- 🔍 **Product Detail**: Detailed product view with add-to-cart
- 🛒 **Shopping Cart**: Cart management with quantity controls
- 💳 **Checkout**: Order form with validation and payment method selection
- ✅ **Order Confirmation**: Success page with order details
- 📞 **Contact**: Contact form and company information

### 🎨 Design Features

- Healthcare-appropriate color palette (medical blue, green, white)
- Professional, clean design suitable for B2B medical equipment
- Fully responsive (desktop, tablet, mobile)
- Smooth animations and transitions
- Accessible UI components

### 🔧 Technical Features

- React 19 with Vite for optimal performance
- React Router for client-side routing
- Context API for cart state management
- LocalStorage persistence for cart data
- Form validation
- WhatsApp integration on all pages
- SEO-friendly structure

## 📁 Project Structure

```
frontend/
├── public/                     # Static files
├── src/
│   ├── assets/                 # Images and static assets
│   ├── components/
│   │   ├── common/             # Reusable UI components
│   │   │   ├── Button.jsx
│   │   │   ├── Button.css
│   │   │   ├── Input.jsx
│   │   │   ├── Input.css
│   │   │   ├── Card.jsx
│   │   │   └── Card.css
│   │   ├── layout/             # Layout components
│   │   │   ├── Header.jsx
│   │   │   ├── Header.css
│   │   │   ├── Footer.jsx
│   │   │   └── Footer.css
│   │   ├── product/            # Product-specific components
│   │   │   ├── ProductCard.jsx
│   │   │   └── ProductCard.css
│   │   ├── cart/               # Cart components (if needed)
│   │   └── checkout/           # Checkout components (if needed)
│   ├── context/
│   │   └── CartContext.jsx     # Cart state management
│   ├── data/
│   │   └── products.js         # Product catalog and categories
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── Home.css
│   │   ├── About.jsx
│   │   ├── About.css
│   │   ├── Products.jsx
│   │   ├── Products.css
│   │   ├── ProductDetail.jsx
│   │   ├── ProductDetail.css
│   │   ├── Cart.jsx
│   │   ├── Cart.css
│   │   ├── Checkout.jsx
│   │   ├── Checkout.css
│   │   ├── OrderConfirmation.jsx
│   │   ├── OrderConfirmation.css
│   │   ├── Contact.jsx
│   │   └── Contact.css
│   ├── utils/
│   │   └── helpers.js          # Utility functions
│   ├── App.jsx                 # Main app component
│   ├── App.css
│   ├── main.jsx                # Entry point
│   └── index.css               # Global styles & design system
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

## 🎨 Design System

### Color Palette

- **Primary Blue:** `#0A74DA` (Medical Blue)
- **Secondary Green:** `#00A86B` (Medical Green)
- **Accent:** `#00BCD4` (Teal)
- **Neutrals:** Gray scale from 50 to 900

### Typography

- **Font Family:** Inter, Roboto
- **Font Sizes:** Responsive scale from 0.75rem to 3rem
- **Font Weights:** 400, 500, 600, 700

### Spacing

- Uses CSS custom properties with consistent spacing scale
- Responsive spacing adjustments

## 🚦 Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Start development server:**

   ```bash
   npm run dev
   ```

3. **Build for production:**

   ```bash
   npm run build
   ```

4. **Preview production build:**
   ```bash
   npm run preview
   ```

## 📄 Pages & Routes

| Route                 | Component         | Description                                    |
| --------------------- | ----------------- | ---------------------------------------------- |
| `/`                   | Home              | Landing page with hero, features, and products |
| `/about`              | About             | Company information and values                 |
| `/products`           | Products          | Product catalog with category filter           |
| `/products/:id`       | ProductDetail     | Individual product details                     |
| `/cart`               | Cart              | Shopping cart with item management             |
| `/checkout`           | Checkout          | Order form and payment selection               |
| `/order-confirmation` | OrderConfirmation | Order success page                             |
| `/contact`            | Contact           | Contact form and information                   |

## 🛠️ Key Components

### Layout Components

- **Header**: Logo, navigation, cart icon, WhatsApp button
- **Footer**: Company info, links, contact details

### Common Components

- **Button**: Multiple variants (primary, secondary, outline, ghost)
- **Input**: Form input with validation and error states
- **Card**: Content container with hover effects

### Product Components

- **ProductCard**: Product display card for listings
- **ProductDetail**: Full product view with features

## 🔌 Integration Points

### WhatsApp

- General inquiry button in header and footer
- Product-specific inquiry on product detail pages
- Contact via WhatsApp on contact page

### Cart Management

- Uses React Context for global cart state
- LocalStorage persistence
- Add, remove, update quantity operations

### Form Validation

- Email validation
- Phone number validation (Pakistan format)
- Required field validation

## 📱 Responsive Design

- **Desktop:** Full layout with sidebar filters
- **Tablet:** Adjusted grid layouts
- **Mobile:**
  - Hamburger menu
  - Stacked layouts
  - Touch-friendly buttons
  - Responsive images

## 🎯 Product Categories

1. **Hospital Equipment**: Beds, monitors, surgical tables, ventilators
2. **Orthopedic Implants**: Hip, knee, spinal implants
3. **Cardiac Angiography**: Stents, catheters, guide wires
4. **Neuro Surgery Implants**: Cranial fixation, shunts, surgical instruments
5. **Patient Care Devices**: Monitors, wheelchairs, nebulizers

## 📞 Contact & Support

For questions or support regarding this application:

- **Phone:** +92 345 3450644
- **Email:** aazint808@gmail.com
- **WhatsApp:** Available via in-app buttons

## 🔒 Notes

- This is a **frontend-only** implementation
- Product data is currently static (in `src/data/products.js`)
- No backend API integration (ready for future implementation)
- Payment processing is UI-only simulation
- Order data is stored in LocalStorage (temporary)

## 🚀 Future Enhancements

- Backend API integration
- Real payment gateway integration
- User authentication (for order tracking)
- Product search functionality
- Product reviews and ratings
- Admin dashboard for product management
- Real-time inventory management
- Email notifications for orders

## 📝 License

Copyright © 2026 AAZ International Enterprises Pvt. Ltd. All rights reserved.
