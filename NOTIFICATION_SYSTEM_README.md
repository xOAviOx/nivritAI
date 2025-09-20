# WhatsApp Notification System

## Overview

The WhatsApp Notification System allows administrators to send healthcare notifications directly to users via WhatsApp. The system includes a background processor that automatically handles queued notifications and sends them through the WhatsApp bot.

## Features

- ✅ **WhatsApp Delivery**: Send notifications directly via WhatsApp
- ✅ **Multi-language Support**: Notifications in English, Hindi, Marathi, Gujarati, and other Indian languages
- ✅ **Background Processing**: Automatic processing of queued notifications
- ✅ **Phone Number Validation**: Validates and formats Indian mobile numbers
- ✅ **Admin Dashboard**: Complete admin interface for managing notifications
- ✅ **Notification Templates**: Pre-built templates for common healthcare notifications
- ✅ **Statistics & Monitoring**: Track notification delivery status and statistics
- ✅ **Scheduled Notifications**: Support for scheduled delivery (future enhancement)

## Architecture

```
Admin Panel → API → Database → Background Worker → WhatsApp Bot → Users
```

1. **Admin creates notification** → Stored in database with status "pending"
2. **Background worker** → Processes pending notifications every 30 seconds
3. **WhatsApp Bot** → Sends messages to users' phone numbers
4. **Database** → Updates notification status to "sent" or "failed"

## Setup Instructions

### 1. Environment Variables

Ensure your `.env` file contains:

```bash
# Required for WhatsApp notifications
WHATSAPP_GEMINI_API_KEY=your_whatsapp_gemini_api_key
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key

# Optional
NOTIFICATION_PROCESSOR_INTERVAL=30000  # 30 seconds (default)
```

### 2. Database Schema

The notification system requires these tables (already included in `supabase-schema.sql`):

- `notifications` - Stores notification records
- `notification_preferences` - User notification preferences
- `notification_templates` - Pre-built notification templates
- `users` - User data with mobile numbers

### 3. Starting the System

#### Option A: Integrated Mode (Recommended)

The notification processor starts automatically with the main server:

```bash
cd backend-example
npm start
```

#### Option B: Standalone Worker Mode

Run the notification processor as a separate service:

```bash
cd backend-example
npm run notifications
```

## API Endpoints

### Admin Endpoints (Require Admin Authentication)

#### Send Notification

```http
POST /api/admin/notifications/send
Content-Type: application/json
Authorization: Bearer <admin_token>

{
  "user_ids": [1, 2, 3],
  "type": "health_tip",
  "title": "Daily Health Tip",
  "message": "Drink plenty of water throughout the day!",
  "delivery_method": "whatsapp",
  "scheduled_at": null
}
```

#### Get Notification Processor Status

```http
GET /api/admin/notifications/status
Authorization: Bearer <admin_token>
```

#### Get Pending Notifications

```http
GET /api/admin/notifications/pending?page=1&limit=20
Authorization: Bearer <admin_token>
```

#### Get Notification Statistics

```http
GET /api/admin/notifications/stats
Authorization: Bearer <admin_token>
```

#### Get Notification Templates

```http
GET /api/admin/templates
Authorization: Bearer <admin_token>
```

## Notification Types

### Pre-defined Types

- `health_tip` - General health tips
- `vaccination_reminder` - Vaccination appointment reminders
- `emergency_alert` - Emergency health alerts
- `appointment_reminder` - Healthcare appointment reminders

### Custom Types

You can create custom notification types by specifying any string value.

## Language Support

The system automatically detects user language preferences and formats messages accordingly:

- **English** (en) - Default
- **Hindi** (hi) - हिंदी
- **Marathi** (mr) - मराठी
- **Gujarati** (gu) - ગુજરાતી
- **Bengali** (bn) - বাংলা
- **Punjabi** (pa) - ਪੰਜਾਬੀ
- **Tamil** (ta) - தமிழ்
- **Telugu** (te) - తెలుగు
- **Kannada** (kn) - ಕನ್ನಡ
- **Malayalam** (ml) - മലയാളം

## Phone Number Format

The system automatically handles various Indian mobile number formats:

- `9876543210` → `919876543210`
- `09876543210` → `919876543210`
- `919876543210` → `919876543210` (unchanged)

## Monitoring & Troubleshooting

### Check Notification Processor Status

```bash
curl -H "Authorization: Bearer <admin_token>" \
     http://localhost:5000/api/admin/notifications/status
```

### View Pending Notifications

```bash
curl -H "Authorization: Bearer <admin_token>" \
     http://localhost:5000/api/admin/notifications/pending
```

### Check WhatsApp Bot Status

```bash
curl http://localhost:5000/api/whatsapp/status
```

### Common Issues

#### 1. Notifications Not Sending

- Check if WhatsApp bot is connected (scan QR code)
- Verify user mobile numbers are valid
- Check notification processor is running
- Review server logs for errors

#### 2. Invalid Phone Numbers

- Ensure mobile numbers are 10 digits
- Check for proper country code (91 for India)
- Verify numbers are registered with WhatsApp

#### 3. Language Issues

- Check user's language_preference in database
- Verify language detection logic
- Test with different language inputs

## File Structure

```
backend-example/
├── services/
│   ├── notificationProcessor.js    # Background notification processor
│   └── supabaseService.js          # Database operations
├── notification-worker.js          # Standalone worker script
├── whatsappBot.js                  # WhatsApp bot implementation
├── server.js                       # Main server with notification endpoints
└── supabase-schema.sql            # Database schema
```

## Development

### Adding New Notification Types

1. Update the notification templates in the database
2. Add language-specific formatting in `notificationProcessor.js`
3. Update the frontend admin panel to include new types

### Customizing Message Format

Edit the `formatNotificationMessage()` method in `notificationProcessor.js` to customize how messages are formatted for different languages.

### Adding New Delivery Methods

1. Extend the `processNotification()` method in `notificationProcessor.js`
2. Add validation logic in `supabaseService.js`
3. Update the frontend to support new delivery methods

## Production Considerations

### Scaling

- Run notification worker as a separate microservice
- Use Redis for queue management
- Implement rate limiting for WhatsApp API calls
- Add database connection pooling

### Reliability

- Implement retry logic for failed notifications
- Add dead letter queue for permanently failed notifications
- Monitor notification delivery rates
- Set up alerts for system failures

### Security

- Validate all input data
- Implement rate limiting on API endpoints
- Use proper authentication for admin endpoints
- Log all notification activities for audit

## Testing

### Test Notification Flow

1. **Create a test user** with a valid mobile number
2. **Send a test notification** via admin panel
3. **Check notification status** in pending notifications
4. **Verify WhatsApp delivery** on the user's phone
5. **Confirm status update** to "sent" in database

### Manual Testing Commands

```bash
# Send test notification
curl -X POST http://localhost:5000/api/admin/notifications/send \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <admin_token>" \
  -d '{
    "user_ids": [1],
    "type": "health_tip",
    "title": "Test Notification",
    "message": "This is a test notification from Nivrit AI!",
    "delivery_method": "whatsapp"
  }'

# Check status
curl -H "Authorization: Bearer <admin_token>" \
     http://localhost:5000/api/admin/notifications/status
```

## Support

For issues or questions about the notification system:

1. Check the server logs for error messages
2. Verify all environment variables are set correctly
3. Ensure WhatsApp bot is properly connected
4. Check database connectivity and permissions
5. Review notification processor status

The system is designed to be robust and handle various edge cases, but proper monitoring and logging are essential for production use.
