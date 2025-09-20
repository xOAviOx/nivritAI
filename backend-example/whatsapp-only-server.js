const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

// Load environment variables first
dotenv.config();

const WhatsAppBot = require("./whatsappBot");

const app = express();
const PORT = process.env.WHATSAPP_PORT || 5001;

// Middleware
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:3001",
      "http://localhost:3002",
      "http://localhost:3003",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());

// Initialize WhatsApp Bot
let whatsappBot = null;
if (process.env.WHATSAPP_GEMINI_API_KEY) {
  whatsappBot = new WhatsAppBot();
  whatsappBot.start().catch(console.error);
} else {
  console.log(
    "⚠️  WHATSAPP_GEMINI_API_KEY not found. WhatsApp bot will not start."
  );
}

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    timestamp: new Date(),
    whatsapp_gemini: process.env.WHATSAPP_GEMINI_API_KEY
      ? "Configured"
      : "Not configured",
    whatsapp: whatsappBot ? whatsappBot.getStatus() : "Not initialized",
  });
});

// WhatsApp Bot Status endpoint
app.get("/api/whatsapp/status", (req, res) => {
  if (!whatsappBot) {
    return res.status(503).json({
      status: "WhatsApp Bot not initialized",
      error: "WHATSAPP_GEMINI_API_KEY not configured",
    });
  }

  res.json({
    status: "WhatsApp Bot Running",
    timestamp: new Date(),
    bot: whatsappBot.getStatus(),
    whatsapp_gemini: process.env.WHATSAPP_GEMINI_API_KEY
      ? "Connected"
      : "Not configured",
  });
});

// Send WhatsApp message endpoint (for testing)
app.post("/api/whatsapp/send", async (req, res) => {
  try {
    const { number, message } = req.body;

    if (!number || !message) {
      return res.status(400).json({ error: "Number and message are required" });
    }

    if (!whatsappBot) {
      return res.status(503).json({ error: "WhatsApp bot not initialized" });
    }

    await whatsappBot.sendMessage(number, message);
    res.json({ success: true, message: "Message sent successfully" });
  } catch (error) {
    console.error("Error sending WhatsApp message:", error);
    res.status(500).json({ error: "Failed to send message" });
  }
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error("Server Error:", error);
  res.status(500).json({
    success: false,
    error: "Internal server error",
  });
});

app.listen(PORT, () => {
  console.log(`\n🚀 WhatsApp Bot Server running on port ${PORT}`);
  console.log(
    `📱 WhatsApp Gemini AI: ${
      process.env.WHATSAPP_GEMINI_API_KEY ? "Configured" : "Not configured"
    }`
  );
  console.log(
    `📱 WhatsApp Bot: ${
      whatsappBot
        ? "Initializing..."
        : "Not started (missing WHATSAPP_GEMINI_API_KEY)"
    }`
  );
  console.log(`\n📋 Available endpoints:`);
  console.log(`   • GET /api/whatsapp/status - WhatsApp bot status`);
  console.log(`   • POST /api/whatsapp/send - Send WhatsApp message`);
  console.log(`   • GET /api/health - Health check`);
  console.log(`\n🌐 Server URL: http://localhost:${PORT}`);
  console.log(`📱 WhatsApp Bot will show QR code when ready\n`);
});

module.exports = app;
