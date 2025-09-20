import axios from "axios";

class GeminiService {
  constructor() {
    // Gemini AI service for healthcare chatbot
    this.baseURL = process.env.REACT_APP_API_URL || "http://localhost:5002/api";
    this.sessionId = this.generateSessionId();
  }

  generateSessionId() {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Detect language from message (enhanced for multiple Indian languages)
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

  // Send message to Gemini AI
  async sendMessage(message, language = null) {
    try {
      const detectedLanguage = language || this.detectLanguage(message);

      // Use Gemini AI API
      const response = await this.sendToGemini(message, detectedLanguage);

      return {
        success: true,
        response: response.text,
        intent: response.intent,
        confidence: response.confidence,
        language: detectedLanguage,
      };
    } catch (error) {
      console.error("Gemini AI error:", error);
      return {
        success: false,
        error: error.message,
        fallback: this.getFallbackResponse(message, language),
      };
    }
  }

  // Fallback response when Gemini AI fails
  getFallbackResponse(message, language) {
    if (language === "hi") {
      return "क्षमा करें, मैं आपके सवाल को समझ नहीं पा रहा हूं। कृपया अपना सवाल दोबारा पूछें या अंग्रेजी में लिखें।";
    } else {
      return "I apologize, but I'm having trouble processing your question. Please try rephrasing your question or ask about healthcare, vaccinations, or medical guidance.";
    }
  }

  // Gemini AI API integration
  async sendToGemini(message, language) {
    try {
      const response = await axios.post(`${this.baseURL}/gemini`, {
        message,
        language,
        sessionId: this.sessionId,
      });

      return {
        success: true,
        text: response.data.fulfillmentText,
        intent: response.data.intent,
        confidence: response.data.confidence,
        language: language,
      };
    } catch (error) {
      throw new Error(`Gemini API error: ${error.message}`);
    }
  }

  // Update session context
  updateContext(context) {
    this.context = { ...this.context, ...context };
  }

  // Get current context
  getContext() {
    return this.context || {};
  }
}

const geminiService = new GeminiService();
export default geminiService;
