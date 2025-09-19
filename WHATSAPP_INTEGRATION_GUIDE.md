# 📱 WhatsApp Integration Guide

This guide explains how to attach a WhatsApp chat link to your AI healthcare chatbot website.

## 🚀 Quick Setup

### 1. Configure Your WhatsApp Number

Edit the configuration file: `frontend/src/config/whatsapp.js`

```javascript
export const WHATSAPP_CONFIG = {
  // Replace with your actual WhatsApp number
  PHONE_NUMBER: "+919876543210", // Example for India
  DEFAULT_MESSAGE: "Hello! I need help with healthcare information.",
  API_BASE_URL: "http://localhost:5000",
  // ... rest of config
};
```

### 2. Start Your Backend WhatsApp Bot

```bash
cd backend-example
npm install
cp env.example .env
# Add your GEMINI_API_KEY to .env
npm run whatsapp
```

### 3. Scan QR Code

1. Wait for QR code to appear in terminal
2. Open WhatsApp on your phone
3. Go to **Settings > Linked Devices > Link a Device**
4. Scan the QR code
5. Your bot is ready! 🎉

## 🔧 Integration Methods

### Method 1: Direct WhatsApp Link (Simplest)

This opens WhatsApp Web/App with a pre-filled message:

```javascript
const whatsappUrl = `https://wa.me/919876543210?text=${encodeURIComponent(
  "Your message here"
)}`;
window.open(whatsappUrl, "_blank");
```

### Method 2: Backend WhatsApp Bot Integration

Your website now includes:

- **Status Indicator**: Shows if WhatsApp bot is online/offline
- **Real-time Monitoring**: Checks bot status every 30 seconds
- **User Count**: Displays active users
- **Smart Buttons**: Only enabled when bot is online

### Method 3: Custom WhatsApp Integration

You can customize the integration by modifying:

- `frontend/src/config/whatsapp.js` - Configuration
- `frontend/src/pages/Chatbot.jsx` - Main chatbot page
- `frontend/src/components/ChatWindow.jsx` - Chat window component

## 📋 Features Included

### ✅ What's Already Implemented

1. **WhatsApp Chat Buttons**

   - In chat window header
   - In sidebar features section
   - Pre-fills with current conversation

2. **Status Monitoring**

   - Real-time bot status checking
   - Visual indicators (green/red)
   - User count display

3. **Configuration Management**

   - Centralized config file
   - Easy phone number updates
   - Customizable messages

4. **Backend Integration**
   - WhatsApp Web API bot
   - Healthcare-focused responses
   - Multilingual support (English/Hindi)

### 🔄 How It Works

1. **User clicks WhatsApp button**
2. **System checks bot status**
3. **Opens WhatsApp with pre-filled message**
4. **User can continue conversation in WhatsApp**
5. **Bot responds using same AI as website**

## 🛠️ Customization Options

### Change WhatsApp Number

```javascript
// In frontend/src/config/whatsapp.js
PHONE_NUMBER: "+1234567890", // Your number here
```

### Customize Default Message

```javascript
// In frontend/src/config/whatsapp.js
DEFAULT_MESSAGE: "Hi! I need healthcare assistance.",
```

### Change Backend URL

```javascript
// In frontend/src/config/whatsapp.js
API_BASE_URL: "https://your-backend-domain.com",
```

### Add More WhatsApp Buttons

```jsx
<button
  onClick={() => {
    const whatsappUrl = WHATSAPP_CONFIG.getWhatsAppUrl(
      WHATSAPP_CONFIG.PHONE_NUMBER,
      "Custom message here"
    );
    window.open(whatsappUrl, "_blank");
  }}
  className="your-styles"
>
  Chat on WhatsApp
</button>
```

## 🌐 Production Considerations

### For Production Use

1. **WhatsApp Business API**: Consider upgrading from WhatsApp Web API
2. **Phone Number**: Use a dedicated business number
3. **Rate Limits**: Implement proper rate limiting
4. **Monitoring**: Add proper logging and monitoring
5. **Security**: Secure your API endpoints

### Environment Variables

```env
# Backend .env file
GEMINI_API_KEY=your_gemini_api_key
WHATSAPP_SESSION_PATH=./whatsapp-session
WHATSAPP_CLIENT_ID=healthcare-bot
PORT=5000
```

## 🔍 Troubleshooting

### Bot Not Starting

1. Check if `.env` file exists
2. Verify `GEMINI_API_KEY` is set
3. Make sure all dependencies are installed

### QR Code Not Working

1. Make sure WhatsApp is updated
2. Try clearing WhatsApp cache
3. Restart the bot and scan again

### Status Shows Offline

1. Check if backend is running
2. Verify API endpoint is accessible
3. Check console for errors

### WhatsApp Link Not Working

1. Verify phone number format (include country code)
2. Check if number has WhatsApp
3. Test with different browsers

## 📱 Testing

### Test WhatsApp Integration

1. **Start the backend**: `npm run whatsapp`
2. **Start the frontend**: `npm start`
3. **Open website**: Go to chatbot page
4. **Click WhatsApp button**: Should open WhatsApp
5. **Send message**: Bot should respond

### Test Bot Status

1. **Check status endpoint**: `GET /api/whatsapp/status`
2. **Verify response**: Should show bot status
3. **Monitor in UI**: Status should update in real-time

## 🎯 Next Steps

### Enhancements You Can Add

1. **WhatsApp Web Widget**: Floating chat button
2. **Message Templates**: Pre-defined message templates
3. **User Authentication**: Track users across platforms
4. **Analytics**: Track WhatsApp engagement
5. **Scheduled Messages**: Send reminders
6. **Rich Messages**: Images, documents, location

### Integration with Other Platforms

1. **Telegram Bot**: Similar integration
2. **SMS Integration**: Text message support
3. **Email Integration**: Email notifications
4. **Social Media**: Facebook, Instagram integration

## 📞 Support

If you encounter issues:

1. Check the console logs
2. Verify environment configuration
3. Test with simple messages first
4. Check WhatsApp connection status
5. Review this documentation

## 🔗 Related Files

- `frontend/src/config/whatsapp.js` - WhatsApp configuration
- `frontend/src/pages/Chatbot.jsx` - Main chatbot page
- `frontend/src/components/ChatWindow.jsx` - Chat window component
- `backend-example/whatsappBot.js` - WhatsApp bot implementation
- `backend-example/server.js` - Backend server with bot integration

---

**Happy WhatsApp Chatting! 💬🏥**
