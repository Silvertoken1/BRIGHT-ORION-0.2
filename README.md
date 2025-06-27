# 🌟 Bright Orion MLM Admin System

A complete Multi-Level Marketing (MLM) administration system built with Next.js, featuring user management, commission tracking, payment processing, and more.

## ✨ Features

### 🔐 Authentication & Security
- JWT-based authentication
- Role-based access control (Admin, User, Stockist)
- Secure password hashing with bcrypt
- HTTP-only cookies for session management

### 👥 User Management
- User registration with multiple sponsor options
- Profile management and KYC verification
- Referral system with tracking
- User status management (Active, Pending, Suspended)

### 💰 Financial System
- Commission calculation and tracking
- Withdrawal request management
- Payment processing with Paystack integration
- Package purchase system (₦36,000 Starter Package)

### 🎯 Admin Panel
- Comprehensive dashboard with statistics
- User management and status updates
- PIN generation and management
- Commission approval system
- Stockist management
- System settings configuration

### 📊 User Dashboard
- Personal earnings and balance tracking
- Referral management and genealogy
- Training modules and progress tracking
- Support system with live chat
- Achievement badges and gamification

### 🤖 Smart Features
- AI-powered chatbot for user support
- Automated sponsor assignment
- Smart referral link generation
- Email notifications and confirmations
- Mobile-responsive design

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   \`\`\`bash
   git clone <your-repo-url>
   cd bright-orion-mlm-system
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   \`\`\`

3. **Set up environment variables**
   \`\`\`bash
   cp .env.example .env.local
   # Edit .env.local with your actual values
   \`\`\`

4. **Initialize the database**
   \`\`\`bash
   npm run dev
   # Visit http://localhost:3000/api/init to initialize database
   \`\`\`

5. **Start the development server**
   \`\`\`bash
   npm run dev
   \`\`\`

6. **Access the application**
   - Main site: http://localhost:3000
   - Admin panel: http://localhost:3000/admin
   - User dashboard: http://localhost:3000/dashboard

### Default Admin Credentials
- Email: `admin@brightorian.com`
- Password: `admin123`

## 📁 Project Structure

\`\`\`
├── app/                    # Next.js app directory
│   ├── admin/             # Admin panel pages
│   ├── api/               # API routes
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # User dashboard
│   └── ...
├── components/            # Reusable components
│   ├── ui/               # UI components (shadcn/ui)
│   └── ...
├── lib/                   # Utility libraries
│   ├── db/               # Database schema and config
│   ├── auth.ts           # Authentication utilities
│   ├── database.ts       # Database connection
│   └── ...
├── public/               # Static assets
└── styles/               # Global styles
\`\`\`

## 🛠️ Technology Stack

- **Framework**: Next.js 14 (App Router)
- **Database**: SQLite with Drizzle ORM
- **Authentication**: JWT with HTTP-only cookies
- **Styling**: Tailwind CSS + shadcn/ui
- **Payment**: Paystack integration
- **Email**: Nodemailer with SMTP
- **Icons**: Lucide React
- **Charts**: Recharts

## 🔧 Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `JWT_SECRET` | Secret key for JWT tokens | Yes |
| `ADMIN_EMAIL` | Default admin email | Yes |
| `ADMIN_PASSWORD` | Default admin password | Yes |
| `SMTP_HOST` | Email SMTP host | Yes |
| `SMTP_USER` | Email SMTP username | Yes |
| `SMTP_PASS` | Email SMTP password | Yes |
| `PAYSTACK_SECRET_KEY` | Paystack secret key | Yes |
| `NEXT_PUBLIC_APP_URL` | Application URL | Yes |

### Database

The system uses SQLite with Drizzle ORM for development and can be easily switched to PostgreSQL for production.

**Database Schema includes:**
- Users (members, admins, stockists)
- Activation PINs
- Payments and transactions
- Matrix positions
- Commissions
- System settings
- Withdrawals

## 🚀 Deployment

### Vercel (Recommended)

1. **Push to GitHub**
   \`\`\`bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   \`\`\`

2. **Deploy to Vercel**
   - Connect your GitHub repository
   - Set environment variables
   - Deploy automatically

### Other Platforms

The application can be deployed to any platform that supports Node.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## 📱 Features Overview

### For Users
- ✅ Easy 5-field registration
- ✅ Multiple sponsor options
- ✅ Package purchase (₦36,000)
- ✅ Earnings tracking
- ✅ Referral management
- ✅ Training modules
- ✅ Support system

### For Admins
- ✅ User management
- ✅ Commission approval
- ✅ PIN generation
- ✅ System statistics
- ✅ Stockist management
- ✅ Settings configuration

### For Stockists
- ✅ Stock management
- ✅ Sales tracking
- ✅ Commission earnings
- ✅ Customer management

## 🤖 Chatbot Features

- 24/7 automated support
- Registration guidance
- Common question handling
- Live chat escalation
- Multi-language ready

## 💡 Support

For support and questions:
- Email: support@brightorian.com
- Phone: +234-800-000-0000
- Live Chat: Available in the application

## 📄 License

This project is proprietary software. All rights reserved.

---

**Built with ❤️ for Bright Orion MLM System**
