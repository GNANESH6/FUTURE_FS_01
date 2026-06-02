# Developer Portfolio & Admin Dashboard

A full-stack, highly customizable developer portfolio built with the MERN stack (MongoDB, Express, React, Node.js). This project features a beautiful, interactive public-facing portfolio and a secure, feature-rich admin dashboard to manage all content dynamically.

## 🚀 Features

### 🎨 Frontend Portfolio (`frontend-portfolio`)
- **Modern & Responsive Design**: Crafted with a mobile-first approach ensuring a seamless experience across all devices.
- **Cinematic 3D Background**: Features a highly performant, custom-built 3D glassmorphism background with continuously drifting tech stack logos.
- **Live Coding Metrics**: Dynamically fetches and displays live coding statistics, including GitHub contributions and LeetCode streaks.
- **Dynamic Content**: All sections (About, Projects, Experience, Education, Skills) are rendered dynamically from the backend API.

### ⚙️ Admin Dashboard (`frontend-admin`)
- **Content Management System (CMS)**: Add, edit, and delete portfolio items directly from the browser without touching code.
- **Live Metrics Configuration**: Connect and update GitHub and LeetCode usernames to instantly reflect on the public portfolio.
- **SEO Management**: Update meta tags, titles, and descriptions dynamically to optimize search engine visibility.
- **Secure Authentication**: Protected routes ensuring only the authorized admin can make changes.
- **Responsive Admin UI**: Manage your portfolio on the go with a mobile-optimized dashboard and hamburger navigation.

### 🔧 Backend API (`backend`)
- **RESTful Architecture**: Built with Node.js and Express to serve data efficiently to both frontends.
- **MongoDB Integration**: Stores all portfolio data, settings, and credentials securely.
- **External API Proxies**: Safely fetches data from external sources (like GitHub and LeetCode) to prevent CORS issues and rate limiting on the client side.

## 📁 Project Structure

```bash
portfolio/
├── backend/               # Node.js + Express API & MongoDB connection
├── frontend-admin/        # React application for the Admin CMS
└── frontend-portfolio/    # React application for the Public Portfolio
```

## 🛠️ Tech Stack

- **Frontend**: React.js, React Router, Axios, Framer Motion, CSS3 (Glassmorphism, CSS Animations)
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (Mongoose)
- **Icons**: React Icons (FontAwesome, SimpleIcons)

## 🚦 Getting Started

### Prerequisites
- Node.js (v16+ recommended)
- MongoDB installed locally or a MongoDB Atlas URI

### 1. Backend Setup
```bash
cd backend
npm install
# Ensure you create a .env file with your MONGO_URI
npm run dev
```

### 2. Frontend Portfolio Setup
```bash
cd frontend-portfolio
npm install
npm run dev
```

### 3. Frontend Admin Setup
```bash
cd frontend-admin
npm install
npm run dev
```

## 🎨 Customization

To personalize the portfolio, log into the Admin Dashboard and update your details. The 3D floating background can be adjusted in the `CinematicBackground.jsx` files within both frontend repositories if you wish to change the logos or animation speeds.

## 📝 License

This project is open-source and available under the MIT License.
