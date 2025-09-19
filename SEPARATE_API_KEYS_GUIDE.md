# 🔑 Separate API Keys Configuration Guide

This guide explains how to set up separate Gemini API keys for your website chatbot and WhatsApp bot.

## 🎯 Overview

- **Website Chatbot**: Uses `GEMINI_API_KEY` for frontend interactions
- **WhatsApp Bot**: Uses `WHATSAPP_GEMINI_API_KEY` for WhatsApp messages
- **Independent Operation**: Each can work with different API keys and quotas

## 🚀 Setup Instructions

### Step 1: Get Two Gemini API Keys

1. **Go to Google AI Studio**: https://makersuite.google.com/app/apikey
2. **Create First API Key** (for website chatbot):

   - Click "Create API Key"
   - Name it: "Website Chatbot API Key"
   - Copy the key

3. **Create Second API Key** (for WhatsApp bot):
   - Click "Create API Key" again
   - Name it: "WhatsApp Bot API Key"
   - Copy the key

### Step 2: Configure Environment Variables

Edit your `backend-example/.env` file:

```env
# Website Chatbot API Key
GEMINI_API_KEY=your-website-gemini-api-key-here

# WhatsApp Bot API Key (separate from website)
WHATSAPP_GEMINI_API_KEY=your-whatsapp-gemini-api-key-here

# Other configurations...
PORT=5000
NODE_ENV=development
WHATSAPP_SESSION_PATH=./whatsapp-session
WHATSAPP_CLIENT_ID=healthcare-bot
```

### Step 3: Test the Configuration

1. **Start the backend server**:

   ```bash
   cd backend-example
   npm start
   ```

2. **Check the startup logs** - you should see:

   ```
   🌐 Website Gemini AI: Configured
   📱 WhatsApp Gemini AI: Configured
   📱 WhatsApp Bot: Initializing...
   ```

3. **Test the health endpoint**:

   ```bash
   curl http://localhost:5000/api/health
   ```

   Should return:

   ```json
   {
     "status": "OK",
     "website_gemini": "Configured",
     "whatsapp_gemini": "Configured",
     "whatsapp": {...}
   }
   ```

## 🔧 How It Works

### Website Chatbot Flow

```
User types on website → Frontend → Backend /api/gemini → GEMINI_API_KEY → Response
```

### WhatsApp Bot Flow

```
User sends WhatsApp message → WhatsApp Bot → WHATSAPP_GEMINI_API_KEY → Response
```

## 📊 Benefits of Separate API Keys

### 1. **Independent Quotas**

- Each API key has its own rate limits
- Website and WhatsApp usage don't affect each other
- Better resource management

### 2. **Different Configurations**

- Different prompts for each platform
- Separate monitoring and analytics
- Independent scaling

### 3. **Security & Access Control**

- Different permissions for each key
- Easier to revoke access if needed
- Better audit trails

### 4. **Cost Management**

- Track usage separately
- Different billing for different services
- Better cost optimization

## 🛠️ Troubleshooting

### Issue: WhatsApp Bot Not Starting

**Error**: `WHATSAPP_GEMINI_API_KEY not found`

**Solution**:

1. Check if `.env` file exists
2. Verify `WHATSAPP_GEMINI_API_KEY` is set
3. Restart the server

### Issue: Website Chatbot Not Working

**Error**: Website shows "AI not available"

**Solution**:

1. Check if `GEMINI_API_KEY` is set
2. Verify the API key is valid
3. Check browser console for errors

### Issue: Different Responses

**Expected**: Both should give similar responses

**Solution**:

- Both use the same AI model (gemini-1.5-flash)
- Responses may vary due to different conversation contexts
- This is normal behavior

## 📈 Monitoring Usage

### Check API Key Status

```bash
# Check overall health
curl http://localhost:5000/api/health

# Check WhatsApp bot specifically
curl http://localhost:5000/api/whatsapp/status
```

### Monitor in Google AI Studio

1. Go to https://makersuite.google.com/app/apikey
2. Click on each API key
3. View usage statistics and quotas

## 🔄 Switching Back to Single API Key

If you want to use the same API key for both:

1. **Set both to the same key** in `.env`:

   ```env
   GEMINI_API_KEY=your-single-api-key
   WHATSAPP_GEMINI_API_KEY=your-single-api-key
   ```

2. **Restart the server**

## 📋 File Changes Made

### Backend Changes

- `backend-example/env.example` - Added separate API key variables
- `backend-example/whatsappBot.js` - Uses `WHATSAPP_GEMINI_API_KEY`
- `backend-example/server.js` - Updated initialization and status checks

### No Frontend Changes Required

- Frontend still uses the same API endpoints
- Backend handles the API key routing internally

## 🎯 Next Steps

1. **Set up your API keys** following Step 2
2. **Test both systems** to ensure they work independently
3. **Monitor usage** to optimize your API key usage
4. **Consider rate limits** for high-traffic scenarios

---

**Your chatbot now has independent API key management! 🚀🔑**
