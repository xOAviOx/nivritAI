const supabaseService = require("./supabaseService");
const WhatsAppBot = require("../whatsappBot");

class NotificationProcessor {
  constructor(whatsappBotInstance = null) {
    this.isProcessing = false;
    this.processingInterval = null;
    this.whatsappBot = whatsappBotInstance;

    // Only create a new WhatsApp bot if no instance is provided and API key is available
    if (!this.whatsappBot && process.env.WHATSAPP_GEMINI_API_KEY) {
      console.log(
        "📱 Creating new WhatsApp bot instance for notification processor"
      );
      this.whatsappBot = new WhatsAppBot();
      this.whatsappBot.start().catch(console.error);
    }
  }

  // Start the notification processor
  start() {
    if (this.processingInterval) {
      console.log("📢 Notification processor is already running");
      return;
    }

    console.log("🚀 Starting notification processor...");

    // Process notifications every 30 seconds
    this.processingInterval = setInterval(async () => {
      await this.processPendingNotifications();
    }, 30000);

    // Process immediately on start
    setTimeout(() => {
      this.processPendingNotifications();
    }, 5000);

    console.log(
      "✅ Notification processor started (checking every 30 seconds)"
    );
  }

  // Stop the notification processor
  stop() {
    if (this.processingInterval) {
      clearInterval(this.processingInterval);
      this.processingInterval = null;
      console.log("🛑 Notification processor stopped");
    }
  }

  // Process pending notifications
  async processPendingNotifications() {
    if (this.isProcessing) {
      console.log(
        "⏳ Notification processing already in progress, skipping..."
      );
      return;
    }

    this.isProcessing = true;

    try {
      // Get pending notifications
      const pendingNotifications = await this.getPendingNotifications();

      if (pendingNotifications.length === 0) {
        console.log("📭 No pending notifications to process");
        return;
      }

      console.log(
        `📬 Processing ${pendingNotifications.length} pending notifications`
      );

      // Process each notification
      for (const notification of pendingNotifications) {
        await this.processNotification(notification);
      }
    } catch (error) {
      console.error("❌ Error processing notifications:", error);
    } finally {
      this.isProcessing = false;
    }
  }

