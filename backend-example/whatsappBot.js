const { Client, LocalAuth, MessageMedia } = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");
const { GoogleGenerativeAI } = require("@google/generative-ai");

class WhatsAppBot {
  constructor() {
    // Initialize WhatsApp client
    this.client = new Client({
      authStrategy: new LocalAuth({
        clientId: "healthcare-bot",
      }),
      puppeteer: {
        headless: true,
        args: [
          "--no-sandbox",
          "--disable-setuid-sandbox",
          "--disable-dev-shm-usage",
          "--disable-accelerated-2d-canvas",
          "--no-first-run",
          "--no-zygote",
          "--single-process",
          "--disable-gpu",
        ],
      },
    });

    // Initialize Gemini AI (dedicated API key for WhatsApp bot)
    this.genAI = new GoogleGenerativeAI(process.env.WHATSAPP_GEMINI_API_KEY);
    this.model = this.genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Store user sessions
    this.userSessions = new Map();

    this.setupEventHandlers();
  }

  setupEventHandlers() {
    // QR Code for authentication
    this.client.on("qr", (qr) => {
      console.log(
        "\n🔗 WhatsApp Healthcare Bot - Scan this QR code with WhatsApp:"
      );
      console.log(
        "📱 Open WhatsApp > Settings > Linked Devices > Link a Device"
      );
      console.log("📱 Then scan the QR code below:\n");
      qrcode.generate(qr, { small: true });
      console.log(
        "\n✅ After scanning, the bot will be ready to receive messages!\n"
      );
    });

    // Bot ready
    this.client.on("ready", () => {
      console.log("✅ WhatsApp Healthcare Bot is ready and connected!");
      console.log("🏥 Bot can now help users with healthcare queries");
      console.log("🌐 Supports English and Hindi languages");
      console.log("📱 Users can send messages to this WhatsApp number\n");
    });

    // Handle incoming messages
    this.client.on("message", async (message) => {
      await this.handleMessage(message);
    });

    // Handle authentication failures
    this.client.on("auth_failure", (msg) => {
      console.error("❌ WhatsApp Authentication failed:", msg);
    });

    // Handle disconnections
    this.client.on("disconnected", (reason) => {
      console.log("📱 WhatsApp Bot disconnected:", reason);
    });
  }

  async handleMessage(message) {
    try {
      // Skip messages from groups and status updates
      if (message.from.includes("@g.us") || message.from.includes("status")) {
        return;
      }

      const userMessage = message.body;
      const sender = message.from;
      const contact = await message.getContact();

      console.log(`📱 Message from ${contact.name || sender}: ${userMessage}`);

      // Handle different message types
      if (message.type === "location") {
        await this.handleLocationMessage(message);
        return;
      }

      if (message.type === "ptt") {
        await message.reply(
          "🎤 Voice messages are not supported yet. Please send text messages."
        );
        return;
      }

      // Handle only very specific commands, let AI handle most queries
      const commandResponse = await this.handleHealthcareCommands(message);
      if (commandResponse) {
        await message.reply(commandResponse);
        return;
      }

      // Get AI response using Gemini for all other messages
      console.log(`🤖 Processing message with Gemini AI: "${userMessage}"`);
      const aiResponse = await this.getAIResponse(userMessage, sender);
      console.log(`🤖 Gemini AI Response: "${aiResponse}"`);
      await message.reply(aiResponse);
    } catch (error) {
      console.error("Error handling message:", error);
      await message.reply("Sorry, I encountered an error. Please try again.");
    }
  }

  async handleHealthcareCommands(message) {
    const userMessage = message.body.toLowerCase().trim();
    const language = this.detectLanguage(message.body);

    // Only handle very specific system commands, let AI handle all healthcare queries
    if (userMessage === "help" || userMessage === "सहायता") {
      return language === "hi"
        ? "🤖 मैं आपकी स्वास्थ्य सहायता के लिए यहाँ हूँ!\n\n• कोई भी स्वास्थ्य सवाल पूछें\n• टीकाकरण के बारे में जानें\n• अस्पताल खोजने में मदद लें\n• आपातकालीन स्थिति के लिए सलाह\n\nबस अपना सवाल टाइप करें!"
        : "🤖 I'm here to help with your health questions!\n\n• Ask any health-related question\n• Get vaccination information\n• Find hospitals nearby\n• Get emergency advice\n\nJust type your question!";
    }

    if (userMessage === "status" || userMessage === "स्थिति") {
      return language === "hi"
        ? "✅ बॉट ऑनलाइन है और काम कर रहा है!"
        : "✅ Bot is online and working!";
    }

    // Let Gemini AI handle all other queries including:
    // - vaccine questions
    // - hospital queries
    // - emergency situations
    // - health tips
    // - specific medical questions
    return null; // No specific command matched, let AI handle it
  }

