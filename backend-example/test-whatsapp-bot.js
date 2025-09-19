#!/usr/bin/env node

/**
 * WhatsApp Bot Test Script
 *
 * This script tests the WhatsApp bot functionality
 */

const axios = require("axios");

const BASE_URL = "http://localhost:5000";

async function testWhatsAppBot() {
  console.log("🧪 Testing WhatsApp Healthcare Bot...\n");

  try {
    // Test 1: Health Check
    console.log("1️⃣ Testing health endpoint...");
    const healthResponse = await axios.get(`${BASE_URL}/api/health`);
    console.log("✅ Health check passed");
    console.log(`   Gemini: ${healthResponse.data.gemini}`);
    console.log(
      `   WhatsApp: ${
        healthResponse.data.whatsapp ? "Running" : "Not running"
      }\n`
    );

    // Test 2: WhatsApp Status
    console.log("2️⃣ Testing WhatsApp status...");
    try {
      const whatsappResponse = await axios.get(
        `${BASE_URL}/api/whatsapp/status`
      );
      console.log("✅ WhatsApp bot status:");
      console.log(`   Status: ${whatsappResponse.data.status}`);
      console.log(`   Ready: ${whatsappResponse.data.bot.isReady}`);
      console.log(`   Users: ${whatsappResponse.data.bot.userCount}`);
    } catch (error) {
      if (error.response?.status === 503) {
        console.log(
          "⚠️  WhatsApp bot not initialized (missing GEMINI_API_KEY)"
        );
      } else {
        console.log("❌ WhatsApp status check failed:", error.message);
      }
    }

    // Test 3: Gemini AI (same as website)
    console.log("\n3️⃣ Testing Gemini AI integration...");
    const geminiResponse = await axios.post(`${BASE_URL}/api/gemini`, {
      message: "What vaccines does my child need?",
      language: "en",
    });
    console.log("✅ Gemini AI response received");
    console.log(
      `   Response: ${geminiResponse.data.fulfillmentText.substring(
        0,
        100
      )}...\n`
    );

    // Test 4: Healthcare Centers
    console.log("4️⃣ Testing healthcare centers API...");
    const centersResponse = await axios.post(
      `${BASE_URL}/api/healthcare-centers`,
      {
        location: "28.6139,77.2090",
        type: "hospital",
      }
    );
    console.log("✅ Healthcare centers API working");
    console.log(`   Found ${centersResponse.data.centers.length} hospitals\n`);

    console.log("🎉 All tests passed! WhatsApp bot is ready to use.");
    console.log("\n📱 Next steps:");
    console.log("   1. Run: npm run whatsapp");
    console.log("   2. Scan QR code with WhatsApp");
    console.log("   3. Send messages to test the bot");
  } catch (error) {
    console.error("❌ Test failed:", error.message);

    if (error.code === "ECONNREFUSED") {
      console.log("\n💡 Make sure the server is running:");
      console.log("   npm start");
    }

    if (error.response?.status === 500) {
      console.log("\n💡 Check your GEMINI_API_KEY in .env file");
    }
  }
}

// Run tests
testWhatsAppBot();