  // Get pending notifications from database
  async getPendingNotifications() {
    try {
      const { data, error } = await supabaseService.supabase
        .from("notifications")
        .select(
          `
          *,
          users!inner(mobile_number, name, language_preference)
        `
        )
        .eq("status", "pending")
        .lte("scheduled_at", new Date().toISOString())
        .order("created_at", { ascending: true })
        .limit(50); // Process max 50 notifications at a time

      if (error) {
        console.error("Error fetching pending notifications:", error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error("Error in getPendingNotifications:", error);
      return [];
    }
  }

  // Process a single notification
  async processNotification(notification) {
    try {
      console.log(
        `📤 Processing notification ${notification.id} for user ${notification.user_id}`
      );

      // Validate user data
      if (!notification.users || !notification.users.mobile_number) {
        await this.updateNotificationStatus(
          notification.id,
          "failed",
          "User mobile number not found"
        );
        return;
      }

      // Format phone number for WhatsApp
      const phoneNumber = this.formatPhoneNumber(
        notification.users.mobile_number
      );
      if (!phoneNumber) {
        await this.updateNotificationStatus(
          notification.id,
          "failed",
          "Invalid phone number format"
        );
        return;
      }

      // Check delivery method and send accordingly
      let deliveryResult;
      switch (notification.delivery_method) {
        case "whatsapp":
          deliveryResult = await this.sendWhatsAppNotification(
            notification,
            phoneNumber
          );
          break;
        case "sms":
          // SMS delivery not implemented yet
          deliveryResult = {
            success: false,
            error: "SMS delivery not implemented",
          };
          break;
        default:
          deliveryResult = { success: false, error: "Unknown delivery method" };
      }

      // Update notification status
      if (deliveryResult.success) {
        await this.updateNotificationStatus(notification.id, "sent", null, {
          sent_at: new Date().toISOString(),
          delivery_method_used: notification.delivery_method,
          phone_number: phoneNumber,
        });
        console.log(
          `✅ Notification ${notification.id} sent successfully via ${notification.delivery_method}`
        );
      } else {
        await this.updateNotificationStatus(
          notification.id,
          "failed",
          deliveryResult.error
        );
        console.log(
          `❌ Failed to send notification ${notification.id}: ${deliveryResult.error}`
        );
      }
    } catch (error) {
      console.error(`Error processing notification ${notification.id}:`, error);
      await this.updateNotificationStatus(
        notification.id,
        "failed",
        error.message
      );
    }
  }

  // Send WhatsApp notification
  async sendWhatsAppNotification(notification, phoneNumber) {
    try {
      if (!this.whatsappBot) {
        return { success: false, error: "WhatsApp bot not initialized" };
      }

      // Check if bot is ready
      const botStatus = this.whatsappBot.getStatus();
      if (!botStatus.isReady) {
        return { success: false, error: "WhatsApp bot not ready" };
      }

      // Format message with user's language preference
      const message = this.formatNotificationMessage(
        notification,
        notification.users.language_preference
      );

      // Send message via WhatsApp
      await this.whatsappBot.sendMessage(phoneNumber, message);

      return { success: true };
    } catch (error) {
      console.error("WhatsApp send error:", error);
      return { success: false, error: error.message };
    }
  }

  // Format notification message based on language preference
  formatNotificationMessage(notification, languagePreference = "en") {
    const { title, message, type } = notification;

    // Language-specific formatting
    const getLanguagePrefix = (lang) => {
      const prefixes = {
        en: "🏥 Nivrit AI Health Alert",
        hi: "🏥 निवृत्त एआई स्वास्थ्य सतर्कता",
        mr: "🏥 निवृत्त एआई आरोग्य सतर्कता",
        gu: "🏥 નિવૃત્ત એઆઈ આરોગ્ય સતર્કતા",
        bn: "🏥 নিবৃত্ত এআই স্বাস্থ্য সতর্কতা",
        pa: "🏥 ਨਿਵ੍ਰਿਤ ਏਆਈ ਸਿਹਤ ਚੇਤਾਵਨੀ",
        ta: "🏥 நிவிர்த்த ஏஐ சுகாதார எச்சரிக்கை",
        te: "🏥 నివృత్త్ ఏఐ ఆరోగ్య హెచ్చరిక",
        kn: "🏥 ನಿವೃತ್ತ್ ಏಐ ಆರೋಗ್ಯ ಎಚ್ಚರಿಕೆ",
        ml: "🏥 നിവൃത്ത് ഏഐ ആരോഗ്യ എച്ചരിക",
      };
      return prefixes[lang] || prefixes["en"];
    };

    const prefix = getLanguagePrefix(languagePreference);

    // Format based on notification type
    let formattedMessage = `${prefix}\n\n`;
    formattedMessage += `📋 ${title}\n\n`;
    formattedMessage += `${message}\n\n`;

    // Add footer based on language
    const getFooter = (lang) => {
      const footers = {
        en: "Stay healthy! 💚\n- NivritAI Team",
        hi: "स्वस्थ रहें! 💚\n- निवृत्त एआई टीम",
        mr: "निरोगी राहा! 💚\n- निवृत्त एआई टीम",
        gu: "સ્વસ્થ રહો! 💚\n- નિવૃત્ત એઆઈ ટીમ",
        bn: "সুস্থ থাকুন! 💚\n- নিবৃত্ত এআই টিম",
        pa: "ਸਿਹਤਮੰਦ ਰਹੋ! 💚\n- ਨਿਵ੍ਰਿਤ ਏਆਈ ਟੀਮ",
        ta: "வாழ்க்கையில் ஆரோக்கியமாக இருங்கள்! 💚\n- நிவிர்த்த ஏஐ குழு",
        te: "ఆరోగ్యంగా ఉండండి! 💚\n- నివృత్త్ ఏఐ బృందం",
        kn: "ಆರೋಗ್ಯವಾಗಿ ಇರಿ! 💚\n- ನಿವೃತ್ತ್ ಏಐ ತಂಡ",
        ml: "ആരോഗ്യമായി ജീവിക്കുക! 💚\n- നിവൃത്ത് ഏഐ ടീം",
      };
      return footers[lang] || footers["en"];
    };

    formattedMessage += getFooter(languagePreference);

    return formattedMessage;
  }

  // Format phone number for WhatsApp
  formatPhoneNumber(mobileNumber) {
    try {
      // Remove all non-digit characters
      let cleanNumber = mobileNumber.replace(/\D/g, "");

      // Handle different formats
      if (cleanNumber.length === 10) {
        // Indian mobile number without country code
        cleanNumber = "91" + cleanNumber;
      } else if (cleanNumber.length === 11 && cleanNumber.startsWith("0")) {
        // Indian mobile number with leading 0
        cleanNumber = "91" + cleanNumber.substring(1);
      } else if (cleanNumber.length === 12 && cleanNumber.startsWith("91")) {
        // Already has country code
        // Keep as is
      } else {
        // Invalid format
        return null;
      }

      // Validate final format (should be 12 digits starting with 91)
      if (cleanNumber.length !== 12 || !cleanNumber.startsWith("91")) {
        return null;
      }

      return cleanNumber;
    } catch (error) {
      console.error("Error formatting phone number:", error);
      return null;
    }
  }

  // Update notification status in database
  async updateNotificationStatus(
    notificationId,
    status,
    errorMessage = null,
    additionalData = {}
  ) {
    try {
      const updateData = {
        status,
        updated_at: new Date().toISOString(),
        ...additionalData,
      };

      // Only add error_message if the column exists
      if (errorMessage) {
        updateData.error_message = errorMessage;
      }

      const { error } = await supabaseService.supabase
        .from("notifications")
        .update(updateData)
        .eq("id", notificationId);

      if (error) {
        console.error("Error updating notification status:", error);
        // If error_message column doesn't exist, try without it
        if (error.message && error.message.includes("error_message")) {
          console.log("Retrying without error_message column...");
          delete updateData.error_message;
          const { error: retryError } = await supabaseService.supabase
            .from("notifications")
            .update(updateData)
            .eq("id", notificationId);

          if (retryError) {
            console.error("Retry also failed:", retryError);
          } else {
            console.log("Successfully updated without error_message column");
          }
        }
      }
    } catch (error) {
      console.error("Error in updateNotificationStatus:", error);
    }
  }

  // Get processor status
  getStatus() {
    return {
      isRunning: !!this.processingInterval,
      isProcessing: this.isProcessing,
      whatsappBotReady: this.whatsappBot
        ? this.whatsappBot.getStatus().isReady
        : false,
      timestamp: new Date(),
    };
  }
}

module.exports = NotificationProcessor;
