# PlacementIQ
**Smart, Data-Driven College Placement Management System**  
Built using FastAPI • React • MongoDB • Chart.js • Tailwind CSS

![PlacementIQ](https://img.shields.io/badge/PlacementIQ-Intelligent%20Placement%20Management-blue)
![FastAPI](https://img.shields.io/badge/FastAPI-0.110.1-green)
![React](https://img.shields.io/badge/React-19.0.0-blue)
![MongoDB](https://img.shields.io/badge/MongoDB-Latest-green)

---

## 📘 Overview

# PlacementIQ

**Intelligent College Placement Management System**

PlacementIQ is a comprehensive web application designed to streamline and manage college placement activities. Built with modern technologies, it provides real-time analytics, data management, and insights for placement coordinators and administrators.

[![Live Demo](https://img.shields.io/badge/demo-live-success)](https://placementiq.vercel.app)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![React](https://img.shields.io/badge/React-18.x-blue)](https://reactjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.110-green)](https://fastapi.tiangolo.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-6.0-green)](https://www.mongodb.com/)

---

## 🌟 Features

The system helps placement coordinators make data-driven decisions by providing real-time statistics, interactive visualizations, and comprehensive reporting capabilities.

## ✨ Features

### Core Functionality
- **Student Management**: Comprehensive student profiles with academic records, contact information, and placement status tracking
- **Company Database**: Detailed company profiles with package information, domains, locations, and recruitment history
- **Placement Drives**: Schedule and manage campus recruitment drives with eligible department tracking
- **Offer Management**: Track and record placement offers with student-company mappings
- **Real-time Dashboard**: Overview statistics including placement rate, average package, and key metrics

### Analytics & Insights
- **Department-wise Analysis**: Interactive bar charts showing placement distribution across departments
- **Company Package Trends**: Line charts displaying average packages offered by different companies
- **Yearly Placement Trends**: Area charts tracking placement growth and patterns over years
- **Role Distribution**: Pie charts showing offer distribution across different job roles
- **Live Statistics**: Real-time calculation of placement rates, average packages, and success metrics

### Security & Authentication
- **JWT-based Authentication**: Secure token-based authentication for admin users
- **Password Encryption**: Bcrypt hashing for secure password storage
- **Protected Routes**: Role-based access control for CRUD operations
- **Session Management**: Persistent login sessions with automatic token refresh

### User Experience
- **Responsive Design**: Fully responsive interface for desktop, tablet, and mobile devices
- **Modern UI**: Clean, professional interface with Tailwind CSS and Radix UI components
- **Search & Filter**: Advanced search functionality across all data tables
- **Interactive Charts**: Dynamic, interactive visualizations using Chart.js
- **Real-time Updates**: Instant data updates without page refreshes

## 🧠 Tech Stack

### Backend
- **FastAPI**: High-performance Python web framework
- **MongoDB**: NoSQL database for flexible data storage
- **Motor**: Async MongoDB driver for Python
- **Pydantic**: Data validation and settings management
- **PyJWT**: JWT token creation and validation
- **Passlib & Bcrypt**: Password hashing and security

### Frontend
- **React 19**: Modern JavaScript library for building user interfaces
- **React Router**: Client-side routing
- **Axios**: HTTP client for API requests
- **Chart.js**: Interactive chart library
- **React-Chartjs-2**: React wrapper for Chart.js
- **Tailwind CSS**: Utility-first CSS framework
- **Radix UI**: Accessible component primitives
- **Lucide React**: Beautiful, consistent icon set

### Development Tools
- **Yarn**: Package manager
- **ESLint**: Code linting
- **PostCSS**: CSS processing
- **Craco**: Create React App configuration override

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ and npm
- Python 3.8+
- MongoDB 4.0+

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Romio1310/PlacementIQ.git
   cd PlacementIQ
   ```

2. **Backend Setup**
   ```bash
   cd backend
   pip install -r requirements.txt
   cp ../.env.example .env
   # Edit .env with your MongoDB URL
   ```

3. **Frontend Setup**
   ```bash
   cd frontend
   npm install --legacy-peer-deps
   echo "REACT_APP_BACKEND_URL=http://localhost:8000" > .env
   ```

4. **Run the Application**
   
   Terminal 1 (Backend):
   ```bash
   cd backend
   python3 -m uvicorn server:app --reload --port 8000
   ```
   
   Terminal 2 (Frontend):
   ```bash
   cd frontend
   npm start
   ```

5. **Access the app** at http://localhost:3000

📖 For detailed deployment instructions, see [DEPLOYMENT.md](DEPLOYMENT.md)

## 🎯 Usage

### Auto-Seeding Data

On the first run, PlacementIQ automatically seeds the database with:
- 50 diverse student profiles
- 10 leading companies
- 20 scheduled placement drives
- 30-40 placement offers

You can also manually trigger seeding via:
```bash
curl -X POST http://localhost:8001/api/seed
```

## 📊 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new admin user
- `POST /api/auth/login` - Login and get JWT token
- `GET /api/auth/me` - Get current user info

### Students
- `GET /api/students` - Get all students
- `POST /api/students` - Create student (auth required)
- `GET /api/students/{id}` - Get student by ID
- `PUT /api/students/{id}` - Update student (auth required)
- `DELETE /api/students/{id}` - Delete student (auth required)

### Companies
- `GET /api/companies` - Get all companies
- `POST /api/companies` - Create company (auth required)
- `GET /api/companies/{id}` - Get company by ID
- `PUT /api/companies/{id}` - Update company (auth required)
- `DELETE /api/companies/{id}` - Delete company (auth required)

### Placement Drives
- `GET /api/drives` - Get all drives
- `POST /api/drives` - Create drive (auth required)
- `GET /api/drives/{id}` - Get drive by ID
- `PUT /api/drives/{id}` - Update drive (auth required)
- `DELETE /api/drives/{id}` - Delete drive (auth required)

### Offers
- `GET /api/offers` - Get all offers
- `POST /api/offers` - Create offer (auth required)
- `GET /api/offers/{id}` - Get offer by ID
- `DELETE /api/offers/{id}` - Delete offer (auth required)

### Analytics
- `GET /api/analytics/stats` - Overall statistics
- `GET /api/analytics/department-placements` - Department-wise placement count
- `GET /api/analytics/company-packages` - Average package by company
- `GET /api/analytics/yearly-trends` - Placement trends by year
- `GET /api/analytics/role-distribution` - Offer distribution by role

## 📸 Screenshots

### Landing Page
Clean, professional landing page with hero section and feature highlights.

### Dashboard
Real-time statistics and quick access to all major features.

### Analytics
Interactive charts displaying placement trends, department analysis, and package distribution.

### Student Management
Comprehensive data table with search, filter, and CRUD operations.

## 🚀 Live Demo

**Application:** Deploy to Vercel (see [DEPLOYMENT.md](DEPLOYMENT.md))

### Getting Started
1. Register a new admin account at `/register`
2. Login at `/login`  
3. Explore the dashboard and features
4. The system auto-seeds sample data on first startup

---

## 👨‍💻 Author

**GitHub**: [@Romio1310](https://github.com/Romio1310)  
**Repository**: [PlacementIQ](https://github.com/Romio1310/PlacementIQ)

---

**⭐ If you find this project helpful, please give it a star!**

## 📝 License

This project is built for educational and portfolio purposes.

---

**PlacementIQ** – Empowering Data-Driven Campuses  
© 2025 PlacementIQ. All rights reserved.
