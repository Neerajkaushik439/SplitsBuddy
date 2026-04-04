# 💸 SplitBuddy — Intelligent Expense Sharing Made Simple

SplitBuddy is a full-stack expense-sharing web application designed to simplify group finances. Whether you're splitting bills with friends, roommates, or colleagues, SplitBuddy ensures transparency, fairness, and minimal transactions with an optimized settlement system.

---

## ✨ Features

- 📱 **Fully Responsive Modern UI**  
  Clean, intuitive, and mobile-friendly interface for seamless usage across devices.

- 🔐 **Google OAuth Authentication**  
  Secure and hassle-free login using Google accounts.

- 👥 **Add Friends via Email**  
  Easily connect and manage expenses with your network.

- 💰 **Expense Splitting System**  
  Add expenses, split equally or unequally, and track balances in real-time.

- ⚡ **Intelligent "Settle Up" Algorithm**  
  Minimizes the number of transactions using an optimized approach based on priority queues.

- 🔔 **Real-Time Notifications**  
  Get instant updates for new expenses, settlements, and friend activity.

- 🛡️ **Rate Limiting for Security**  
  Prevents abuse and ensures API stability.

---

## 🛠️ Tech Stack

**Frontend**
- React.js
- Tailwind CSS / CSS Modules
- Axios

**Backend**
- Node.js
- Express.js

**Database**
- MongoDB (Mongoose ORM)

**Authentication**
- Google OAuth 2.0
- JWT (JSON Web Tokens)

**Other Tools**
- Redis (for rate limiting / caching)
- Nodemailer (email services)
- WebSockets / Socket.io (for real-time notifications)

---

## ⚙️ How It Works

### 📊 Expense Tracking
- Users can create expenses and split them among participants.
- Each transaction updates a balance sheet representing who owes whom.
- The system maintains a net balance for each user.

### 🔄 "Settle Up" Optimization

SplitBuddy uses a **Priority Queue (Min Heap / Max Heap)** based approach to minimize the number of transactions:

- Creditors (positive balances) are stored in a **Max Heap**
- Debtors (negative balances) are stored in a **Min Heap**
- The system repeatedly matches the highest creditor with the highest debtor
- Transactions are settled greedily until all balances reach zero

### 🤔 Why This Approach?

- A naive greedy approach may not minimize the number of transactions.
- Using heaps ensures:
  - Efficient selection of largest debts/credits
  - Reduced total transactions
  - Time complexity optimization

This results in a cleaner and more practical settlement experience.

---

## 📁 Project Structure

```
# 📂 SplitBuddy Project Structure

├── 📁 backend/                  # Node.js + Express Backend
│   ├── 📁 src/                 
│   │   ├── 📁 controllers/      # Request handlers/Logic (e.g., authController.js)
│   │   ├── 📁 models/           # MongoDB database schemas (User, Expense, Notification)
│   │   ├── 📁 routes/           # API Endpoints layout (e.g., authRoutes.js, settleRoutes.js)
│   │   └── 📁 services/         # Core business logic (e.g., AuthService, NotificationService)
│   ├── 📄 .env                  # Backend environment variables (DB Uri, JWT Secret)
│   └── 📄 package.json          # Backend dependencies
│
├── 📁 src/                      # Frontend (React + Vite + Tailwind)
│   ├── 📁 api/                  # Axios instance and API call wrappers
│   ├── 📁 components/           # Reusable UI & Mascot components (e.g., NotificationDropdown.jsx)
│   ├── 📁 context/              # React Context Providers
│   ├── 📁 hooks/                # Custom React hooks
│   ├── 📁 integrations/         # Configuration for third-party setups (like Supabase, etc)
│   ├── 📁 lib/                  # Utility functions
│   ├── 📁 pages/                # Main Application Views (Dashboard.jsx, LoginPage.jsx, etc.)
│   ├── 📁 store/                # Zustand State Management (authStore, dashboardStore, settleupStore)
│   ├── 📄 App.jsx               # Main React Router & Component Wrapper
│   ├── 📄 main.jsx              # React DOM entry point
│   └── 📄 index.css             # Main styling, Tailwind directives
│
├── 📁 public/                   # Static non-compiled assets (favicons, images)
├── 📄 package.json              # Frontend dependencies and npm scripts
├── 📄 tailwind.config.ts        # Tailwind CSS styling and theme configuration
├── 📄 vite.config.ts            # Vite bundler configuration
├── 📄 vercel.json               # Vercel configuration for client-side routing
└── 📄 .env                      # Frontend environment variables (Vite Google Client ID)

```

---

## 🚀 Setup & Installation

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/your-username/splitbuddy.git
cd splitbuddy
```

### 2️⃣ Install Dependencies

**Frontend**
```bash
cd frontend
npm install
```

**Backend**
```bash
cd backend
npm install
```

### 3️⃣ Setup Environment Variables

Create a `.env` file in the backend and frontend directories.

### 4️⃣ Run the Application

**Start Backend**
```bash
cd backend
npm run dev
```

**Start Frontend**
```bash
cd frontend
npm start
```

---

## 🔑 Environment Variables

### Backend (`/backend/.env`)
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret

GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

EMAIL_USER=your_email
EMAIL_PASS=your_email_password

REDIS_URL=your_redis_url
```

### Frontend (`/frontend/.env`)
```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_GOOGLE_CLIENT_ID=your_google_client_id
```

---

## 🔗 API Highlights

### 🔐 Auth Routes
- `POST /api/auth/google`
- `GET /api/auth/user`

### 💸 Expense Routes
- `POST /api/expenses`
- `GET /api/expenses`
- `POST /api/expenses/settle`

### 👥 Friend System
- `POST /api/friends/add`
- `GET /api/friends`

### 🔔 Notification Routes
- `GET /api/notifications`
- `PATCH /api/notifications/read`

---

## 🔒 Security Features

- 🚫 **Rate Limiting**
- 🔑 **JWT Authentication**
- 🧱 **Secure API Handling**

---

## 🚧 Future Improvements

- 📊 Advanced analytics and spending insights  
- 📱 Native mobile app (React Native)  
- 🌍 Multi-currency support  
- 🧾 Receipt scanning with OCR  
- 🤝 Group management enhancements  

---

## ⭐ Final Note

SplitBuddy is built with a focus on clean architecture, scalability, and real-world usability. It demonstrates strong full-stack development practices along with algorithmic optimization in a practical application.

If you found this project useful, consider giving it a ⭐
