# 🧪 BRIGHT ORION MLM SYSTEM - TESTING GUIDE

## 🚀 Quick Start

### 1. Install Dependencies
\`\`\`bash
npm install
\`\`\`

### 2. Start Development Server
\`\`\`bash
# For localhost only
npm run dev-local

# For network access (share with others)
npm run dev-network
\`\`\`

### 3. Initialize Database
Visit: `http://localhost:3000/api/init`

### 4. Get Network Info
\`\`\`bash
npm run setup
\`\`\`

## 🔐 Login Credentials

### 👨‍💼 ADMIN LOGIN
- **Email:** admin@brightorian.com
- **Password:** Admin123!
- **Member ID:** BO000001
- **Access:** Full admin panel

### 👤 USER LOGIN
- **Email:** john.doe@brightorian.com
- **Password:** User123!
- **Member ID:** BO000002
- **Balance:** ₦35,000

## 🌐 Access URLs

### Local Access (Your Computer Only)
- **Main Site:** http://localhost:3000
- **Admin Panel:** http://localhost:3000/admin
- **User Dashboard:** http://localhost:3000/dashboard
- **Login Page:** http://localhost:3000/auth/login

### Network Access (Share with Others)
Replace `192.168.1.100` with your actual IP address:
- **Main Site:** http://192.168.1.100:3000
- **Admin Panel:** http://192.168.1.100:3000/admin
- **User Dashboard:** http://192.168.1.100:3000/dashboard
- **Login Page:** http://192.168.1.100:3000/auth/login

## 📱 Testing Checklist

### ✅ Admin Panel Testing
- [ ] Login with admin credentials
- [ ] View dashboard statistics
- [ ] Manage users (view, activate, suspend)
- [ ] Generate activation PINs
- [ ] Approve/reject commissions
- [ ] Process withdrawals
- [ ] View system settings

### ✅ User Dashboard Testing
- [ ] Login with user credentials
- [ ] View earnings and balance
- [ ] Check commission history
- [ ] View transaction history
- [ ] Test withdrawal request
- [ ] View referral information
- [ ] Update profile information

### ✅ Registration Testing
- [ ] Register new user
- [ ] Test with referral link
- [ ] Test PIN activation
- [ ] Test form validation
- [ ] Test mobile experience

### ✅ Mobile Testing
- [ ] Test on smartphone
- [ ] Test on tablet
- [ ] Check responsive design
- [ ] Test touch interactions
- [ ] Test form inputs

### ✅ Network Testing
- [ ] Access from another device
- [ ] Test on different browsers
- [ ] Test login from mobile
- [ ] Test admin panel on mobile
- [ ] Share link with team members

## 🔧 Troubleshooting

### Database Issues
\`\`\`bash
# Delete database and restart
rm bright-orion.db*
npm run dev
# Visit: http://localhost:3000/api/init
\`\`\`

### Network Access Issues
\`\`\`bash
# Check your IP address
# Windows:
ipconfig

# Mac/Linux:
ifconfig
\`\`\`

### Port Issues
\`\`\`bash
# Use different port
npm run dev-network -- -p 3001
\`\`\`

## 📊 Sample Data Included

### Users
- 1 Admin user (full access)
- 1 Test user (with earnings and transactions)

### Financial Data
- ₦65,000 total earnings for test user
- ₦35,000 available balance
- Multiple commission records
- Sample withdrawal history
- Transaction history

### System Data
- 10 activation PINs ready to use
- System settings configured
- Commission structure set up
- Referral system active

## 🎯 Key Features to Test

### 🏢 Admin Features
- Real-time statistics
- User management
- PIN generation and management
- Commission approval system
- Withdrawal processing
- System configuration

### 👤 User Features
- Earnings tracking
- Balance management
- Commission history
- Transaction history
- Withdrawal requests
- Referral system
- Profile management

### 🔒 Security Features
- JWT authentication
- Password hashing
- Role-based access
- Session management
- Input validation

## 📞 Support

If you encounter any issues during testing:
1. Check the console for error messages
2. Verify database initialization
3. Confirm network connectivity
4. Test with different browsers
5. Check mobile compatibility

Happy Testing! 🚀
