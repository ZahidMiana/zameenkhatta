# 🚀 Quick Start Guide - Zameen Khatta

## 📋 Prerequisites

- **Node.js** (v18.0.0 or higher)
- **npm** or **pnpm** package manager
- **PostgreSQL** database (Local or Cloud)
- **Redis** (Optional, for caching)

## ⚡ Quick Setup (5 Minutes)

### 1. **Clone & Install**
```bash
git clone <repository-url>
cd ZameenKhatta
npm install --legacy-peer-deps
```

### 2. **Environment Setup**
Create `.env` file with your configuration:
```env
# Database (Required)
DATABASE_URL="postgresql://username:password@host:port/database"

# NextAuth (Required)
NEXTAUTH_SECRET="your-32-character-secret"
NEXTAUTH_URL="http://localhost:3000"

# Email (Optional but recommended)
EMAIL_HOST="smtp.gmail.com"
EMAIL_PORT=587
EMAIL_USER="your-email@gmail.com"
EMAIL_PASS="your-app-password"
EMAIL_FROM="Your App <your-email@gmail.com>"

# Redis (Optional)
REDIS_URL="redis://localhost:6379"

# File Upload
UPLOAD_DIR="./public/uploads"
MAX_FILE_SIZE=5242880
```

### 3. **Database Setup**
```bash
# Generate Prisma client
npx prisma generate

# Push schema to database
npx prisma db push

# Create admin user
node scripts/create-admin.js
```

### 4. **Run Application**
```bash
npm run dev
```

## 🌐 **Access Your Application**

- **Frontend**: http://localhost:3000
- **Admin Panel**: http://localhost:3000/admin
- **Database Studio**: `npx prisma studio` → http://localhost:5555

## 🔐 **Default Login Credentials**

### Admin Access
- **Email**: `admin@zameen.com`
- **Password**: `admin123`

## 🎯 **Key Features to Test**

### ✅ **For Users:**
1. **Register**: Create new account → Check email for welcome message
2. **Login**: Access user dashboard
3. **Browse Properties**: View property listings with filters
4. **Property Details**: View images, contact agent, schedule viewing
5. **Contact Form**: Send inquiries → Check email notifications
6. **Dashboard**: Manage profile, favorites, listings

### ✅ **For Admin:**
1. **Login**: Access admin panel at `/admin`
2. **User Management**: View and manage users
3. **Property Management**: Approve/reject listings
4. **Analytics**: View platform statistics
5. **Content Management**: Manage blog posts, testimonials

## 🛠️ **Available Scripts**

```bash
# Development
npm run dev          # Start development server

# Production
npm run build        # Build for production
npm start           # Start production server

# Database
npx prisma studio    # Open database viewer
npx prisma generate  # Generate Prisma client
npx prisma db push   # Push schema changes

# Testing
npm run lint         # Check code quality
```

## 🔧 **Troubleshooting**

### Common Issues:

1. **Database Connection Error**
   ```bash
   # Check your DATABASE_URL in .env
   node test-db-connection.js
   ```

2. **Email Not Working**
   ```bash
   # Verify Gmail app password is correct
   # Enable 2FA and generate app password
   ```

3. **Build Errors**
   ```bash
   # Clear cache and reinstall
   rm -rf .next node_modules
   npm install --legacy-peer-deps
   ```

4. **Port Already in Use**
   ```bash
   # Kill process on port 3000
   npx kill-port 3000
   # Or use different port
   PORT=3001 npm run dev
   ```

## 📊 **Project Structure**

```
ZameenKhatta/
├── src/
│   ├── app/           # Next.js App Router pages
│   ├── components/    # Reusable UI components
│   ├── lib/          # Utilities, database, services
│   └── types/        # TypeScript type definitions
├── public/           # Static assets
├── scripts/          # Database scripts
└── prisma/          # Database schema
```

## 🎉 **Success Indicators**

✅ Server starts without errors  
✅ Database connection successful  
✅ Admin user created  
✅ Email notifications working  
✅ File uploads functional  
✅ All pages load properly  

## 📞 **Need Help?**

- Check the main `README.md` for detailed documentation
- View logs in terminal for error messages
- Use `npx prisma studio` to verify database data
- Test email functionality with forgot password feature

---

**🚀 Your Zameen Khatta real estate platform is ready!**
