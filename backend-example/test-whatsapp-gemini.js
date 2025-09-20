#!/usr/bin/env node

const dotenv = require("dotenv");
const { GoogleGenerativeAI } = require("@google/generative-ai");

// Load environment variables
dotenv.config();

console.log("🧪 Testing WhatsApp Bot Gemini Integration");
console.log("=".repeat(50));

async function testWhatsAppGemini() {
  try {
    console.log("1. Checking environment variables...");
    const apiKey = process.env.WHATSAPP_GEMINI_API_KEY;

    if (!apiKey) {
      throw new Error(
        "WHATSAPP_GEMINI_API_KEY not found in environment variables"
      );
    }

    console.log(`   ✅ API Key found (length: ${apiKey.length})`);
    console.log(`   🔑 Key starts with: ${apiKey.substring(0, 10)}...`);

    console.log("\n2. Initializing Gemini AI...");
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    console.log("   ✅ Gemini AI initialized successfully");

    console.log("\n3. Testing simple message generation...");
    const testPrompt = `You are Nivrit AI, a friendly healthcare assistant. Reply briefly and helpfully.

User's question: Hello, I have a headache. What should I do?`;

    const result = await model.generateContent(testPrompt);
    const response = await result.response;
    const text = response.text();

    console.log("   ✅ Message generated successfully");
    console.log(`   💬 Response: ${text.substring(0, 100)}...`);

    console.log("\n4. Testing healthcare-specific prompt...");
    const healthcarePrompt = `You are Nivrit AI, a friendly healthcare assistant. You help people with health questions, vaccination schedules, and medical guidance.

IMPORTANT RULES:
1. Reply EXCLUSIVELY in English
2. Keep answers SHORT and helpful - maximum 3-4 sentences
3. Use SIMPLE words that everyone can understand
4. NO asterisks (*), bold text, or fancy formatting - just plain text
5. Give the most important advice first
6. Always remind them to visit a doctor for serious problems
7. Be warm, helpful, and professional

User's question: I have a fever and body aches. What should I do?`;

    const healthcareResult = await model.generateContent(healthcarePrompt);
    const healthcareResponse = await healthcareResult.response;
    const healthcareText = healthcareResponse.text();

    console.log("   ✅ Healthcare prompt processed successfully");
    console.log(
      `   💬 Healthcare Response: ${healthcareText.substring(0, 150)}...`
    );

    console.log("\n5. Testing language detection and formatting...");
    const hindiPrompt = `You are Nivrit AI, a friendly healthcare assistant. You help people with health questions, vaccination schedules, and medical guidance.

IMPORTANT RULES:
1. Reply EXCLUSIVELY in Hindi - the same language as the user's question
2. Keep answers SHORT and helpful - maximum 3-4 sentences
3. Use SIMPLE words that everyone can understand
4. NO asterisks (*), bold text, or fancy formatting - just plain text
5. Give the most important advice first
6. Always remind them to visit a doctor for serious problems

User's question: मुझे सिरदर्द है। क्या करना चाहिए?`;

    const hindiResult = await model.generateContent(hindiPrompt);
    const hindiResponse = await hindiResult.response;
    const hindiText = hindiResponse.text();

    console.log("   ✅ Hindi prompt processed successfully");
    console.log(`   💬 Hindi Response: ${hindiText.substring(0, 100)}...`);

    console.log(
      "\n✅ All tests passed! WhatsApp Bot Gemini integration is working correctly."
    );
    console.log("\n📱 The issue might be:");
    console.log("   1. WhatsApp bot needs QR code scan to connect");
    console.log("   2. Bot is not ready (isReady: false)");
    console.log(
      "   3. Message processing happens only when bot is fully connected"
    );
  } catch (error) {
    console.error("\n❌ Test failed:", error.message);

    if (error.message.includes("API_KEY_INVALID")) {
      console.error("\n🔧 API Key Issue:");
      console.error("   • Check if the API key is correct");
      console.error("   • Verify the key has proper permissions");
      console.error("   • Make sure the key is not expired");
    } else if (error.message.includes("QUOTA_EXCEEDED")) {
      console.error("\n🔧 Quota Issue:");
      console.error("   • API quota might be exceeded");
      console.error("   • Check your Google Cloud Console billing");
    } else {
      console.error("\n🔧 Other Issue:");
      console.error("   • Check your internet connection");
      console.error("   • Verify the Gemini API is accessible");
    }
  }
}

// Run the test
testWhatsAppGemini().catch(console.error);
