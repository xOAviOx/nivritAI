#!/usr/bin/env node

const dotenv = require("dotenv");

// Load environment variables FIRST before importing any other modules
dotenv.config();

const NotificationProcessor = require("./services/notificationProcessor");

console.log("🚀 Starting Nivrit AI Notification Worker...");
console.log("=".repeat(50));

// Check required environment variables
const requiredEnvVars = [
  "SUPABASE_URL",
  "SUPABASE_ANON_KEY",
  "WHATSAPP_GEMINI_API_KEY",
];

const missingEnvVars = requiredEnvVars.filter((envVar) => !process.env[envVar]);

if (missingEnvVars.length > 0) {
  console.error("❌ Missing required environment variables:");
  missingEnvVars.forEach((envVar) => {
    console.error(`   • ${envVar}`);
  });
  console.error(
    "\nPlease check your .env file and ensure all required variables are set."
  );
  process.exit(1);
}

console.log("✅ Environment variables validated");
console.log(
  `📱 WhatsApp Gemini API: ${
    process.env.WHATSAPP_GEMINI_API_KEY ? "Configured" : "Not configured"
  }`
);
console.log(
  `🗄️  Supabase URL: ${
    process.env.SUPABASE_URL ? "Configured" : "Not configured"
  }`
);
console.log("");

// Initialize notification processor
const notificationProcessor = new NotificationProcessor();

// Handle graceful shutdown
const gracefulShutdown = () => {
  console.log("\n🛑 Shutting down notification worker...");
  notificationProcessor.stop();
  console.log("✅ Notification worker stopped gracefully");
  process.exit(0);
};

// Handle process signals
process.on("SIGINT", gracefulShutdown);
process.on("SIGTERM", gracefulShutdown);

// Handle uncaught exceptions
process.on("uncaughtException", (error) => {
  console.error("❌ Uncaught Exception:", error);
  notificationProcessor.stop();
  process.exit(1);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("❌ Unhandled Rejection at:", promise, "reason:", reason);
  notificationProcessor.stop();
  process.exit(1);
});

// Start the notification processor
try {
  notificationProcessor.start();

  // Log status every 5 minutes
  setInterval(() => {
    const status = notificationProcessor.getStatus();
    console.log(
      `📊 Status Check - Running: ${status.isRunning}, Processing: ${status.isProcessing}, WhatsApp Ready: ${status.whatsappBotReady}`
    );
  }, 5 * 60 * 1000);

  console.log("✅ Notification worker started successfully!");
  console.log("📋 Worker will process pending notifications every 30 seconds");
  console.log("🔄 Press Ctrl+C to stop the worker");
  console.log("");
} catch (error) {
  console.error("❌ Failed to start notification worker:", error);
  process.exit(1);
}

// Keep the process alive
setInterval(() => {
  // This keeps the process running
}, 1000);