  async handleLocationMessage(message) {
    const location = message.location;
    const language = this.detectLanguage(message.body || "en");

    const response =
      language === "hi"
        ? `📍 स्थान प्राप्त हुआ!\n\nआपकी स्थिति: ${location.latitude.toFixed(
            4
          )}, ${location.longitude.toFixed(
            4
          )}\n\nनिकटतम अस्पताल खोजने के लिए "hospital" टाइप करें।`
        : `📍 Location received!\n\nYour position: ${location.latitude.toFixed(
            4
          )}, ${location.longitude.toFixed(
            4
          )}\n\nType "hospital" to find nearest hospitals.`;

    await message.reply(response);
  }

  async getAIResponse(message, sender) {
    try {
      // Detect language (same logic as website)
      const language = this.detectLanguage(message);

      // Get or create user session
      const sessionId = sender;
      const userSession = this.userSessions.get(sessionId) || {
        lastMessage: "",
        lastResponse: "",
        timestamp: new Date(),
      };

      // Healthcare prompt for Nivrit AI
      const healthcarePrompt = `You are Nivrit AI, a friendly healthcare assistant. You help people with health questions, vaccination schedules, and medical guidance.

IMPORTANT RULES:
1. Reply in the SAME LANGUAGE as the user's question (${
        language === "hi" ? "Hindi" : "English"
      })
2. Keep answers SHORT and helpful - maximum 3-4 sentences
3. Use SIMPLE words that everyone can understand
4. NO asterisks (*), bold text, or fancy formatting - just plain text
5. Give the most important advice first
6. Always remind them to visit a doctor for serious problems
7. Be warm, helpful, and professional
8. For vaccination questions, provide specific age-based schedules
9. For hospital queries, suggest they share location or contact local health centers
10. Use emojis sparingly and appropriately
11. End with a helpful suggestion or next step

Previous conversation:
User: ${userSession.lastMessage}
Bot: ${userSession.lastResponse}

Current user's question: ${message}`;

      const result = await this.model.generateContent(healthcarePrompt);
      const response = await result.response;
      let text = response.text();

      // Clean up formatting (same as website)
      text = text
        .replace(/\*\*/g, "")
        .replace(/\*/g, "")
        .replace(/###/g, "")
        .replace(/##/g, "")
        .replace(/#/g, "");

      // Update user session
      userSession.lastMessage = message;
      userSession.lastResponse = text;
      userSession.timestamp = new Date();
      this.userSessions.set(sessionId, userSession);

      return text;
    } catch (error) {
      console.error("Gemini API Error:", error);
      const language = this.detectLanguage(message);
      return language === "hi"
        ? "क्षमा करें, मैं आपके सवाल को समझ नहीं पा रहा हूं। कृपया अपना सवाल दोबारा पूछें या अंग्रेजी में लिखें।"
        : "I apologize, but I'm having trouble processing your question. Please try rephrasing your question or ask about healthcare, vaccinations, or medical guidance.";
    }
  }

  detectLanguage(message) {
    const hindiRegex = /[\u0900-\u097F]/;
    return hindiRegex.test(message) ? "hi" : "en";
  }

  // Send message to specific number
  async sendMessage(number, message) {
    try {
      const chatId = number.includes("@c.us") ? number : `${number}@c.us`;
      await this.client.sendMessage(chatId, message);
      console.log(`📤 Message sent to ${number}: ${message}`);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  }

  // Get bot status
  getStatus() {
    return {
      isReady: this.client.info ? true : false,
      userCount: this.userSessions.size,
      uptime: process.uptime(),
      timestamp: new Date(),
    };
  }

  // Start the bot
  async start() {
    try {
      console.log("🚀 Starting WhatsApp Healthcare Bot...");
      await this.client.initialize();
    } catch (error) {
      console.error("❌ Failed to start WhatsApp bot:", error);
      throw error;
    }
  }

  // Stop the bot
  async stop() {
    try {
      console.log("🛑 Stopping WhatsApp Healthcare Bot...");
      await this.client.destroy();
    } catch (error) {
      console.error("❌ Error stopping WhatsApp bot:", error);
    }
  }
}

module.exports = WhatsAppBot;
