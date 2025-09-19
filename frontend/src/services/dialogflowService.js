import axios from "axios";

class DialogflowService {
  constructor() {
    // Dialogflow service for healthcare chatbot
    this.baseURL = process.env.REACT_APP_API_URL || "http://localhost:5001/api";
    this.sessionId = this.generateSessionId();
  }

  generateSessionId() {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Detect language from message
  detectLanguage(message) {
    const hindiRegex = /[\u0900-\u097F]/;
    return hindiRegex.test(message) ? "hi" : "en";
  }

  // Send message to Dialogflow
  async sendMessage(message, language = null) {
    try {
      const detectedLanguage = language || this.detectLanguage(message);

      // Use Dialogflow API
      const response = await this.sendToDialogflow(message, detectedLanguage);

      return {
        success: true,
        response: response.text,
        intent: response.intent,
        confidence: response.confidence,
        language: detectedLanguage,
      };
    } catch (error) {
      console.error("Dialogflow error:", error);
      return {
        success: false,
        error: error.message,
        fallback: this.getFallbackResponse(message, language),
      };
    }
  }

  // Fallback response when Dialogflow fails
  getFallbackResponse(message, language) {
    if (language === "hi") {
      return "क्षमा करें, मैं आपके सवाल को समझ नहीं पा रहा हूं। कृपया अपना सवाल दोबारा पूछें या अंग्रेजी में लिखें।";
    } else {
      return "I apologize, but I'm having trouble processing your question. Please try rephrasing your question or ask about healthcare, vaccinations, or medical guidance.";
    }
  }

  // Dialogflow API integration
  async sendToDialogflow(message, language) {
    try {
      const response = await axios.post(`${this.baseURL}/dialogflow`, {
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
      throw new Error(`Dialogflow API error: ${error.message}`);
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

export default new DialogflowService();
