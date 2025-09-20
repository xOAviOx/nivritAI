# Supabase Integration Setup Guide

This guide will help you set up the complete user registration and notification system with Supabase for the Nivrit AI healthcare chatbot.

## 🚀 Quick Start

### 1. Supabase Setup

1. **Create a Supabase Project**

   - Go to [supabase.com](https://supabase.com)
   - Create a new project
   - Note down your project URL and API keys

2. **Run Database Schema**
   - Open your Supabase dashboard
   - Go to SQL Editor
   - Copy and paste the contents of `backend-example/supabase-schema.sql`
   - Run the SQL to create all tables and sample data

### 2. Environment Variables

**Backend Environment Variables** (`backend-example/.env`):

```env
# Supabase Configuration
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_here

# Existing Gemini AI keys
GEMINI_API_KEY=your_gemini_api_key_here
WHATSAPP_GEMINI_API_KEY=your_whatsapp_gemini_api_key_here

# Server Configuration
PORT=5000
NODE_ENV=development
```

**Frontend Environment Variables** (`frontend/.env`):

```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_SUPABASE_URL=your_supabase_project_url
REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Install Dependencies

**Backend:**

```bash
cd backend-example
npm install
```

**Frontend:**

```bash
cd frontend
npm install
```

### 4. Start the Application

**Start Backend:**

```bash
cd backend-example
npm start
```

**Start Frontend:**

```bash
cd frontend
npm start
```

## 📋 Features Implemented

### ✅ User Registration & Authentication

- **Registration Form**: Complete form with validation
- **Dynamic UI**: Register page disappears after successful registration
- **Account Page**: Shows user details and preferences
- **Session Management**: JWT-based authentication

### ✅ Admin Panel

- **User Management**: View all registered users
- **Notification Dashboard**: Send notifications to users
- **Bulk Operations**: Send to multiple users at once
- **Template System**: Pre-built notification templates

### ✅ Notification System

- **Multiple Types**: Health tips, vaccination reminders, emergency alerts
- **Delivery Methods**: WhatsApp, SMS, Email (configurable)
- **Dummy Data**: Pre-built sample notifications for testing
- **Real-time Updates**: Users can see their notification history

### ✅ Database Schema

- **Users Table**: Store user information
- **Admin Users**: Admin authentication
- **Notifications**: Track all sent notifications
- **Preferences**: User notification preferences
- **Templates**: Reusable notification templates

## 🎯 How to Test

### 1. User Registration

1. Open the application (should show registration page)
2. Fill in the registration form
3. After successful registration, you'll see the account page
4. The registration page will disappear

### 2. Admin Login

1. Default admin credentials:
   - Email: `admin@nivritai.com`
   - Password: `admin123`
2. Login to access the admin panel

### 3. Send Notifications

1. **Demo Notifications**: Click "Send Demo Notifications" to send sample notifications to all users
2. **Custom Notifications**:
   - Go to Users tab, select users
   - Go to Send Notifications tab
   - Fill in details and send
3. **Dummy Data**: Use "Send with Dummy Data" button for quick testing

## 🔧 API Endpoints

### Authentication

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/admin/login` - Admin login
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/preferences` - Update user preferences

### Admin

- `GET /api/admin/users` - Get all users
- `POST /api/admin/notifications/send` - Send notifications
- `GET /api/admin/templates` - Get notification templates

### User

- `GET /api/auth/notifications` - Get user notifications

## 📊 Database Tables

### `users`

- Stores user registration information
- Includes preferences and profile data

### `admin_users`

- Admin authentication
- Role-based access control

### `notifications`

- All sent notifications
- Tracks delivery status and method

### `notification_preferences`

- User notification settings
- Channel preferences (WhatsApp, SMS, Email)

### `notification_templates`

- Reusable message templates
- Multi-language support

## 🎨 UI Features

### Registration Page

- Multi-language support
- Form validation
- Responsive design
- Beautiful animations

### Account Page

- User profile display
- Notification preferences
- Notification history
- Tabbed interface

### Admin Panel

- Dashboard with statistics
- User management
- Notification composer
- Demo actions for testing

## 🚨 Demo Notifications

The system includes pre-built dummy notifications:

1. **Health Tips**: Daily health advice
2. **Vaccination Reminders**: Vaccination schedule alerts
3. **Emergency Alerts**: Urgent health warnings
4. **Appointment Reminders**: Healthcare appointment notifications

## 🔐 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Row Level Security (RLS) in Supabase
- Input validation and sanitization
- CORS protection

## 📱 Mobile Responsive

- All components are mobile-responsive
- Touch-friendly interface
- Optimized for various screen sizes

## 🌐 Multi-language Support

- English, Hindi, Gujarati, Bengali, Punjabi, Tamil, Telugu, Kannada, Malayalam
- User can select preferred language during registration
- Notifications can be sent in user's preferred language

## 🎯 Next Steps

1. **WhatsApp Integration**: Connect with existing WhatsApp bot
2. **SMS Integration**: Add Twilio or other SMS service
3. **Email Integration**: Add email service provider
4. **Advanced Analytics**: Track notification delivery and engagement
5. **Scheduled Notifications**: Add cron job functionality
6. **Voice Notifications**: Integrate with voice calling services

## 🐛 Troubleshooting

### Common Issues

1. **Supabase Connection Error**

   - Check your environment variables
   - Ensure Supabase project is active
   - Verify API keys are correct

2. **Registration Fails**

   - Check backend server is running
   - Verify database schema is created
   - Check console for error messages

3. **Admin Login Issues**

   - Default credentials: admin@nivritai.com / admin123
   - Check if admin user exists in database
   - Verify JWT secret is set

4. **Notifications Not Sending**
   - Check user selection
   - Verify notification preferences
   - Check backend logs for errors

## 📞 Support

If you encounter any issues:

1. Check the console for error messages
2. Verify all environment variables are set
3. Ensure Supabase project is properly configured
4. Check that all dependencies are installed

## 🎉 Success!

Once everything is set up, you'll have:

- ✅ Complete user registration system
- ✅ Dynamic UI that changes based on user state
- ✅ Admin panel for sending notifications
- ✅ Dummy data for testing
- ✅ Multi-language support
- ✅ Mobile-responsive design

The system is now ready for production use with real notification services!
