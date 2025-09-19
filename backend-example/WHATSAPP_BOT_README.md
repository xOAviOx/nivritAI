# 🤖 WhatsApp Healthcare Bot

A WhatsApp AI chatbot powered by Google Gemini AI that provides healthcare assistance in English and Hindi.

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

```bash
cp env.example .env
# Edit .env and add your GEMINI_API_KEY
```

### 3. Start WhatsApp Bot

```bash
npm run whatsapp
```

### 4. Scan QR Code

1. Wait for QR code to appear in terminal
2. Open WhatsApp on your phone
3. Go to **Settings > Linked Devices > Link a Device**
4. Scan the QR code
5. Bot is ready! 🎉

## 📱 How to Use

### Send Messages to the Bot

Once connected, users can send messages to the WhatsApp number running the bot:

**English Examples:**

- "What vaccines does my child need?"
- "I have fever, what should I do?"
- "Find hospitals near me"
- "Emergency help"

**Hindi Examples:**

- "बच्चे को कौन सा टीका लगाना चाहिए?"
- "मुझे बुखार है, क्या करूं?"
- "पास में अस्पताल खोजें"
- "आपातकालीन सहायता"

## 🏥 Features

### Healthcare Commands

- **Vaccination Info**: Ask about vaccine schedules
- **Hospital Finder**: Get information about nearby hospitals
- **Emergency Help**: Quick emergency contact information
- **Health Tips**: Daily health advice
- **Location Support**: Share location to find nearby healthcare centers

### AI Features

- **Multilingual**: Supports English and Hindi
- **Context Aware**: Remembers conversation context
- **Smart Responses**: Powered by Google Gemini AI
- **Healthcare Focused**: Specialized for health queries

## 🔧 API Endpoints

### Bot Status

```bash
GET /api/whatsapp/status
```

### Send Message (Testing)

```bash
POST /api/whatsapp/send
{
  "number": "1234567890",
  "message": "Hello from bot!"
}
```

### Health Check

```bash
GET /api/health
```

## 🛠️ Configuration

### Environment Variables

```env
# Required
GEMINI_API_KEY=your_gemini_api_key_here

# Optional
WHATSAPP_SESSION_PATH=./whatsapp-session
WHATSAPP_CLIENT_ID=healthcare-bot
PORT=5000
```

### WhatsApp Session

- Bot stores session data in `./whatsapp-session/`
- This allows the bot to stay logged in
- Delete this folder to force re-authentication

## 📋 Commands

### Start Bot

```bash
npm run whatsapp
```

### Start Server Only

```bash
npm start
```

### Development Mode

```bash
npm run dev
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

### Messages Not Received

1. Check bot status: `GET /api/whatsapp/status`
2. Verify WhatsApp connection
3. Check console logs for errors

### Session Issues

1. Delete `./whatsapp-session/` folder
2. Restart bot and scan QR code again

## 🚨 Important Notes

### Development vs Production

- This uses WhatsApp Web API (good for development/testing)
- For production, consider WhatsApp Business API
- WhatsApp Web API can get banned if misused

### Rate Limits

- Don't send too many messages quickly
- Respect WhatsApp's terms of service
- Use for legitimate healthcare purposes only

### Security

- Keep your `GEMINI_API_KEY` secure
- Don't share session files
- Monitor bot usage

## 🎯 Next Steps

### Enhancements

1. **WhatsApp Business API**: For production use
2. **Database Integration**: Store user conversations
3. **Voice Messages**: Handle voice queries
4. **Rich Messages**: Buttons, images, documents
5. **Scheduled Messages**: Vaccination reminders

### Integration

1. **Frontend Dashboard**: Monitor bot activity
2. **Analytics**: Track usage and health queries
3. **User Management**: Manage bot users
4. **Notification System**: Send health alerts

## 📞 Support

If you encounter issues:

1. Check the console logs
2. Verify environment configuration
3. Test with simple messages first
4. Check WhatsApp connection status

## 🔗 Related Files

- `whatsappBot.js` - Main bot implementation
- `server.js` - Express server with bot integration
- `start-whatsapp-bot.js` - Startup script
- `env.example` - Environment configuration template

---

**Happy Healthcare Chatting! 🏥💬**
