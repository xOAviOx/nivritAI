#!/usr/bin/env node

/**
 * WhatsApp Healthcare Bot Startup Script
 *
 * This script helps you start the WhatsApp bot with proper setup
 * and provides helpful information about the bot.
 */

const fs = require("fs");
const path = require("path");
require("dotenv").config();

console.log("🏥 WhatsApp Healthcare Bot Startup");
console.log("=====================================\n");

// Check if .env file exists
if (!fs.existsSync(".env")) {
  console.log("❌ .env file not found!");
  console.log("📋 Please copy env.example to .env and add your GEMINI_API_KEY");
  console.log("   cp env.example .env");
  console.log("   # Then edit .env and add your GEMINI_API_KEY\n");
  process.exit(1);
}

// Check if GEMINI_API_KEY is configured
if (
  !process.env.GEMINI_API_KEY ||
  process.env.GEMINI_API_KEY === "your-gemini-api-key-here"
) {
  console.log("❌ GEMINI_API_KEY not configured!");
  console.log("📋 Please add your Gemini API key to the .env file");
  console.log("   GEMINI_API_KEY=your_actual_api_key_here\n");
  process.exit(1);
}

console.log("✅ Environment configuration looks good!");
console.log("🤖 Gemini AI API Key: Configured");
console.log("📱 WhatsApp Bot: Ready to start\n");

console.log("🚀 Starting WhatsApp Healthcare Bot...");
console.log("📋 Instructions:");
console.log("   1. Wait for QR code to appear");
console.log("   2. Open WhatsApp on your phone");
console.log("   3. Go to Settings > Linked Devices > Link a Device");
console.log("   4. Scan the QR code");
console.log("   5. Bot will be ready to receive messages!\n");

// Start the server
require("./server.js");
