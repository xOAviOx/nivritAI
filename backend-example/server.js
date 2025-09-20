const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

// Load environment variables first
dotenv.config();

const { GoogleGenerativeAI } = require("@google/generative-ai");
const WhatsAppBot = require("./whatsappBot");
const supabaseService = require("./services/supabaseService");
const NotificationProcessor = require("./services/notificationProcessor");

const app = express();
const PORT = process.env.PORT || 5000;

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

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res
      .status(401)
      .json({ success: false, error: "Access token required" });
  }

  const verification = supabaseService.verifyToken(token);
  if (!verification.success) {
    return res.status(403).json({ success: false, error: verification.error });
  }

  req.user = verification.data;
  next();
};

// Admin authentication middleware
const authenticateAdmin = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res
      .status(401)
      .json({ success: false, error: "Access token required" });
  }

  const verification = supabaseService.verifyToken(token);
  if (!verification.success || verification.data.type !== "admin") {
    return res
      .status(403)
      .json({ success: false, error: "Admin access required" });
  }

  req.admin = verification.data;
  next();
};

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

// Initialize Notification Processor
let notificationProcessor = null;
if (
  process.env.WHATSAPP_GEMINI_API_KEY &&
  process.env.SUPABASE_URL &&
  process.env.SUPABASE_ANON_KEY
) {
  // Pass the WhatsApp bot instance to the notification processor
  notificationProcessor = new NotificationProcessor(whatsappBot);
  // Start processor only if NOT running as standalone worker
  if (!process.argv.includes("--worker")) {
    notificationProcessor.start();
    console.log("✅ Notification processor started");
  }
} else {
  console.log(
    "⚠️  Missing required env vars. Notification processor will not start."
  );
}

// Generate session ID
const generateSessionId = () => {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// ==================== AUTHENTICATION ENDPOINTS ====================

// User Registration
app.post("/api/auth/register", async (req, res) => {
  try {
    const {
      name,
      mobile_number,
      email,
      password,
      language_preference,
      location,
      date_of_birth,
    } = req.body;

    // Validation
    if (!name || !mobile_number || !password) {
      return res.status(400).json({
        success: false,
        error: "Name, mobile number, and password are required",
      });
    }

    // Validate mobile number format (basic validation)
    const mobileRegex = /^[6-9]\d{9}$/;
    if (!mobileRegex.test(mobile_number)) {
      return res.status(400).json({
        success: false,
        error: "Please enter a valid 10-digit mobile number",
      });
    }

    // Validate password strength
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        error: "Password must be at least 6 characters long",
      });
    }

    const result = await supabaseService.registerUser({
      name,
      mobile_number,
      email,
      password,
      language_preference,
      location,
      date_of_birth,
    });

    if (result.success) {
      res.status(201).json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
});

// User Login
app.post("/api/auth/login", async (req, res) => {
  try {
    const { mobile_number, password } = req.body;

    if (!mobile_number || !password) {
      return res.status(400).json({
        success: false,
        error: "Mobile number and password are required",
      });
    }

    const result = await supabaseService.loginUser({ mobile_number, password });

    if (result.success) {
      res.json(result);
    } else {
      res.status(401).json(result);
    }
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
});

// Admin Login
app.post("/api/auth/admin/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: "Email and password are required",
      });
    }

    const result = await supabaseService.loginAdmin({ email, password });

    if (result.success) {
      res.json(result);
    } else {
      res.status(401).json(result);
    }
  } catch (error) {
    console.error("Admin login error:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
});

