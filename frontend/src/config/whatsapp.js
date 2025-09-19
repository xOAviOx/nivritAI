// WhatsApp Configuration
export const WHATSAPP_CONFIG = {
  // Replace with your actual WhatsApp number (include country code, no spaces or special characters)
  PHONE_NUMBER: "+919211324844", // India number

  // Default message when opening WhatsApp
  DEFAULT_MESSAGE: "Hey Nivrit AI",

  // Backend API URL (adjust if your backend runs on different port)
  API_BASE_URL: "http://localhost:5000",

  // WhatsApp Web URL format
  getWhatsAppUrl: (phoneNumber, message) => {
    const cleanNumber = phoneNumber.replace(/[^0-9]/g, "");
    const encodedMessage = encodeURIComponent(message);
    return `https://wa.me/${cleanNumber}?text=${encodedMessage}`;
  },

  // Check if WhatsApp bot is available
  checkBotStatus: async () => {
    try {
      const response = await fetch(
        `${WHATSAPP_CONFIG.API_BASE_URL}/api/whatsapp/status`
      );
      const data = await response.json();
      return {
        isReady: data.bot?.isReady || false,
        userCount: data.bot?.userCount || 0,
        uptime: data.bot?.uptime || 0,
      };
    } catch (error) {
      console.log("WhatsApp bot not available:", error);
      return {
        isReady: false,
        userCount: 0,
        uptime: 0,
      };
    }
  },
};

export default WHATSAPP_CONFIG;
