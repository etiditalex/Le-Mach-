# Lemach Hotel & Accommodations - Next.js Website

A modern, responsive hotel website built with Next.js 14, TypeScript, Tailwind CSS, and Framer Motion.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Images**: Next.js Image Optimization
- **State Management**: React Context API (Cart)

## Features

- ✅ Responsive design for all devices
- ✅ Shopping cart functionality for food items
- ✅ Smooth animations with Framer Motion
- ✅ Optimized images with Next.js Image
- ✅ Type-safe with TypeScript
- ✅ Color palette extracted from logo
- ✅ Modern UI/UX design

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
lemach-hotel-nextjs/
├── app/
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Home page
│   ├── menu/
│   │   └── page.tsx        # Menu page with cart
│   └── globals.css         # Global styles
├── components/
│   ├── Header.tsx          # Navigation header
│   ├── Footer.tsx          # Footer component
│   ├── Hero.tsx            # Hero carousel
│   ├── Services.tsx        # Services section
│   ├── Offers.tsx          # Special offers
│   ├── Testimonials.tsx    # Testimonials
│   └── CartDrawer.tsx      # Shopping cart drawer
├── context/
│   └── CartContext.tsx     # Cart state management
├── data/
│   └── menuItems.ts        # Menu items data
└── public/                 # Static assets
```

## Color Palette

The color palette is extracted from the logo:
- **Primary**: #8B4513 (Saddle Brown)
- **Secondary**: #D2691E (Chocolate)
- **Accent**: #FFD700 (Gold)

## Available Pages

- `/` - Homepage
- `/menu` - Restaurant menu with shopping cart
- `/rooms` - Room listings (to be implemented)
- `/deals` - Special deals (to be implemented)
- `/about` - About us (to be implemented)
- `/contact` - Contact page (to be implemented)
- `/booking` - Booking page (to be implemented)
- `/bar-restaurant` - Bar & Restaurant (to be implemented)
- `/meetings-events` - Events page (to be implemented)

## Shopping Cart

The shopping cart functionality is fully implemented:
- Add items to cart from menu page
- View cart in drawer sidebar
- Update quantities
- Remove items
- Calculate total price

## Build for Production

```bash
npm run build
npm start
```

## License

© 2024 Lemach Hotel & Accommodations. All rights reserved.

