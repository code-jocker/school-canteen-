# Rwanda School Canteen Digital Wallet System

A comprehensive school canteen management system with digital wallet functionality for Rwanda schools. This system allows students to deposit money, make purchases at the canteen, and enables administrators to manage students, track transactions, and monitor canteen operations.

## 🏫 System Overview

### Core Features

#### 1. Student Management
- **Student Registration**: Add new students with personal details (name, admission number, class)
- **Balance Management**: Each student has a digital wallet with deposit/withdrawal capabilities
- **Class Organization**: Students are organized by classes (S1-S6, with streams like S1-A, S1-B, etc.)

#### 2. Authentication & Authorization
The system uses role-based access control with three main roles:

| Role | Access Level |
|------|--------------|
| **Superadmin** | Full system access, can manage all users and settings |
| **Dean Admin** | School administration access, can manage students and view reports |
| **Canteen** | Canteen staff access, can process purchases only |

#### 3. Financial Operations
- **Deposits**: Students/parents can deposit money into student accounts
- **Purchases**: Canteen staff can process purchases with automatic balance deduction
- **Withdrawals**: Authorized withdrawals for refunds or other purposes
- **Transaction History**: Complete audit trail of all financial transactions

#### 4. Reporting & Analytics
- Daily, weekly, and monthly transaction reports
- Class-wise spending analysis
- Top spending students tracking
- Canteen revenue reports

### User Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                        LOGIN PAGE                                │
│  Email & Password → Authentication → Role-based Redirect       │
└──────────────────────────┬──────────────────────────────────────┘
                           │
        ┌──────────────────┼──────────────────┐
        ▼                  ▼                  ▼
   ┌─────────┐      ┌─────────────┐    ┌──────────┐
   │Canteen  │      │  Dashboard  │    │ Purchase │
   │ Staff   │      │  (Admin)    │    │  Page    │
   └────┬────┘      └──────┬──────┘    └────┬─────┘
        │                  │                  │
        │                  ▼                  │
        │           ┌──────────────┐          │
        │           │   Reports    │          │
        │           └──────────────┘          │
        │                  │                  │
        ▼                  ▼                  ▼
   Process           View All            Deduct
   Purchase          Transactions        Balance
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18 or higher)
- **MongoDB** (local or Atlas cloud)
- **npm** or **yarn**

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/code-jocker/school-canteen-.git
   cd school-canteen
   ```

2. **Install Backend Dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Configure Environment**
   Create a `.env` file in the backend directory:
   ```env
   PORT=62822
   MONGODB_URI=mongodb://localhost:27017/school-canteen
   JWT_SECRET=your-secret-key-here
   ```

4. **Install Frontend Dependencies**
   ```bash
   cd frontend
   npm install
   ```

### Running the Application

1. **Start Backend Server**
   ```bash
   cd backend
   npm start
   ```
   Server runs on: `http://localhost:62822`

2. **Start Frontend Development Server**
   ```bash
   cd frontend
   npm run dev
   ```
   Frontend runs on: `http://localhost:3000`

### Default Login Credentials

| Role | Email | Password |
|------|-------|----------|
| Superadmin | admin@school.com | admin123 |
| Dean Admin | dean@school.com | dean123 |
| Canteen | canteen@school.com | canteen123 |

## 📱 Features by Role

### Student (Viewed by Admin)
- View current balance
- View transaction history
- View class spending statistics

### Canteen Staff
- Process student purchases (scan/search student)
- View daily sales
- View recent transactions

### Dean Admin
- Manage students (add/edit/delete)
- Process deposits and withdrawals
- View all reports
- Manage classes

### Superadmin
- All Dean Admin features
- Manage system users
- System settings
- Full data access

## 🔧 Technology Stack

### Frontend
- **React** - UI framework
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **React Router** - Navigation
- **Lucide React** - Icons
- **Axios** - HTTP client

### Backend
- **Node.js** - Runtime
- **Express** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **Bcrypt** - Password hashing

## 📁 Project Structure

```
school-canteen/
├── backend/
│   ├── controllers/     # Request handlers
│   ├── middleware/      # Auth middleware
│   ├── models/         # Database models
│   ├── routes/         # API routes
│   ├── server.js       # Entry point
│   └── .env            # Environment config
│
├── frontend/
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   ├── context/     # React context (Auth)
│   │   ├── pages/      # Page components
│   │   ├── services/   # API services
│   │   ├── App.jsx     # Main app component
│   │   └── main.jsx    # Entry point
│   ├── index.html
│   └── vite.config.js
│
└── README.md
```

## 🔐 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - Register new user (superadmin only)

### Students
- `GET /api/students` - List all students
- `POST /api/students` - Add student
- `GET /api/students/:id` - Get student details
- `PUT /api/students/:id` - Update student
- `DELETE /api/students/:id` - Delete student

### Transactions
- `GET /api/transactions` - List transactions
- `POST /api/transactions/deposit` - Deposit money
- `POST /api/transactions/withdraw` - Withdraw money
- `POST /api/transactions/purchase` - Process purchase

### Classes
- `GET /api/classes` - List classes
- `POST /api/classes` - Add class
- `GET /api/classes/:id/students` - Get students in class

### Reports
- `GET /api/transactions/report/daily` - Daily report
- `GET /api/transactions/report/weekly` - Weekly report
- `GET /api/transactions/report/monthly` - Monthly report

## 🛠️ Troubleshooting

### Common Issues

1. **White screen after login**
   - Check backend connection
   - Verify MongoDB is running
   - Check browser console for errors

2. **Login not redirecting**
   - Clear browser localStorage
   - Check network tab for API responses

3. **Database connection errors**
   - Verify MongoDB URI in .env
   - Check MongoDB service is running

## 📄 License

This project is developed for educational purposes.

## 👨‍💻 Developer

Developed by Code-Jocker for Rwanda School Canteen Digital Wallet System
