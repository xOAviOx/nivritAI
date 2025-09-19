import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  MessageCircle,
  Phone,
  Send,
  Languages,
  Bot,
  User,
  Wifi,
  WifiOff,
} from "lucide-react";
import ChatWindow from "../components/ChatWindow";
import toast from "react-hot-toast";
import WHATSAPP_CONFIG from "../config/whatsapp";

const Chatbot = () => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [whatsappStatus, setWhatsappStatus] = useState({
    isReady: false,
    userCount: 0,
    uptime: 0,
  });
  // Check WhatsApp bot status
  useEffect(() => {
    const checkWhatsAppStatus = async () => {
      const status = await WHATSAPP_CONFIG.checkBotStatus();
      setWhatsappStatus(status);
    };

    checkWhatsAppStatus();
    const interval = setInterval(checkWhatsAppStatus, 30000); // Check every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const handleSendWhatsApp = (message) => {
    if (!message) {
      toast.error("No message to send");
      return;
    }

    // Simulate WhatsApp API call
    toast.promise(
      new Promise((resolve) => {
        setTimeout(() => {
          resolve();
        }, 1000);
      }),
      {
        loading: "Sending to WhatsApp...",
        success: "Message sent to WhatsApp successfully!",
        error: "Failed to send message",
      }
    );
  };

  const handleSendSMS = (message) => {
    if (!message) {
      toast.error("No message to send");
      return;
    }

    // Simulate SMS API call
    toast.promise(
      new Promise((resolve) => {
        setTimeout(() => {
          resolve();
        }, 1000);
      }),
      {
        loading: "Sending SMS...",
        success: "SMS sent successfully!",
        error: "Failed to send SMS",
      }
    );
  };

  const quickQuestions = [
    {
      question: "Polio ka tika kab lagega?",
      language: "hi",
      icon: "💉",
    },
    {
      question: "What vaccines does my child need?",
      language: "en",
      icon: "🩺",
    },
    {
      question: "BCG vaccine side effects",
      language: "en",
      icon: "⚠️",
    },
    {
      question: "खसरा का टीका कब लगता है?",
      language: "hi",
      icon: "🌡️",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-4 sm:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-6 sm:mb-8"
        >
          <div className="flex flex-col sm:flex-row items-center justify-center mb-4">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-primary to-secondary rounded-2xl flex items-center justify-center mb-3 sm:mb-0 sm:mr-4">
              <MessageCircle className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
            </div>
            <div className="text-center sm:text-left">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">
                AI Health Assistant
              </h1>
              <p className="text-base sm:text-lg text-gray-600">
                Ask me anything about healthcare
              </p>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 sm:gap-8">
          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-1 order-2 lg:order-1"
          >
            <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 mb-4 sm:mb-6">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center">
                <Languages className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-primary" />
                Quick Questions
              </h3>
              <div className="space-y-2 sm:space-y-3">
                {quickQuestions.map((item, index) => (
                  <motion.button
                    key={index}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full text-left p-2 sm:p-3 bg-gray-50 hover:bg-primary hover:text-white rounded-lg transition-all duration-200"
                  >
                    <div className="flex items-start space-x-2 sm:space-x-3">
                      <span className="text-sm sm:text-lg flex-shrink-0">
                        {item.icon}
                      </span>
                      <div className="min-w-0">
                        <p className="text-xs sm:text-sm font-medium truncate">
                          {item.question}
                        </p>
                        <p className="text-xs opacity-70">
                          {item.language === "hi" ? "हिन्दी" : "English"}
                        </p>
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Features Card */}
            <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">
                Features
              </h3>
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Bot className="h-3 w-3 sm:h-4 sm:w-4 text-green-600" />
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm font-medium text-gray-900">
                      AI Powered
                    </p>
                    <p className="text-xs text-gray-600">Smart responses</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Languages className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm font-medium text-gray-900">
                      Multilingual
                    </p>
                    <p className="text-xs text-gray-600">English & Hindi</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Phone className="h-3 w-3 sm:h-4 sm:w-4 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm font-medium text-gray-900">
                      WhatsApp & SMS
                    </p>
                    <p className="text-xs text-gray-600">Send messages</p>
                  </div>
                </div>
              </div>

              {/* WhatsApp Chat Button */}
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-gray-600">
                    WhatsApp Bot Status
                  </span>
                  <div className="flex items-center space-x-1">
                    {whatsappStatus.isReady ? (
                      <Wifi className="h-3 w-3 text-green-500" />
                    ) : (
                      <WifiOff className="h-3 w-3 text-red-500" />
                    )}
                    <span
                      className={`text-xs ${
                        whatsappStatus.isReady
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {whatsappStatus.isReady ? "Online" : "Offline"}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => {
                    const whatsappUrl = WHATSAPP_CONFIG.getWhatsAppUrl(
                      WHATSAPP_CONFIG.PHONE_NUMBER,
                      WHATSAPP_CONFIG.DEFAULT_MESSAGE
                    );
                    window.open(whatsappUrl, "_blank");
                  }}
                  className={`w-full font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2 ${
                    whatsappStatus.isReady
                      ? "bg-green-500 hover:bg-green-600 text-white"
                      : "bg-gray-400 text-gray-200 cursor-not-allowed"
                  }`}
                  disabled={!whatsappStatus.isReady}
                >
                  <MessageCircle className="h-4 w-4" />
                  <span>
                    {whatsappStatus.isReady
                      ? "Chat on WhatsApp"
                      : "WhatsApp Bot Offline"}
                  </span>
                </button>
                {whatsappStatus.isReady && (
                  <p className="text-xs text-gray-500 mt-1 text-center">
                    {whatsappStatus.userCount} active users
                  </p>
                )}
              </div>
            </div>
          </motion.div>

          {/* Chat Window */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className={`lg:col-span-3 order-1 lg:order-2 ${
              isFullscreen ? "fixed inset-0 z-50 bg-white" : ""
            }`}
          >
            <div
              className={`${
                isFullscreen ? "h-screen" : "h-[500px] sm:h-[600px]"
              }`}
            >
              <ChatWindow
                onSendWhatsApp={handleSendWhatsApp}
                onSendSMS={handleSendSMS}
              />
            </div>

            {/* Fullscreen Toggle */}
            <div className="mt-3 sm:mt-4 flex justify-center">
              <button
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="px-4 sm:px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition-all duration-200 flex items-center space-x-2 text-sm sm:text-base"
              >
                <span>{isFullscreen ? "Exit Fullscreen" : "Fullscreen"}</span>
              </button>
            </div>
          </motion.div>
        </div>

        {/* Instructions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-12 bg-white rounded-2xl shadow-lg p-8"
        >
          <h3 className="text-2xl font-semibold text-gray-900 mb-6 text-center">
            How to Use
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="h-8 w-8 text-blue-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">
                1. Ask Questions
              </h4>
              <p className="text-gray-600">
                Type your health questions in English or Hindi
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Bot className="h-8 w-8 text-green-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">
                2. Get AI Response
              </h4>
              <p className="text-gray-600">
                Receive instant, accurate health information
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Send className="h-8 w-8 text-purple-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">
                3. Share Results
              </h4>
              <p className="text-gray-600">
                Send responses via WhatsApp or SMS
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Chatbot;
