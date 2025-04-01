# 📚 ExamPortal - Modern Online Examination System

Hey there! 👋 Welcome to ExamPortal, a super cool Next.js application for conducting online exams. Let's get you started! 🚀

## dev team
rambhadra 
divyansh 
dinesh 
sriya 

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 (App Router) + Tailwind CSS 
- **Backend**: Next.js API Routes
- **Database**: MongoDB
- **Authentication**: NextAuth.js
- **Styling**: Tailwind CSS + Shadcn UI
- **State Management**: React Hooks

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ installed
- MongoDB Atlas account
- Git 

### 1️⃣ First Step: Environment Setup

Create a `.env` file in your root directory:
```env
# MongoDB Connection
MONGODB_URI=your_mongodb_uri_here


```

### 2️⃣ MongoDB Atlas Setup

1. Create account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create new cluster (free tier works great! 🎉)
3. Click "Connect" and choose "Connect your application"
4. Copy the connection string
5. Replace `<password>` with your database password in the URI

### 3️⃣ Installation

```bash
# Clone the repo (if using Git)
git clone https://github.com/yourusername/examportal.git

# Install dependencies
npm install

# Run development server
npm run dev
```

Visit http://localhost:3000 - You're all set! 🎉

## ✨ Features

### 👨‍🎓 Student Features
- 📝 Take exams with auto-save
- ⏱️ Timer for each exam
- 📊 View results instantly
- 📈 Track progress
- 📱 Responsive design

### 👨‍🏫 Teacher Features
- ✍️ Create & manage exams
- 📚 Add questions with options
- 📊 View student results
- 📈 Generate reports
- 🎯 Set passing criteria

### 👨‍💼 Admin Features
- 👥 User management
- 📚 Subject management
- 📊 System analytics
- 🔒 Role-based access

## 🗂️ Project Structure

```bash
examportal/
├── src/
│   ├── app/
│   │   ├── api/                    # API Routes
│   │   │   ├── auth/              # Authentication endpoints
│   │   │   │   ├── [...nextauth]  # NextAuth configuration
│   │   │   │   └── me/            # Current user endpoint
│   │   │   ├── admin/            # Admin API routes
│   │   │   ├── student/          # Student API routes
│   │   │   │   ├── exam/         # Exam-related endpoints
│   │   │   │   ├── results/      # Results endpoints
│   │   │   │   └── profile/      # Profile endpoints
│   │   │   └── teacher/          # Teacher API routes
│   │   ├── student/              # Student Pages
│   │   │   ├── dashboard/        # Student dashboard
│   │   │   ├── exam/            # Exam taking interface
│   │   │   ├── results/         # Results viewing
│   │   │   └── profile/         # Profile management
│   │   ├── teacher/             # Teacher Pages
│   │   │   ├── dashboard/       # Teacher dashboard
│   │   │   ├── exams/          # Exam management
│   │   │   └── results/        # Results management
│   │   ├── admin/              # Admin Pages
│   │   │   ├── dashboard/      # Admin dashboard
│   │   │   ├── users/         # User management
│   │   │   └── subjects/      # Subject management
│   │   ├── layout.jsx         # Root layout
│   │   └── page.jsx          # Home page
│   ├── components/            # Reusable Components
│   │   ├── ui/               # UI components
│   │   │   ├── Button.jsx
│   │   │   ├── Card.jsx
│   │   │   └── Input.jsx
│   │   ├── auth/             # Auth components
│   │   ├── exam/             # Exam components
│   │   └── shared/           # Shared components
│   ├── lib/                  # Utilities & Configurations
│   │   ├── dbConnect.js      # MongoDB connection
│   │   ├── authmiddleware.js # Auth middleware
│   │   └── utils.js         # Helper functions
│   ├── model/               # MongoDB Models
│   │   ├── User.js         # User model
│   │   ├── Exam.js         # Exam model
│   │   └── Result.js       # Result model
│   └── styles/             # Global Styles
│       └── globals.css     # Global CSS
├── public/                 # Static Files
│   ├── images/            # Image assets
│   └── icons/            # Icon assets
├── .env                  # Environment variables
├── .env.example         # Example environment variables
├── .gitignore          # Git ignore rules
├── next.config.js      # Next.js configuration
├── package.json        # Project dependencies
├── postcss.config.js   # PostCSS configuration
├── tailwind.config.js  # Tailwind CSS configuration
└── README.md          # Project documentation
```

