# 🎓 Student Expense Tracker (Full-Stack MERN Architecture)

A modern, responsive, and full-stack **Student Expense Tracker** designed to help college and university students manage their day-to-day spending, track textbooks, meals, transit, and stay within their monthly budget.

---

## 🚀 Tech Stack

### Frontend
- **React.js** (v18) + **Vite**
- **Tailwind CSS** (Custom student finance color palette & sleek typography)
- **Axios** (API communication service with centralized error interceptors)
- **React Router** (Client-side routing)
- **Recharts** (Interactive Donut & Bar charts for spending analytics)
- **Lucide React** (Modern iconography)

### Backend
- **Node.js** + **Express.js**
- **REST API** architecture
- **CORS** & **Dotenv** configuration
- **Dual Data Layer**: Active **In-Memory Data Store** for out-of-the-box operation with realistic student seed data, and a prepared **Mongoose / MongoDB Schema** ready for one-click connection.

---

## 📁 Project Folder Structure

```
StudentExpenseTracker/
├── backend/
│   ├── config/
│   │   └── db.js                 # Prepared MongoDB Atlas connection with safe in-memory fallback
│   ├── controllers/
│   │   └── expenseController.js  # Full CRUD logic + statistical calculations
│   ├── data/
│   │   ├── initialExpenses.js    # Realistic seed data for student expenses
│   │   └── inMemoryStore.js      # Robust in-memory CRUD & filter data layer
│   ├── middleware/
│   │   ├── errorHandler.js       # Centralized error handler
│   │   └── validateExpense.js    # Payload validation middleware (title, amount, category, date)
│   ├── models/
│   │   └── Expense.js            # Mongoose Schema definition & category validation
│   ├── routes/
│   │   └── expenseRoutes.js      # REST API endpoints mapping
│   ├── .env.example              # Template environment variables
│   ├── package.json              # Express, cors, dotenv, mongoose, nodemon
│   └── server.js                 # Express server entry point (Port 5000)
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── dashboard/        # StatCard, CategoryChart, MonthlyBarChart, RecentExpenses
│   │   │   ├── expenses/         # ExpenseTable, ExpenseCard, ExpenseFilters, ExpenseFormModal, DeleteConfirmModal
│   │   │   ├── layout/           # Navbar, Sidebar
│   │   │   └── ui/               # Badge, Toast, EmptyState, LoadingSkeleton
│   │   ├── context/
│   │   │   └── ExpenseContext.jsx# Centralized React state management (CRUD, filters, stats, toasts)
│   │   ├── hooks/
│   │   │   └── useExpenses.js    # Easy custom hook for consuming expense state
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx     # Overview metrics, charts, quick actions
│   │   │   ├── ExpensesPage.jsx  # Search, filter, edit, delete, and CSV export
│   │   │   ├── AnalyticsPage.jsx # Budget goal tracker, safe daily pace, student saving tips
│   │   │   └── NotFound.jsx      # 404 page
│   │   ├── services/
│   │   │   └── api.js            # Axios client configured with base URL & interceptors
│   │   ├── utils/
│   │   │   ├── constants.js      # Categories, color mappings, presets, sort options
│   │   │   └── formatters.js     # Currency ($ USD), readable dates, relative time helpers
│   │   ├── App.jsx               # Route definitions & layout container
│   │   ├── index.css             # Tailwind CSS directives & custom styling
│   │   └── main.jsx              # React DOM entry point
│   ├── index.html
│   ├── tailwind.config.js        # Custom theme colors (brand indigo, category accents)
│   ├── postcss.config.js
│   ├── vite.config.js            # Vite config with /api proxy to Port 5000
│   └── package.json
│
└── README.md
```

---

## 🔄 How the Frontend Communicates with the Backend

1. **Axios API Service (`frontend/src/services/api.js`)**:
   - Manages all HTTP requests (`GET`, `POST`, `PUT`, `DELETE`).
   - Configured with a default base URL (`http://localhost:5000/api`) or proxied `/api` in development.
   - Automatically handles JSON response parsing and standardizes error responses.

2. **State Management (`frontend/src/context/ExpenseContext.jsx`)**:
   - Fetches and synchronizes expense data and dashboard calculations.
   - When an expense is created, updated, or deleted, it triggers immediate state refresh and fires floating toast notifications.

3. **REST API Architecture**:
   - The Express backend processes incoming JSON payloads, validates fields with `validateExpense.js`, and interacts with the data layer.

---

## 📡 Available REST API Endpoints

Base URL: `http://localhost:5000/api`

| Method | Endpoint | Description | Query Parameters / Body |
| :--- | :--- | :--- | :--- |
| `GET` | `/health` | API health check & server status | None |
| `GET` | `/expenses` | Get all expenses (supports search & filters) | `?search=`, `?category=`, `?startDate=`, `?endDate=`, `?sortBy=`, `?order=` |
| `GET` | `/expenses/stats` | Get dashboard statistical calculations | Total spending, count, monthly spending, highest expense, category breakdown |
| `GET` | `/expenses/:id` | Get a single expense by ID | None |
| `POST` | `/expenses` | Create a new expense | `{ "title": "Textbook", "amount": 45.00, "category": "Education", "date": "2026-08-17", "description": "..." }` |
| `PUT` | `/expenses/:id` | Update an existing expense | Same as POST body |
| `DELETE` | `/expenses/:id` | Delete an expense by ID | None |

### Supported Categories:
- `Food`
- `Transport`
- `Education`
- `Shopping`
- `Entertainment`
- `Other`

---

## ⚡ How to Start the Project Locally

### Prerequisites:
- Node.js (v18 or higher recommended)
- npm or yarn

### 1. Start the Backend Server (Port 5000)
Open a terminal in the project root:
```bash
cd backend
npm install
npm run dev
```
> The backend will start on **`http://localhost:5000`** with the active in-memory data store.

### 2. Start the Frontend Dev Server (Port 5173)
Open a second terminal in the project root:
```bash
cd frontend
npm install
npm run dev
```
> The frontend will start on **`http://localhost:5173`**. Open this URL in your web browser.

---

## 🍃 Connecting MongoDB Atlas (Next Step Guide)

The backend is fully prepared with Mongoose models and queries. When you are ready to connect your live MongoDB database:

1. **Create your MongoDB Atlas Cluster**:
   - Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and create a free shared cluster.
   - Create a database user with username and password under **Database Access**.
   - Add your current IP (or `0.0.0.0/0`) under **Network Access**.

2. **Configure `.env` in the `backend/` folder**:
   - Copy `.env.example` to `.env`:
     ```bash
     cd backend
     cp .env.example .env
     ```
   - In `.env`, set your connection string:
     ```env
     PORT=5000
     NODE_ENV=development
     MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/student_expense_tracker?retryWrites=true&w=majority
     ```

3. **Restart the Backend Server**:
   - Run `npm run dev` in `backend/`.
   - The server will automatically detect `MONGO_URI` and connect to MongoDB Atlas via `backend/config/db.js`.