// Get current user profile
app.get("/api/auth/profile", authenticateToken, async (req, res) => {
  try {
    const result = await supabaseService.getUserById(req.user.userId);

    if (result.success) {
      res.json({
        success: true,
        user: result.user,
      });
    } else {
      res.status(404).json(result);
    }
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
});

// Update user preferences
app.put("/api/auth/preferences", authenticateToken, async (req, res) => {
  try {
    const preferences = req.body;
    const result = await supabaseService.updateUserPreferences(
      req.user.userId,
      preferences
    );

    if (result.success) {
      res.json({ success: true, message: "Preferences updated successfully" });
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    console.error("Update preferences error:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
});

// Get user notifications
app.get("/api/auth/notifications", authenticateToken, async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const result = await supabaseService.getUserNotifications(
      req.user.userId,
      parseInt(page),
      parseInt(limit)
    );

    if (result.success) {
      res.json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    console.error("Get user notifications error:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
});

// ==================== ADMIN ENDPOINTS ====================

// Get all users (admin only)
app.get("/api/admin/users", authenticateAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "" } = req.query;
    const result = await supabaseService.getAllUsers(
      parseInt(page),
      parseInt(limit),
      search
    );

    if (result.success) {
      res.json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    console.error("Get users error:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
});

// Send notifications (admin only)
app.post(
  "/api/admin/notifications/send",
  authenticateAdmin,
  async (req, res) => {
    try {
      const { user_ids, type, title, message, delivery_method, scheduled_at } =
        req.body;

      if (!user_ids || !Array.isArray(user_ids) || user_ids.length === 0) {
        return res.status(400).json({
          success: false,
          error: "At least one user ID is required",
        });
      }

      if (!type || !title || !message) {
        return res.status(400).json({
          success: false,
          error: "Type, title, and message are required",
        });
      }

      const result = await supabaseService.sendNotification({
        user_ids,
        type,
        title,
        message,
        delivery_method: delivery_method || "whatsapp",
        scheduled_at,
        admin_id: req.admin.adminId,
      });

      if (result.success) {
        res.json({
          success: true,
          message:
            result.message || `Notification queued for ${result.count} users`,
          notifications: result.notifications,
          count: result.count,
        });
      } else {
        res.status(400).json(result);
      }
    } catch (error) {
      console.error("Send notification error:", error);
      res.status(500).json({
        success: false,
        error: "Internal server error",
      });
    }
  }
);

// Get notification processor status (admin only)
app.get("/api/admin/notifications/status", authenticateAdmin, (req, res) => {
  try {
    if (!notificationProcessor) {
      return res.status(503).json({
        success: false,
        error: "Notification processor not initialized",
      });
    }

    const status = notificationProcessor.getStatus();
    res.json({
      success: true,
      status: status,
      message: "Notification processor status retrieved successfully",
    });
  } catch (error) {
    console.error("Get notification status error:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
});

// Manually trigger notification processing (admin only)
app.post(
  "/api/admin/notifications/process",
  authenticateAdmin,
  async (req, res) => {
    try {
      if (!notificationProcessor) {
        return res.status(503).json({
          success: false,
          error: "Notification processor not initialized",
        });
      }

      // Check if processor is already running
      const status = notificationProcessor.getStatus();
      if (status.isProcessing) {
        return res.status(409).json({
          success: false,
          error: "Notification processor is already processing notifications",
        });
      }

      // Manually trigger processing
      console.log("🔄 Admin manually triggered notification processing");
      await notificationProcessor.processPendingNotifications();

      res.json({
        success: true,
        message: "Notification processing triggered successfully",
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Manual notification processing error:", error);
      res.status(500).json({
        success: false,
        error: "Failed to trigger notification processing",
      });
    }
  }
);

// Get pending notifications (admin only)
app.get(
  "/api/admin/notifications/pending",
  authenticateAdmin,
  async (req, res) => {
    try {
      const { page = 1, limit = 20 } = req.query;

      const { data, error, count } = await supabaseService.supabase
        .from("notifications")
        .select(
          `
        *,
        users!inner(mobile_number, name, language_preference)
      `,
          { count: "exact" }
        )
        .eq("status", "pending")
        .order("created_at", { ascending: false })
        .range((page - 1) * limit, page * limit - 1);

      if (error) {
        return res.status(400).json({
          success: false,
          error: error.message,
        });
      }

      res.json({
        success: true,
        notifications: data || [],
        total: count || 0,
        page: parseInt(page),
        limit: parseInt(limit),
      });
    } catch (error) {
      console.error("Get pending notifications error:", error);
      res.status(500).json({
        success: false,
        error: "Internal server error",
      });
    }
  }
);

// Get notification statistics (admin only)
app.get(
  "/api/admin/notifications/stats",
  authenticateAdmin,
  async (req, res) => {
    try {
      const { data, error } = await supabaseService.supabase
        .from("notifications")
        .select("status, delivery_method, created_at")
        .gte(
          "created_at",
          new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
        ); // Last 7 days

      if (error) {
        return res.status(400).json({
          success: false,
          error: error.message,
        });
      }

      const stats = {
        total: data.length,
        pending: data.filter((n) => n.status === "pending").length,
        sent: data.filter((n) => n.status === "sent").length,
        failed: data.filter((n) => n.status === "failed").length,
        whatsapp: data.filter((n) => n.delivery_method === "whatsapp").length,
        sms: data.filter((n) => n.delivery_method === "sms").length,
        email: data.filter((n) => n.delivery_method === "email").length,
      };

      res.json({
        success: true,
        stats: stats,
        period: "Last 7 days",
      });
    } catch (error) {
      console.error("Get notification stats error:", error);
      res.status(500).json({
        success: false,
        error: "Internal server error",
      });
    }
  }
);

// Get notification templates (admin only)
app.get("/api/admin/templates", authenticateAdmin, async (req, res) => {
  try {
    const result = await supabaseService.getNotificationTemplates();

    if (result.success) {
      res.json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    console.error("Get templates error:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
});

// Enhanced language detection for multiple Indian languages
const detectLanguage = (message) => {
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

    // Create NivritAI-focused prompt
    const nivritAIPrompt = `You are NivritAI, a friendly health assistant for village people. Keep your answers SHORT and SIMPLE.

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
    const result = await model.generateContent(nivritAIPrompt);
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
      intent: "nivrit_ai_assistant",
      confidence: 0.95,
      language: detectedLanguage,
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
    const { message, language = null, sessionId: clientSessionId } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    // Use provided session ID or generate new one
    const sessionId = clientSessionId || generateSessionId();

    // Detect language if not provided
    const detectedLanguage = language || detectLanguage(message);

    // Get or create model
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

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

    // Create healthcare-focused prompt
    const nivritAIPrompt = `You are Nivrit AI, a friendly healthcare assistant. You help people with health questions, vaccination schedules, and medical guidance.

IMPORTANT RULES:
1. Reply EXCLUSIVELY in ${getLanguageName(
      detectedLanguage
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

User's question: ${message}`;

    // Generate response
    const result = await model.generateContent(nivritAIPrompt);
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
      intent: "nivrit_ai_assistant",
      confidence: 0.95,
      language: detectedLanguage,
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

// NivritAI centers finder endpoint
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
    console.error("NivritAI centers error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch NivritAI centers",
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
  console.log(`\n🚀 NivritAI Chatbot Server running on port ${PORT}`);
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
  console.log(
    `📢 Notification Processor: ${
      notificationProcessor
        ? "Running"
        : "Not started (missing required env vars)"
    }`
  );
  console.log(`\n📋 Available endpoints:`);
  console.log(`   • POST /api/gemini - Chat with AI (Website)`);
  console.log(`   • POST /api/healthcare-centers - Find hospitals`);
  console.log(`   • POST /api/vaccination-centers - Find vaccination centers`);
  console.log(`   • GET /api/whatsapp/status - WhatsApp bot status`);
  console.log(`   • POST /api/whatsapp/send - Send WhatsApp message`);
  console.log(
    `   • POST /api/admin/notifications/send - Send notifications (Admin)`
  );
  console.log(
    `   • GET /api/admin/notifications/status - Notification processor status (Admin)`
  );
  console.log(
    `   • POST /api/admin/notifications/process - Manually trigger notification processing (Admin)`
  );
  console.log(
    `   • GET /api/admin/notifications/pending - Get pending notifications (Admin)`
  );
  console.log(
    `   • GET /api/admin/notifications/stats - Get notification statistics (Admin)`
  );
  console.log(`\n🌐 Server URL: http://localhost:${PORT}`);
  console.log(`📱 WhatsApp Bot will show QR code when ready`);
  console.log(`📢 Notifications will be processed automatically\n`);
});

module.exports = app;
