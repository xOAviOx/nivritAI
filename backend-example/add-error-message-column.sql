-- Add missing error_message column to notifications table
ALTER TABLE notifications ADD COLUMN IF NOT EXISTS error_message TEXT;

-- Add any other missing columns that might be needed
ALTER TABLE notifications ADD COLUMN IF NOT EXISTS delivery_method_used VARCHAR(20);
ALTER TABLE notifications ADD COLUMN IF NOT EXISTS phone_number VARCHAR(20);

-- Update the schema comment
COMMENT ON TABLE notifications IS 'Stores all notifications sent to users with delivery status and error tracking';
COMMENT ON COLUMN notifications.error_message IS 'Error message if notification delivery failed';
COMMENT ON COLUMN notifications.delivery_method_used IS 'Actual delivery method used (may differ from requested method)';
COMMENT ON COLUMN notifications.phone_number IS 'Phone number used for delivery (for WhatsApp/SMS)';
