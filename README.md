# 💰 Expense Tracker

A modern, professional expense tracking application built with React and Node.js. Track your income, expenses, set budgets, and get detailed financial insights with a beautiful, responsive UI.

![Expense Tracker](https://img.shields.io/badge/React-18.2.0-blue) ![Node.js](https://img.shields.io/badge/Node.js-16.0+-green) ![MongoDB](https://img.shields.io/badge/MongoDB-5.0+-brightgreen) ![License](https://img.shields.io/badge/License-MIT-yellow)

## ✨ Features

### 🎯 **Core Functionality**
- **Transaction Management**: Add, view, edit, and delete income/expense transactions
- **Budget Tracking**: Set monthly budgets and monitor spending against limits
- **Category Management**: Organize transactions by customizable categories
- **Payment Methods**: Track transactions across different payment methods (Cash, Bank, UPI, Credit Card)

### 📊 **Analytics & Reports**
- **Financial Dashboard**: Real-time overview of your financial health
- **Detailed Reports**: Comprehensive analytics with charts and insights
- **Category Breakdown**: Visual analysis of spending patterns
- **Period Filtering**: View data by week, month, quarter, or year
- **Export Capabilities**: Download reports for external analysis

### 🎨 **User Experience**
- **Modern UI**: Professional, industry-level design with smooth animations
- **Mobile Responsive**: Optimized for all devices and screen sizes
- **Real-time Updates**: Instant data synchronization across components
- **Smart Notifications**: Budget alerts and spending warnings
- **Intuitive Navigation**: Easy-to-use interface with clear visual hierarchy

### 🔐 **Security & Authentication**
- **JWT Authentication**: Secure user authentication with JSON Web Tokens
- **Password Hashing**: Bcrypt encryption for password security
- **Protected Routes**: Secure access to user-specific data
- **Session Management**: Persistent login sessions

## 🚀 Quick Start

### Prerequisites
- Node.js (v16.0 or higher)
- MongoDB (v5.0 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/expense-tracker.git
   cd expense-tracker
   ```

2. **Install Backend Dependencies**
   ```bash
   cd expense-tracker-backend
   npm install
   ```

3. **Install Frontend Dependencies**
   ```bash
   cd ../expense-tracker-frontend
   npm install
   ```

4. **Environment Setup**
   
   Create a `.env` file in the `expense-tracker-backend` directory:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/expense-tracker
   JWT_SECRET=your-super-secret-jwt-key-here
   NODE_ENV=development
   ```

5. **Start MongoDB**
   ```bash
   # Make sure MongoDB is running on your system
   mongod
   ```

6. **Start the Backend Server**
   ```bash
   cd expense-tracker-backend
   npm start
   ```

7. **Start the Frontend Development Server**
   ```bash
   cd expense-tracker-frontend
   npm run dev
   ```

8. **Open the Application**
   
   Navigate to `http://localhost:5173` in your browser.

## 📁 Project Structure

```
expense-tracker/
├── expense-tracker-backend/          # Backend API
│   ├── config/
│   │   └── db.js                     # Database configuration
│   ├── controllers/                  # Route controllers
│   │   ├── authController.js         # Authentication logic
│   │   ├── budgetController.js       # Budget management
│   │   └── transactionController.js  # Transaction operations
│   ├── middleware/
│   │   └── authMiddleware.js         # JWT authentication middleware
│   ├── models/                       # MongoDB models
│   │   ├── User.js                   # User schema
│   │   ├── Transaction.js            # Transaction schema
│   │   └── Budget.js                 # Budget schema
│   ├── routes/                       # API routes
│   │   ├── authRoutes.js             # Authentication routes
│   │   ├── budgetRoutes.js           # Budget routes
│   │   └── transactionRoutes.js      # Transaction routes
│   ├── server.js                     # Express server setup
│   └── package.json
├── expense-tracker-frontend/         # React Frontend
│   ├── public/
│   ├── src/
│   │   ├── components/               # Reusable components
│   │   │   ├── Navigation/           # Navigation bar
│   │   │   ├── TransactionForm/      # Add/edit transactions
│   │   │   ├── TransactionList/      # Display transactions
│   │   │   ├── BudgetCard/           # Budget management
│   │   │   └── Loader/               # Loading components
│   │   ├── pages/                    # Main pages
│   │   │   ├── Dashboard/            # Main dashboard
│   │   │   ├── Reports/              # Analytics & reports
│   │   │   ├── Login/                # User login
│   │   │   └── Register/             # User registration
│   │   ├── context/                  # React context
│   │   │   └── AuthContext.jsx       # Authentication context
│   │   ├── services/                 # API services
│   │   │   └── api.js                # Axios configuration
│   │   └── App.jsx                   # Main App component
│   └── package.json
└── README.md
```

## 🛠️ Technology Stack

### **Frontend**
- **React 18.2.0** - Modern UI library
- **Vite** - Fast build tool and development server
- **React Router** - Client-side routing
- **Axios** - HTTP client for API calls
- **CSS3** - Modern styling with animations and responsive design

### **Backend**
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Tokens for authentication
- **Bcryptjs** - Password hashing
- **CORS** - Cross-origin resource sharing

## 📱 Screenshots

### Dashboard
![Dashboard](https://via.placeholder.com/800x400/3b82f6/ffffff?text=Dashboard+View)

### Reports
![Reports](https://via.placeholder.com/800x400/8b5cf6/ffffff?text=Analytics+Reports)

### Mobile View
![Mobile](https://via.placeholder.com/400x800/06b6d4/ffffff?text=Mobile+Responsive)

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Transactions
- `GET /api/transactions` - Get all transactions
- `POST /api/transactions` - Create new transaction
- `PUT /api/transactions/:id` - Update transaction
- `DELETE /api/transactions/:id` - Delete transaction

### Budgets
- `GET /api/budgets/:month` - Get budget for specific month
- `POST /api/budgets` - Set/update budget

## 🎨 UI/UX Features

### **Design Principles**
- **Modern Aesthetics**: Clean, professional design with gradient backgrounds
- **Responsive Layout**: Mobile-first approach with flexible grid systems
- **Smooth Animations**: CSS transitions and hover effects for better UX
- **Color Psychology**: Strategic use of colors for financial data visualization

### **Mobile Optimization**
- **Touch-Friendly**: Properly sized buttons and interactive elements
- **Responsive Typography**: Scalable fonts that remain readable on all devices
- **Flexible Layouts**: Components that adapt to different screen sizes
- **Performance**: Optimized for mobile data usage and battery life

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Encryption**: Bcrypt hashing for password security
- **Input Validation**: Server-side validation for all user inputs
- **CORS Protection**: Configured for secure cross-origin requests
- **Environment Variables**: Sensitive data stored in environment variables

## 🚀 Deployment

### **Backend Deployment (Heroku)**
1. Create a new Heroku app
2. Set environment variables in Heroku dashboard
3. Connect your GitHub repository
4. Deploy the backend

### **Frontend Deployment (Vercel/Netlify)**
1. Build the frontend: `npm run build`
2. Deploy to Vercel or Netlify
3. Update API endpoints to production URLs

### **Database (MongoDB Atlas)**
1. Create a MongoDB Atlas account
2. Create a new cluster
3. Get connection string and update environment variables

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -m 'Add some feature'`
4. Push to branch: `git push origin feature-name`
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Your Name**
- GitHub: [@yourusername](https://github.com/yourusername)
- LinkedIn: [Your LinkedIn](https://linkedin.com/in/yourprofile)
- Email: your.email@example.com

## 🙏 Acknowledgments

- React team for the amazing framework
- MongoDB for the flexible database solution
- Express.js for the robust backend framework
- All open-source contributors who made this project possible

## 📞 Support

If you have any questions or need help with the project, please:

1. Check the [Issues](https://github.com/yourusername/expense-tracker/issues) page
2. Create a new issue with detailed description
3. Contact the author directly

---

⭐ **Star this repository if you found it helpful!**

Made with ❤️ and JavaScript
