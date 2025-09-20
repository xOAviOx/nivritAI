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
          "--disable-gpu",
          "--disable-web-security",
          "--disable-features=VizDisplayCompositor",
          "--run-all-compositor-stages-before-draw",
          "--disable-background-timer-throttling",
          "--disable-backgrounding-occluded-windows",
          "--disable-renderer-backgrounding",
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

    // Get appropriate help message based on detected language
    const getHelpMessage = (lang) => {
      const helpMessages = {
        en: "🤖 I'm here to help with your health questions!\n\n• Ask any health-related question\n• Get vaccination information\n• Find hospitals nearby\n• Get emergency advice\n\nJust type your question!",
        hi: "🤖 मैं आपकी स्वास्थ्य सहायता के लिए यहाँ हूँ!\n\n• कोई भी स्वास्थ्य सवाल पूछें\n• टीकाकरण के बारे में जानें\n• अस्पताल खोजने में मदद लें\n• आपातकालीन स्थिति के लिए सलाह\n\nबस अपना सवाल टाइप करें!",
        mr: "🤖 मी तुमच्या आरोग्यासाठी इथे आहे!\n\n• कोणतेही आरोग्य संबंधी प्रश्न विचारा\n• लसीकरणाची माहिती मिळवा\n• जवळच्या रुग्णालयांची माहिती मिळवा\n• आपत्कालीन परिस्थितीसाठी सल्ला मिळवा\n\nफक्त तुमचा प्रश्न टाइप करा!",
        gu: "🤖 હું તમારા આરોગ્ય માટે અહીં છું!\n\n• કોઈપણ આરોગ્ય સંબંધિત પ્રશ્ન પૂછો\n• રસીકરણની માહિતી મેળવો\n• નજીકના હોસ્પિટલ શોધો\n• કટોકટીની સલાહ મેળવો\n\nફક્ત તમારો પ્રશ્ન લખો!",
        hinglish:
          "🤖 Main yahan tumhare health questions ke liye hun!\n\n• Koi bhi health ka sawal pucho\n• Vaccination ki jaankari lo\n• Paas ke hospitals dhundho\n• Emergency ke liye advice lo\n\nBas apna sawal type karo!",
      };
      return helpMessages[lang] || helpMessages["en"];
    };

    const getStatusMessage = (lang) => {
      const statusMessages = {
        en: "✅ Bot is online and working!",
        hi: "✅ बॉट ऑनलाइन है और काम कर रहा है!",
        mr: "✅ बॉट ऑनलाइन आहे आणि काम करत आहे!",
        gu: "✅ બોટ ઓનલાઇન છે અને કામ કરી રહ્યું છે!",
        hinglish: "✅ Bot online hai aur kaam kar raha hai!",
      };
      return statusMessages[lang] || statusMessages["en"];
    };

    // Handle help command in multiple languages
    const helpCommands = [
      "help",
      "सहायता",
      "मदत",
      "મદદ",
      "साहाय्य",
      "உதவி",
      "సహాయం",
      "ಸಹಾಯ",
      "സഹായം",
    ];
    if (helpCommands.includes(userMessage)) {
      return getHelpMessage(language);
    }

    // Handle status command in multiple languages
    const statusCommands = [
      "status",
      "स्थिति",
      "स्थिती",
      "સ્થિતિ",
      "ಸ್ಥಿತಿ",
      "స్థితి",
      "நிலை",
      "കാര്യം",
    ];
    if (statusCommands.includes(userMessage)) {
      return getStatusMessage(language);
    }

    // Let Gemini AI handle all other queries
    return null;
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

      // Get language name for prompt
      const getLanguageName = (lang) => {
        const languageNames = {
          en: "English",
          hi: "Hindi",
          mr: "Marathi",
          gu: "Gujarati",
          bn: "Bengali",
          pa: "Punjabi",
          ta: "Tamil",
          te: "Telugu",
          kn: "Kannada",
          ml: "Malayalam",
          hinglish: "Hinglish (mix of Hindi and English)",
        };
        return languageNames[lang] || "English";
      };

      // Healthcare prompt for Nivrit AI
      const healthcarePrompt = `You are Nivrit AI, a friendly healthcare assistant. You help people with health questions, vaccination schedules, and medical guidance.

IMPORTANT RULES:
1. Reply EXCLUSIVELY in ${getLanguageName(
        language
      )} - the same language as the user's question
2. Keep answers SHORT and helpful - maximum 3-4 sentences
3. Use SIMPLE words that everyone can understand
4. NO asterisks (*), bold text, or fancy formatting - just plain text
5. Give the most important advice first
6. Always remind them to visit a doctor for serious problems
7. Be warm, helpful, and professional
8. For vaccination questions, provide specific age-based schedules
9. For hospital queries, suggest they share location or contact local health centers
10. Use emojis sparingly and appropriately (1-2 max)
11. End with a helpful suggestion or next step
12. If the user writes in Hinglish, respond in Hinglish (mix of Hindi and English words naturally)
13. For regional languages, use common local terms for medical conditions when appropriate

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

      const getErrorMessage = (lang) => {
        const errorMessages = {
          en: "I apologize, but I'm having trouble processing your question. Please try rephrasing your question or ask about healthcare, vaccinations, or medical guidance.",
          hi: "क्षमा करें, मैं आपके सवाल को समझ नहीं पा रहा हूं। कृपया अपना सवाल दोबारा पूछें या अंग्रेजी में लिखें।",
          mr: "माफ करा, मला तुमचा प्रश्न समजत नाही. कृपया तुमचा प्रश्न पुन्हा विचारा किंवा इंग्रजीत लिहा.",
          gu: "માફ કરશો, મને તમારો પ્રશ્ન સમજાતો નથી. કૃપા કરીને તમારો પ્રશ્ન ફરીથી પૂછો અથવા અંગ્રેજીમાં લખો.",
          hinglish:
            "Sorry yaar, main tumhara sawal samajh nahi pa raha. Please apna sawal doosre tarike se pucho ya English mein likho.",
        };
        return errorMessages[lang] || errorMessages["en"];
      };

      return getErrorMessage(language);
    }
  }

  detectLanguage(message) {
    // Hindi and Devanagari script (includes Hindi, Marathi, Sanskrit)
    const hindiRegex = /[\u0900-\u097F]/;

    // Gujarati script
    const gujaratiRegex = /[\u0A80-\u0AFF]/;

    // Bengali script
    const bengaliRegex = /[\u0980-\u09FF]/;

    // Punjabi script (Gurmukhi)
    const punjabiRegex = /[\u0A00-\u0A7F]/;

    // Tamil script
    const tamilRegex = /[\u0B80-\u0BFF]/;

    // Telugu script
    const teluguRegex = /[\u0C00-\u0C7F]/;

    // Kannada script
    const kannadaRegex = /[\u0C80-\u0CFF]/;

    // Malayalam script
    const malayalamRegex = /[\u0D00-\u0D7F]/;

    // Check for Indian scripts
    if (hindiRegex.test(message)) {
      // Check if it's specifically Marathi (common Marathi words)
      const marathiWords = [
        "मी",
        "तू",
        "आम्ही",
        "तुम्ही",
        "माझा",
        "तुझा",
        "आमचा",
        "तुमचा",
      ];
      const isMarathi = marathiWords.some((word) =>
        message.toLowerCase().includes(word)
      );
      return isMarathi ? "mr" : "hi";
    }
    if (gujaratiRegex.test(message)) return "gu";
    if (bengaliRegex.test(message)) return "bn";
    if (punjabiRegex.test(message)) return "pa";
    if (tamilRegex.test(message)) return "ta";
    if (teluguRegex.test(message)) return "te";
    if (kannadaRegex.test(message)) return "kn";
    if (malayalamRegex.test(message)) return "ml";

    // Check for Hinglish (mix of Hindi and English)
    const hinglishWords = [
      "hai",
      "hain",
      "nahi",
      "kyun",
      "kaise",
      "kya",
      "main",
      "tum",
      "aap",
      "mera",
      "tera",
      "hamara",
      "tumhara",
    ];
    const hasHinglish = hinglishWords.some((word) =>
      message.toLowerCase().includes(word)
    );
    if (hasHinglish) return "hinglish";

    // Default to English
    return "en";
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
