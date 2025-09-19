# Dialogflow Integration Guide

## 🎯 Overview

This guide explains how to integrate Google Dialogflow with your healthcare chatbot application. The integration provides advanced AI capabilities for natural language processing, intent recognition, and contextual conversations.

## 🚀 Quick Start

### 1. Frontend Integration (Already Done)

The frontend has been updated with:

- ✅ Dialogflow service integration
- ✅ Enhanced ChatWindow component
- ✅ AI toggle functionality
- ✅ Confidence scoring display
- ✅ Fallback response handling

### 2. Backend Setup (Optional but Recommended)

For production use, set up the backend API:

```bash
# Navigate to backend directory
cd backend-example

# Install dependencies
npm install

# Copy environment file
cp env.example .env

# Edit .env with your Dialogflow credentials
nano .env

# Start the server
npm run dev
```

## 🔧 Dialogflow Setup

### Step 1: Create Dialogflow Agent

1. Go to [Dialogflow Console](https://dialogflow.cloud.google.com/)
2. Create a new agent
3. Choose "Healthcare" as the category
4. Enable multiple languages (English & Hindi)

### Step 2: Configure Intents

Create these essential intents:

#### 1. Vaccination Schedule Intent

- **Intent Name**: `vaccination_schedule`
- **Training Phrases**:
  - "When should my child get polio vaccine?"
  - "BCG vaccine schedule"
  - "पोलियो का टीका कब लगता है?"
- **Response**: Dynamic vaccination schedule based on child's age

#### 2. Health Query Intent

- **Intent Name**: `health_query`
- **Training Phrases**:
  - "What are measles symptoms?"
  - "How to prevent dengue?"
  - "बुखार के लक्षण क्या हैं?"
- **Response**: Health information and prevention tips

#### 3. Emergency Intent

- **Intent Name**: `health_emergency`
- **Training Phrases**:
  - "My child has fever"
  - "Emergency help needed"
  - "मेरे बच्चे को बुखार है"
- **Response**: Emergency guidance and contact information

#### 4. Language Switch Intent

- **Intent Name**: `language_switch`
- **Training Phrases**:
  - "Switch to Hindi"
  - "हिन्दी में बात करें"
- **Response**: Language preference confirmation

### Step 3: Set Up Service Account

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Enable Dialogflow API
3. Create a service account
4. Download the JSON key file
5. Add credentials to your `.env` file

## 📱 Frontend Features

### AI Toggle

- Users can toggle Dialogflow AI on/off
- Visual indicator shows current mode
- Fallback responses when AI is disabled

### Confidence Scoring

- Each response shows confidence percentage
- Green icon for Dialogflow responses
- Yellow icon for fallback responses

### Multi-language Support

- Automatic language detection
- Manual language selection
- Context-aware responses

### Enhanced Messages

- Intent information display
- Response source indication
- Timestamp and confidence metrics

## 🔄 API Integration

### Frontend Service

```javascript
// Send message to Dialogflow
const response = await dialogflowService.sendMessage(message, language);

// Response structure
{
  success: true,
  response: "AI response text",
  intent: "vaccination_schedule",
  confidence: 0.95,
  language: "en"
}
```

### Backend API

```javascript
// POST /api/dialogflow
{
  "message": "When should my child get polio vaccine?",
  "language": "en",
  "sessionId": "session_123"
}

// Response
{
  "success": true,
  "fulfillmentText": "Polio vaccine is given at...",
  "intent": "vaccination_schedule",
  "confidence": 0.95,
  "sessionId": "session_123"
}
```

## 🧪 Testing

### Test Cases

1. **Vaccination Queries**

   - "Polio vaccine schedule"
   - "BCG when to give"
   - "पोलियो का टीका कब लगता है?"

2. **Health Information**

   - "Measles symptoms"
   - "Dengue prevention"
   - "बुखार के लक्षण"

3. **Emergency Scenarios**

   - "My child has fever"
   - "Emergency help"
   - "तुरंत डॉक्टर चाहिए"

4. **Language Switching**
   - "Switch to Hindi"
   - "English me baat karo"
   - "हिन्दी में जवाब दो"

### Testing Commands

```bash
# Test frontend
npm start

# Test backend (if using)
cd backend-example
npm run dev

# Test API endpoint
curl -X POST http://localhost:5000/api/dialogflow \
  -H "Content-Type: application/json" \
  -d '{"message": "Polio vaccine schedule", "language": "en"}'
```

## 🚀 Deployment

### Frontend Deployment

```bash
# Build for production
npm run build

# Deploy to Netlify/Vercel
# Upload build folder to your hosting platform
```

### Backend Deployment

```bash
# Deploy to Heroku
heroku create healthcare-chatbot-api
heroku config:set DIALOGFLOW_PROJECT_ID=your-project-id
heroku config:set DIALOGFLOW_PRIVATE_KEY="your-private-key"
heroku config:set DIALOGFLOW_CLIENT_EMAIL=your-client-email
git push heroku main
```

## 📊 Analytics & Monitoring

### Track Usage

```javascript
// Add to your analytics
analytics.track("dialogflow_interaction", {
  intent: response.intent,
  confidence: response.confidence,
  language: response.language,
  responseTime: Date.now() - startTime,
});
```

### Monitor Performance

- Response times
- Intent accuracy
- User satisfaction
- Error rates

## 🔧 Troubleshooting

### Common Issues

1. **Permission Denied**

   - Check service account permissions
   - Verify API is enabled
   - Ensure correct project ID

2. **Authentication Errors**

   - Verify private key format
   - Check client email
   - Ensure JSON key is valid

3. **Intent Not Recognized**

   - Add more training phrases
   - Improve intent descriptions
   - Check language settings

4. **Slow Responses**
   - Optimize intent complexity
   - Use webhook for complex logic
   - Implement caching

### Debug Mode

Enable debug logging:

```javascript
// In dialogflowService.js
const DEBUG = process.env.NODE_ENV === "development";

if (DEBUG) {
  console.log("Dialogflow Request:", { message, language });
  console.log("Dialogflow Response:", response);
}
```

## 📈 Next Steps

### Advanced Features

1. **Context Management**

   - Store user preferences
   - Maintain conversation history
   - Personalized responses

2. **Webhook Integration**

   - Real-time data fetching
   - Database integration
   - External API calls

3. **Analytics Dashboard**

   - Usage statistics
   - Intent performance
   - User feedback

4. **Multi-channel Support**
   - WhatsApp integration
   - SMS responses
   - Voice interactions

## 🆘 Support

For issues or questions:

1. Check the troubleshooting section
2. Review Dialogflow documentation
3. Test with simple intents first
4. Verify credentials and permissions

## 📝 Notes

- The current implementation uses mock responses for demo purposes
- Replace `mockDialogflowResponse` with real API calls for production
- Consider implementing rate limiting for production use
- Store session data in a database for scalability
- Implement proper error handling and logging
