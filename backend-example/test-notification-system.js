#!/usr/bin/env node

const dotenv = require("dotenv");
const axios = require("axios");

// Load environment variables
dotenv.config();

const BASE_URL = process.env.API_URL || "http://localhost:5002";

// Test configuration
const TEST_CONFIG = {
  adminEmail: "admin@nivritai.com",
  adminPassword: "admin123",
  testUserId: "0b47986e-2885-46b5-8563-0c3b7455df24", // Test User with phone 9876543210
  testPhoneNumber: "9876543210", // Update this with a valid WhatsApp number
};

console.log("🧪 Testing WhatsApp Notification System");
console.log("=".repeat(50));

async function testNotificationSystem() {
  try {
    console.log("1. Testing server health...");
    await testServerHealth();

    console.log("\n2. Testing WhatsApp bot status...");
    await testWhatsAppBotStatus();

    console.log("\n3. Testing admin authentication...");
    const adminToken = await testAdminLogin();

    console.log("\n4. Testing notification processor status...");
    await testNotificationProcessorStatus(adminToken);

    console.log("\n5. Testing notification sending...");
    await testSendNotification(adminToken);

    console.log("\n6. Testing pending notifications...");
    await testPendingNotifications(adminToken);

    console.log("\n7. Testing notification statistics...");
    await testNotificationStats(adminToken);

    console.log("\n✅ All tests completed successfully!");
    console.log("\n📱 Check your WhatsApp for the test notification!");
  } catch (error) {
    console.error("\n❌ Test failed:", error.message);
    process.exit(1);
  }
}

async function testServerHealth() {
  try {
    const response = await axios.get(`${BASE_URL}/api/health`);
    console.log(`   ✅ Server is running (${response.data.status})`);
    console.log(`   📱 WhatsApp Gemini: ${response.data.whatsapp_gemini}`);
    console.log(
      `   🤖 WhatsApp Bot: ${
        response.data.whatsapp.isReady ? "Ready" : "Not Ready"
      }`
    );
  } catch (error) {
    throw new Error(`Server health check failed: ${error.message}`);
  }
}

async function testWhatsAppBotStatus() {
  try {
    const response = await axios.get(`${BASE_URL}/api/whatsapp/status`);
    if (response.data.status === "WhatsApp Bot Running") {
      console.log("   ✅ WhatsApp bot is running");
      console.log(`   👥 Active users: ${response.data.bot.userCount}`);
      console.log(
        `   ⏱️  Uptime: ${Math.floor(response.data.bot.uptime / 60)} minutes`
      );
    } else {
      console.log(
        "   ⚠️  WhatsApp bot not ready - you may need to scan QR code"
      );
    }
  } catch (error) {
    console.log(
      "   ⚠️  WhatsApp bot status check failed - this is normal if bot isn't started"
    );
  }
}

async function testAdminLogin() {
  try {
    const response = await axios.post(`${BASE_URL}/api/auth/admin/login`, {
      email: TEST_CONFIG.adminEmail,
      password: TEST_CONFIG.adminPassword,
    });

    if (response.data.success) {
      console.log("   ✅ Admin authentication successful");
      return response.data.token;
    } else {
      throw new Error("Admin login failed");
    }
  } catch (error) {
    throw new Error(
      `Admin login failed: ${error.response?.data?.error || error.message}`
    );
  }
}

async function testNotificationProcessorStatus(adminToken) {
  try {
    const response = await axios.get(
      `${BASE_URL}/api/admin/notifications/status`,
      {
        headers: { Authorization: `Bearer ${adminToken}` },
      }
    );

    if (response.data.success) {
      const status = response.data.status;
      console.log("   ✅ Notification processor is running");
      console.log(`   🔄 Processing: ${status.isProcessing}`);
      console.log(`   📱 WhatsApp Ready: ${status.whatsappBotReady}`);
    } else {
      throw new Error("Notification processor not available");
    }
  } catch (error) {
    console.log("   ⚠️  Notification processor status check failed");
    console.log(`   Error: ${error.response?.data?.error || error.message}`);
  }
}

async function testSendNotification(adminToken) {
  try {
    const notificationData = {
      user_ids: [TEST_CONFIG.testUserId],
      type: "health_tip",
      title: "Test Health Tip",
      message:
        "This is a test notification from Nivrit AI notification system! 🏥💚\n\nIf you received this message, the WhatsApp notification system is working correctly!",
      delivery_method: "whatsapp",
    };

    const response = await axios.post(
      `${BASE_URL}/api/admin/notifications/send`,
      notificationData,
      {
        headers: { Authorization: `Bearer ${adminToken}` },
      }
    );

    if (response.data.success) {
      console.log("   ✅ Test notification sent successfully");
      console.log(`   📊 Queued for ${response.data.count} users`);
      console.log(
        `   💬 Message: ${notificationData.message.substring(0, 50)}...`
      );
    } else {
      throw new Error("Failed to send test notification");
    }
  } catch (error) {
    throw new Error(
      `Send notification failed: ${
        error.response?.data?.error || error.message
      }`
    );
  }
}

async function testPendingNotifications(adminToken) {
  try {
    const response = await axios.get(
      `${BASE_URL}/api/admin/notifications/pending?limit=5`,
      {
        headers: { Authorization: `Bearer ${adminToken}` },
      }
    );

    if (response.data.success) {
      console.log(`   ✅ Found ${response.data.total} pending notifications`);
      if (response.data.notifications.length > 0) {
        console.log("   📋 Recent pending notifications:");
        response.data.notifications.slice(0, 3).forEach((notif, index) => {
          console.log(`      ${index + 1}. ${notif.title} (${notif.type})`);
        });
      }
    } else {
      throw new Error("Failed to get pending notifications");
    }
  } catch (error) {
    throw new Error(
      `Pending notifications check failed: ${
        error.response?.data?.error || error.message
      }`
    );
  }
}

async function testNotificationStats(adminToken) {
  try {
    const response = await axios.get(
      `${BASE_URL}/api/admin/notifications/stats`,
      {
        headers: { Authorization: `Bearer ${adminToken}` },
      }
    );

    if (response.data.success) {
      const stats = response.data.stats;
      console.log("   ✅ Notification statistics retrieved");
      console.log(
        `   📊 Total: ${stats.total} | Sent: ${stats.sent} | Pending: ${stats.pending} | Failed: ${stats.failed}`
      );
      console.log(
        `   📱 WhatsApp: ${stats.whatsapp} | SMS: ${stats.sms} | Email: ${stats.email}`
      );
    } else {
      throw new Error("Failed to get notification statistics");
    }
  } catch (error) {
    throw new Error(
      `Statistics check failed: ${error.response?.data?.error || error.message}`
    );
  }
}

// Run the tests
if (require.main === module) {
  console.log(`🔗 Testing against: ${BASE_URL}`);
  console.log(`👤 Test user ID: ${TEST_CONFIG.testUserId}`);
  console.log(`📱 Test phone: ${TEST_CONFIG.testPhoneNumber}`);
  console.log(
    `\n⚠️  Make sure to update TEST_CONFIG with valid values before running!`
  );
  console.log(`\n🚀 Starting tests...\n`);

  testNotificationSystem().catch(console.error);
}

module.exports = { testNotificationSystem };
