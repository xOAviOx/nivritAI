import React, { useState, useRef, useEffect } from "react";
import { Send, MessageCircle, Phone, Bot, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import geminiService from "../services/geminiService";
import WHATSAPP_CONFIG from "../config/whatsapp";

const ChatWindow = ({ onSendWhatsApp, onSendSMS }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hey Nivrit AI! I'm your AI healthcare assistant powered by Dialogflow. I can help you with vaccination schedules, health queries, and outbreak information. How can I assist you today?",
      sender: "bot",
      timestamp: new Date(),
      intent: "welcome",
      confidence: 1.0,
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [isTyping, setIsTyping] = useState(false);
  const [isDialogflowEnabled, setIsDialogflowEnabled] = useState(true);
  const [lastIntent, setLastIntent] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: Date.now(),
      text: inputMessage,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    const currentMessage = inputMessage;
    setInputMessage("");
    setIsTyping(true);

    try {
      let botMessage;

      if (isDialogflowEnabled) {
        // Use Dialogflow service
        const dialogflowResponse = await geminiService.sendMessage(
          currentMessage,
          selectedLanguage
        );

        if (dialogflowResponse.success) {
          botMessage = {
            id: Date.now() + 1,
            text: dialogflowResponse.response,
            sender: "bot",
            timestamp: new Date(),
            intent: dialogflowResponse.intent,
            confidence: dialogflowResponse.confidence,
            isDialogflow: true,
          };
          setLastIntent(dialogflowResponse.intent);
        } else {
          // Fallback to original response
          const fallbackResponse = generateBotResponse(
            currentMessage,
            selectedLanguage
          );
          botMessage = {
            id: Date.now() + 1,
            text: fallbackResponse,
            sender: "bot",
            timestamp: new Date(),
            intent: "fallback",
            confidence: 0.5,
            isDialogflow: false,
          };
        }
      } else {
        // Use fallback response directly
        const fallbackResponse = generateBotResponse(
          currentMessage,
          selectedLanguage
        );
        botMessage = {
          id: Date.now() + 1,
          text: fallbackResponse,
          sender: "bot",
          timestamp: new Date(),
          intent: "fallback",
          confidence: 0.5,
          isDialogflow: false,
        };
      }

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Dialogflow error:", error);
      // Fallback response
      const fallbackResponse = generateBotResponse(
        currentMessage,
        selectedLanguage
      );
      const botMessage = {
        id: Date.now() + 1,
        text: fallbackResponse,
        sender: "bot",
        timestamp: new Date(),
        intent: "fallback",
        confidence: 0.5,
        isDialogflow: false,
      };
      setMessages((prev) => [...prev, botMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const generateBotResponse = (message, language) => {
    const lowerMessage = message.toLowerCase();

    if (language === "hi") {
      if (lowerMessage.includes("polio") || lowerMessage.includes("tika")) {
        return "पोलियो का टीका आमतौर पर 6 सप्ताह, 10 सप्ताह, 14 सप्ताह और 16-24 महीने की उम्र में लगाया जाता है। कृपया अपने बच्चे की जन्म तिथि बताएं ताकि मैं सटीक जानकारी दे सकूं।";
      } else if (
        lowerMessage.includes("bcg") ||
        lowerMessage.includes("बीसीजी")
      ) {
        return "BCG का टीका जन्म के समय या जल्द से जल्द लगाया जाना चाहिए। यह टीका तपेदिक से बचाता है।";
      } else if (
        lowerMessage.includes("measles") ||
        lowerMessage.includes("खसरा")
      ) {
        return "खसरा का टीका 9 महीने और 15-18 महीने की उम्र में लगाया जाता है। यह बहुत महत्वपूर्ण टीका है।";
      } else {
        return "मैं आपकी स्वास्थ्य संबंधी जानकारी में मदद कर सकता हूं। कृपया अपने सवाल को और विस्तार से बताएं।";
      }
    } else {
      if (lowerMessage.includes("polio") || lowerMessage.includes("vaccine")) {
        return "Polio vaccine is typically given at 6 weeks, 10 weeks, 14 weeks, and 16-24 months of age. Please provide your child's date of birth for accurate information.";
      } else if (lowerMessage.includes("bcg")) {
        return "BCG vaccine should be given at birth or as soon as possible. It protects against tuberculosis.";
      } else if (lowerMessage.includes("measles")) {
        return "Measles vaccine is given at 9 months and 15-18 months of age. It's a very important vaccine.";
      } else if (
        lowerMessage.includes("schedule") ||
        lowerMessage.includes("reminder")
      ) {
        return "I can help you with vaccination schedules and send reminders. Please register your child's details to receive personalized reminders.";
      } else {
        return "I can help you with health information, vaccination schedules, and outbreak alerts. Please ask me anything specific about healthcare.";
      }
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-xl sm:rounded-2xl shadow-xl overflow-hidden">
      {/* Chat Header */}
      <div className="bg-gradient-to-r from-primary to-secondary p-3 sm:p-4 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center flex-shrink-0">
              <MessageCircle className="h-4 w-4 sm:h-6 sm:w-6" />
            </div>
            <div className="min-w-0">
              <h3 className="font-semibold text-sm sm:text-lg truncate">
                AI Health Assistant
              </h3>
              <div className="flex items-center space-x-2">
                <p className="text-xs sm:text-sm opacity-90">
                  Always here to help
                </p>
                <div className="flex items-center space-x-1">
                  <Bot className="h-3 w-3 text-green-400" />
                  <span className="text-xs text-green-400 font-medium">
                    Dialogflow
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex space-x-1 sm:space-x-2">
            <button
              onClick={() => {
                const whatsappUrl = WHATSAPP_CONFIG.getWhatsAppUrl(
                  WHATSAPP_CONFIG.PHONE_NUMBER,
                  WHATSAPP_CONFIG.DEFAULT_MESSAGE
                );
                window.open(whatsappUrl, "_blank");
              }}
              className="p-1.5 sm:p-2 bg-white bg-opacity-20 rounded-lg hover:bg-opacity-30 transition-all"
              title="Open WhatsApp Chat"
            >
              <MessageCircle className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>
            <button
              onClick={() => onSendSMS(messages[messages.length - 1]?.text)}
              className="p-1.5 sm:p-2 bg-white bg-opacity-20 rounded-lg hover:bg-opacity-30 transition-all"
              title="Send SMS"
            >
              <Phone className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4 bg-gray-50">
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`flex ${
                message.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[85%] sm:max-w-xs lg:max-w-md px-3 sm:px-4 py-2 sm:py-3 rounded-2xl ${
                  message.sender === "user"
                    ? "chat-bubble-user"
                    : "chat-bubble-bot"
                }`}
              >
                <p className="text-xs sm:text-sm leading-relaxed">
                  {message.text}
                </p>
                <div className="flex items-center justify-between mt-1">
                  <p className="text-xs opacity-70">
                    {message.timestamp.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                  {message.sender === "bot" && message.intent && (
                    <div className="flex items-center space-x-1">
                      {message.isDialogflow ? (
                        <Bot className="h-3 w-3 text-green-500" />
                      ) : (
                        <AlertCircle className="h-3 w-3 text-yellow-500" />
                      )}
                      <span className="text-xs opacity-60">
                        {message.confidence
                          ? `${Math.round(message.confidence * 100)}%`
                          : ""}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Typing Indicator */}
        {isTyping && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-start"
          >
            <div className="chat-bubble-bot px-3 sm:px-4 py-2 sm:py-3 rounded-2xl">
              <div className="flex space-x-1">
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div
                  className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: "0.1s" }}
                ></div>
                <div
                  className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: "0.2s" }}
                ></div>
              </div>
            </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-3 sm:p-4 bg-white border-t">
        {/* Dialogflow Status */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <Bot className="h-4 w-4 text-green-500" />
            <span className="text-xs text-gray-600">
              {isDialogflowEnabled ? "Dialogflow AI Active" : "Fallback Mode"}
            </span>
          </div>
          <button
            onClick={() => setIsDialogflowEnabled(!isDialogflowEnabled)}
            className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
              isDialogflowEnabled
                ? "bg-green-100 text-green-700 hover:bg-green-200"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {isDialogflowEnabled ? "AI ON" : "AI OFF"}
          </button>
        </div>

        <div className="flex space-x-2 sm:space-x-3">
          <select
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
            className="px-2 sm:px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm sm:text-base"
          >
            <option value="en">English</option>
            <option value="hi">हिन्दी</option>
          </select>
          <div className="flex-1 relative">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={
                selectedLanguage === "hi"
                  ? "अपना संदेश टाइप करें..."
                  : "Type your message..."
              }
              className="w-full px-3 sm:px-4 py-2 sm:py-3 pr-10 sm:pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none text-sm sm:text-base"
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim()}
              className="absolute right-1 sm:right-2 top-1/2 transform -translate-y-1/2 p-1.5 sm:p-2 bg-primary text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <Send className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;
