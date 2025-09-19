const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const WhatsAppBot = require("./whatsappBot");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Gemini AI configuration
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Store sessions (in production, use Redis or database)
const sessions = new Map();

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

// Generate session ID
const generateSessionId = () => {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// Dialogflow API endpoint (fallback to Gemini for now)
app.post("/api/dialogflow", async (req, res) => {
  try {
    const { message, language = "en", sessionId: clientSessionId } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    // Use provided session ID or generate new one
    const sessionId = clientSessionId || generateSessionId();

    // Get or create model
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Create healthcare-focused prompt
    const healthcarePrompt = `You are a friendly healthcare helper for village people. Keep your answers SHORT and SIMPLE.

IMPORTANT RULES:
1. Reply in the SAME LANGUAGE as the user's question (${
      language === "hi" ? "Hindi" : "English"
    })
2. Keep answers SHORT - maximum 3-4 sentences
3. Use SIMPLE words that village people understand
4. NO asterisks (*), bold text, or fancy formatting - just plain text
5. Give the most important advice first
6. Always remind them to visit a doctor for serious problems
7. Be warm but brief
8. If they ask about finding hospitals or vaccination centers, tell them to use our location finder

User's question: ${message}`;

    // Generate response
    const result = await model.generateContent(healthcarePrompt);
    const response = await result.response;
    let text = response.text();

    // Clean up any remaining formatting symbols
    text = text
      .replace(/\*\*/g, "")
      .replace(/\*/g, "")
      .replace(/###/g, "")
      .replace(/##/g, "")
      .replace(/#/g, "");

    // Store session for context
    sessions.set(sessionId, {
      lastMessage: message,
      lastResponse: text,
      timestamp: new Date(),
    });

    // Return response
    res.json({
      success: true,
      fulfillmentText: text,
      intent: "healthcare_assistant",
      confidence: 0.95,
      language: language,
      sessionId: sessionId,
    });
  } catch (error) {
    console.error("Dialogflow API Error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to process message",
      fallback: "I apologize, but I encountered an error. Please try again.",
    });
  }
});

// Gemini AI API endpoint
app.post("/api/gemini", async (req, res) => {
  try {
    const { message, language = "en", sessionId: clientSessionId } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    // Use provided session ID or generate new one
    const sessionId = clientSessionId || generateSessionId();

    // Get or create model
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Create healthcare-focused prompt
    const healthcarePrompt = `You are a friendly healthcare helper for village people. Keep your answers SHORT and SIMPLE.

IMPORTANT RULES:
1. Reply in the SAME LANGUAGE as the user's question (${
      language === "hi" ? "Hindi" : "English"
    })
2. Keep answers SHORT - maximum 3-4 sentences
3. Use SIMPLE words that village people understand
4. NO asterisks (*), bold text, or fancy formatting - just plain text
5. Give the most important advice first
6. Always remind them to visit a doctor for serious problems
7. Be warm but brief
8. If they ask about finding hospitals or vaccination centers, tell them to use our location finder

User's question: ${message}`;

    // Generate response
    const result = await model.generateContent(healthcarePrompt);
    const response = await result.response;
    let text = response.text();

    // Clean up any remaining formatting symbols
    text = text
      .replace(/\*\*/g, "")
      .replace(/\*/g, "")
      .replace(/###/g, "")
      .replace(/##/g, "")
      .replace(/#/g, "");

    // Store session for context
    sessions.set(sessionId, {
      lastMessage: message,
      lastResponse: text,
      timestamp: new Date(),
    });

    // Return response
    res.json({
      success: true,
      fulfillmentText: text,
      intent: "healthcare_assistant",
      confidence: 0.95,
      language: language,
      sessionId: sessionId,
    });
  } catch (error) {
    console.error("Gemini API Error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to process message",
      fallback: "I apologize, but I encountered an error. Please try again.",
    });
  }
});

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    timestamp: new Date(),
    website_gemini: process.env.GEMINI_API_KEY
      ? "Configured"
      : "Not configured",
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

// Get session info
app.get("/api/session/:sessionId", (req, res) => {
  const sessionId = req.params.sessionId;
  const session = sessions.get(sessionId);

  if (session) {
    res.json(session);
  } else {
    res.status(404).json({ error: "Session not found" });
  }
});

// Healthcare centers finder endpoint
app.post("/api/healthcare-centers", async (req, res) => {
  try {
    const { location, type = "hospital" } = req.body;

    if (!location) {
      return res.status(400).json({ error: "Location is required" });
    }

    // Using OpenStreetMap Overpass API (completely free)
    const overpassQuery = `
      [out:json];
      (
        node["amenity"="${type}"]["name"~".*",i](around:5000,${location});
        way["amenity"="${type}"]["name"~".*",i](around:5000,${location});
        relation["amenity"="${type}"]["name"~".*",i](around:5000,${location});
      );
      out center;
    `;

    const response = await fetch(
      `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(
        overpassQuery
      )}`
    );
    const data = await response.json();

    const centers = data.elements.map((center) => ({
      name: center.tags?.name || "Unknown",
      type: center.tags?.amenity || type,
      address:
        center.tags?.["addr:full"] ||
        center.tags?.["addr:street"] ||
        "Address not available",
      phone: center.tags?.["contact:phone"] || "Phone not available",
      website: center.tags?.["contact:website"] || null,
      lat: center.lat || center.center?.lat,
      lon: center.lon || center.center?.lon,
    }));

    res.json({
      success: true,
      centers: centers.slice(0, 10), // Limit to 10 results
      location: location,
      total: centers.length,
    });
  } catch (error) {
    console.error("Healthcare centers error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch healthcare centers",
      fallback:
        "Please check your local government health website or call emergency services.",
    });
  }
});

// Vaccination centers finder (for India - using CoWIN public endpoints)
app.post("/api/vaccination-centers", async (req, res) => {
  try {
    const { state, district } = req.body;

    if (!state || !district) {
      return res.status(400).json({
        error: "State and district are required",
        example: { state: "Delhi", district: "Central Delhi" },
      });
    }

    // Get state and district codes from CoWIN API
    const statesResponse = await fetch(
      "https://cdn-api.co-vin.in/api/v2/admin/location/states"
    );
    const states = await statesResponse.json();

    const stateData = states.states.find((s) =>
      s.state_name.toLowerCase().includes(state.toLowerCase())
    );
    if (!stateData) {
      return res.status(404).json({ error: "State not found" });
    }

    const districtsResponse = await fetch(
      `https://cdn-api.co-vin.in/api/v2/admin/location/districts/${stateData.state_id}`
    );
    const districts = await districtsResponse.json();

    const districtData = districts.districts.find((d) =>
      d.district_name.toLowerCase().includes(district.toLowerCase())
    );
    if (!districtData) {
      return res.status(404).json({ error: "District not found" });
    }

    // Get vaccination centers for the district
    const centersResponse = await fetch(
      `https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/calendarByDistrict?district_id=${
        districtData.district_id
      }&date=${new Date().toISOString().split("T")[0]}`
    );
    const centersData = await centersResponse.json();

    const centers = centersData.centers.map((center) => ({
      name: center.name,
      address: center.address,
      pincode: center.pincode,
      fee_type: center.fee_type,
      sessions: center.sessions.map((session) => ({
        date: session.date,
        available_capacity: session.available_capacity,
        vaccine: session.vaccine,
        slots: session.slots,
      })),
    }));

    res.json({
      success: true,
      centers: centers,
      state: stateData.state_name,
      district: districtData.district_name,
      total: centers.length,
    });
  } catch (error) {
    console.error("Vaccination centers error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch vaccination centers",
      fallback:
        "Please visit the CoWIN website (cowin.gov.in) or contact your local health center.",
    });
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
  console.log(`\n🚀 Healthcare Chatbot Server running on port ${PORT}`);
  console.log(
    `🌐 Website Gemini AI: ${
      process.env.GEMINI_API_KEY ? "Configured" : "Not configured"
    }`
  );
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
  console.log(`   • POST /api/gemini - Chat with AI (Website)`);
  console.log(`   • POST /api/healthcare-centers - Find hospitals`);
  console.log(`   • POST /api/vaccination-centers - Find vaccination centers`);
  console.log(`   • GET /api/whatsapp/status - WhatsApp bot status`);
  console.log(`   • POST /api/whatsapp/send - Send WhatsApp message`);
  console.log(`\n🌐 Server URL: http://localhost:${PORT}`);
  console.log(`📱 WhatsApp Bot will show QR code when ready\n`);
});

module.exports = app;
