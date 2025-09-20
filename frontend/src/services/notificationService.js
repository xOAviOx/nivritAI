import axios from "axios";

class NotificationService {
  constructor() {
    this.baseURL = process.env.REACT_APP_API_URL || "http://localhost:5002/api";
  }

  // Get auth headers
  getAuthHeaders() {
    const token = localStorage.getItem("token");
    return {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
  }

  // Send notification with dummy data
  async sendNotificationWithDummyData(userIds, type, customMessage = null) {
    try {
      // Dummy notification data
      const dummyNotifications = {
        health_tip: {
          title: "Daily Health Tip",
          message:
            customMessage ||
            "Drink plenty of water throughout the day to stay hydrated. Aim for 8-10 glasses of water daily for optimal health. 💧 #HealthTip #NivritAI",
        },
        vaccination_reminder: {
          title: "Vaccination Reminder",
          message:
            customMessage ||
            "Your vaccination schedule shows an upcoming appointment. Please visit your nearest health center for vaccination. Stay protected! 💉 #VaccinationReminder #NivritAI",
        },
        emergency_alert: {
          title: "Emergency Health Alert",
          message:
            customMessage ||
            "URGENT: Weather conditions may affect health. Please stay indoors and take necessary precautions. Contact emergency services if needed. 🚨 #EmergencyAlert #NivritAI",
        },
        appointment_reminder: {
          title: "Appointment Reminder",
          message:
            customMessage ||
            "You have a health appointment scheduled. Please arrive 15 minutes early and bring your health records. 📅 #AppointmentReminder #NivritAI",
        },
      };

      const notificationData =
        dummyNotifications[type] || dummyNotifications.health_tip;

      const response = await axios.post(
        `${this.baseURL}/admin/notifications/send`,
        {
          user_ids: userIds,
          type: type,
          title: notificationData.title,
          message: notificationData.message,
          delivery_method: "whatsapp", // Default to WhatsApp for demo
          scheduled_at: null, // Send immediately
        },
        {
          headers: this.getAuthHeaders(),
        }
      );

      return {
        success: response.data.success,
        message: response.data.message,
        notifications: response.data.notifications,
      };
    } catch (error) {
      console.error("Error sending notification:", error);
      return {
        success: false,
        error: error.response?.data?.error || "Failed to send notification",
      };
    }
  }

  // Send bulk notifications to all users
  async sendBulkNotification(type, customMessage = null) {
    try {
      // First get all users
      const usersResponse = await axios.get(
        `${this.baseURL}/admin/users?page=1&limit=1000`,
        {
          headers: this.getAuthHeaders(),
        }
      );

      if (!usersResponse.data.success) {
        return {
          success: false,
          error: "Failed to fetch users",
        };
      }

      const allUserIds = usersResponse.data.users.map((user) => user.id);

      if (allUserIds.length === 0) {
        return {
          success: false,
          error: "No users found to send notifications to",
        };
      }

      // Send notification to all users
      return await this.sendNotificationWithDummyData(
        allUserIds,
        type,
        customMessage
      );
    } catch (error) {
      console.error("Error sending bulk notification:", error);
      return {
        success: false,
        error: "Failed to send bulk notification",
      };
    }
  }

  // Send sample notifications for demo
  async sendSampleNotifications() {
    try {
      const results = [];

      // Send different types of notifications
      const notificationTypes = [
        "health_tip",
        "vaccination_reminder",
        "emergency_alert",
        "appointment_reminder",
      ];

      for (const type of notificationTypes) {
        const result = await this.sendBulkNotification(type);
        results.push({
          type,
          ...result,
        });
      }

      return {
        success: true,
        results,
        message: "Sample notifications sent successfully",
      };
    } catch (error) {
      console.error("Error sending sample notifications:", error);
      return {
        success: false,
        error: "Failed to send sample notifications",
      };
    }
  }

  // Get notification templates
  async getTemplates() {
    try {
      const response = await axios.get(`${this.baseURL}/admin/templates`, {
        headers: this.getAuthHeaders(),
      });

      return {
        success: response.data.success,
        templates: response.data.templates || [],
      };
    } catch (error) {
      console.error("Error fetching templates:", error);
      return {
        success: false,
        error: "Failed to fetch templates",
      };
    }
  }

  // Send notification using template
  async sendNotificationWithTemplate(templateId, userIds, variables = {}) {
    try {
      // Get template details
      const templatesResult = await this.getTemplates();
      if (!templatesResult.success) {
        return templatesResult;
      }

      const template = templatesResult.templates.find(
        (t) => t.id === templateId
      );
      if (!template) {
        return {
          success: false,
          error: "Template not found",
        };
      }

      // Replace variables in template
      let message = template.message_template;
      template.variables.forEach((variable) => {
        const placeholder = `{${variable}}`;
        const value = variables[variable] || `[${variable}]`;
        message = message.replace(new RegExp(placeholder, "g"), value);
      });

      const response = await axios.post(
        `${this.baseURL}/admin/notifications/send`,
        {
          user_ids: userIds,
          type: template.type,
          title: template.title,
          message: message,
          delivery_method: "whatsapp",
          scheduled_at: null,
        },
        {
          headers: this.getAuthHeaders(),
        }
      );

      return {
        success: response.data.success,
        message: response.data.message,
        notifications: response.data.notifications,
      };
    } catch (error) {
      console.error("Error sending template notification:", error);
      return {
        success: false,
        error: "Failed to send template notification",
      };
    }
  }
}

const notificationService = new NotificationService();
export default notificationService;
