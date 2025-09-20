import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
  Users,
  Bell,
  Send,
  UserPlus,
  MessageSquare,
  Mail,
  Smartphone,
  AlertTriangle,
  Heart,
  Calendar,
  Search,
  XCircle,
} from "lucide-react";
import toast from "react-hot-toast";
import authService from "../services/authService";
import notificationService from "../services/notificationService";
import axios from "axios";

const AdminPanel = ({ admin, onLogout }) => {
  const [users, setUsers] = useState([]);
  // const [templates, setTemplates] = useState([]); // Temporarily disabled
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");

  // Notification form state
  const [notificationForm, setNotificationForm] = useState({
    type: "health_tip",
    title: "",
    message: "",
    delivery_method: "whatsapp",
    scheduled_at: "",
    useTemplate: false,
    templateId: "",
  });

  const baseURL = process.env.REACT_APP_API_URL || "http://localhost:5002/api";

  const getAuthHeaders = useCallback(
    () => ({
      Authorization: `Bearer ${authService.getToken()}`,
      "Content-Type": "application/json",
    }),
    []
  );

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${baseURL}/admin/users?page=1&limit=50`,
        {
          headers: getAuthHeaders(),
        }
      );

      if (response.data.success) {
        setUsers(response.data.users);
      }
    } catch (error) {
      toast.error("Failed to fetch users");
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  }, [baseURL, getAuthHeaders]);

  // const fetchTemplates = useCallback(async () => {
  //   try {
  //     const response = await axios.get(`${baseURL}/admin/templates`, {
  //       headers: getAuthHeaders(),
  //     });

  //     if (response.data.success) {
  //       setTemplates(response.data.templates);
  //     }
  //   } catch (error) {
  //     console.error("Error fetching templates:", error);
  //   }
  // }, [baseURL, getAuthHeaders]);

  useEffect(() => {
    fetchUsers();
    // fetchTemplates(); // Temporarily disabled
  }, [fetchUsers]);

  const handleSendNotification = async () => {
    if (!selectedUsers.length) {
      toast.error("Please select at least one user");
      return;
    }

    if (!notificationForm.title || !notificationForm.message) {
      toast.error("Please fill in title and message");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(
        `${baseURL}/admin/notifications/send`,
        {
          user_ids: selectedUsers,
          type: notificationForm.type,
          title: notificationForm.title,
          message: notificationForm.message,
          delivery_method: notificationForm.delivery_method,
          scheduled_at: notificationForm.scheduled_at || null,
        },
        {
          headers: getAuthHeaders(),
        }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        setNotificationForm({
          type: "health_tip",
          title: "",
          message: "",
          delivery_method: "whatsapp",
          scheduled_at: "",
          useTemplate: false,
          templateId: "",
        });
        setSelectedUsers([]);
      } else {
        toast.error("Failed to send notification");
      }
    } catch (error) {
      toast.error("Failed to send notification");
      console.error("Error sending notification:", error);
    } finally {
      setLoading(false);
    }
  };

  // Send demo notifications with dummy data
  const handleSendDemoNotifications = async () => {
    try {
      setLoading(true);
      toast.loading("Sending demo notifications...", {
        id: "demo-notifications",
      });

      const result = await notificationService.sendSampleNotifications();

      if (result.success) {
        toast.success(
          `Demo notifications sent! ${result.results.length} types of notifications sent to all users.`,
          { id: "demo-notifications" }
        );
      } else {
        toast.error(result.error || "Failed to send demo notifications", {
          id: "demo-notifications",
        });
      }
    } catch (error) {
      toast.error("Failed to send demo notifications", {
        id: "demo-notifications",
      });
      console.error("Error sending demo notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  // Send notification with dummy data to selected users
  const handleSendDummyNotification = async () => {
    if (!selectedUsers.length) {
      toast.error("Please select at least one user");
      return;
    }

    try {
      setLoading(true);
      toast.loading("Sending notification with dummy data...", {
        id: "dummy-notification",
      });

      const result = await notificationService.sendNotificationWithDummyData(
        selectedUsers,
        notificationForm.type,
        notificationForm.message || null
      );

      if (result.success) {
        toast.success(`Notification sent to ${selectedUsers.length} users!`, {
          id: "dummy-notification",
        });
        setSelectedUsers([]);
        setNotificationForm((prev) => ({
          ...prev,
          title: "",
          message: "",
        }));
      } else {
        toast.error(result.error || "Failed to send notification", {
          id: "dummy-notification",
        });
      }
    } catch (error) {
      toast.error("Failed to send notification", { id: "dummy-notification" });
      console.error("Error sending dummy notification:", error);
    } finally {
      setLoading(false);
    }
  };

  // Send notification to all users
  const handleSendToAllUsers = async () => {
    if (users.length === 0) {
      toast.error("No users found to send notifications to");
      return;
    }

    try {
      setLoading(true);
      toast.loading("Sending notification to all users...", {
        id: "send-all-users",
      });

      const result = await notificationService.sendNotificationWithDummyData(
        users.map((user) => user.id),
        notificationForm.type,
        notificationForm.message || null
      );

      if (result.success) {
        toast.success(`Notification sent to all ${users.length} users!`, {
          id: "send-all-users",
        });
        setNotificationForm((prev) => ({
          ...prev,
          title: "",
          message: "",
        }));
      } else {
        toast.error(result.error || "Failed to send notification", {
          id: "send-all-users",
        });
      }
    } catch (error) {
      toast.error("Failed to send notification", { id: "send-all-users" });
      console.error("Error sending to all users:", error);
    } finally {
      setLoading(false);
    }
  };

  // Send quick message to all users
  const handleQuickMessage = () => {
    const message = prompt("Enter your message to send to all users:");
    if (message && message.trim()) {
      setNotificationForm((prev) => ({
        ...prev,
        type: "health_tip",
        title: "Quick Message from Admin",
        message: message.trim(),
      }));

      // Auto-send the message
      setTimeout(() => {
        handleSendToAllUsers();
      }, 100);
    }
  };

  // Manually trigger notification processing
  const handleProcessNotifications = async () => {
    try {
      setLoading(true);
      toast.loading("Processing pending notifications...", {
        id: "process-notifications",
      });

      const response = await axios.post(
        `${baseURL}/admin/notifications/process`,
        {},
        {
          headers: getAuthHeaders(),
        }
      );

      if (response.data.success) {
        toast.success("Notifications processed successfully!", {
          id: "process-notifications",
        });
      } else {
        toast.error(response.data.error || "Failed to process notifications", {
          id: "process-notifications",
        });
      }
    } catch (error) {
      toast.error("Failed to process notifications", {
        id: "process-notifications",
      });
      console.error("Error processing notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  // const handleTemplateSelect = (templateId) => {
  //   const template = templates.find((t) => t.id === templateId);
  //   if (template) {
  //     setNotificationForm((prev) => ({
  //       ...prev,
  //       type: template.type,
  //       title: template.title,
  //       message: template.message_template,
  //       templateId: template.id,
  //     }));
  //   }
  // };

  const handleUserSelect = (userId) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const selectAllUsers = () => {
    setSelectedUsers(filteredUsers.map((user) => user.id));
  };

  const clearSelection = () => {
    setSelectedUsers([]);
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.mobile_number.includes(searchTerm) ||
      (user.email &&
        user.email.toLowerCase().includes(searchTerm.toLowerCase()));

    if (filterType === "all") return matchesSearch;
    if (filterType === "whatsapp")
      return matchesSearch && user.notification_preferences?.whatsapp_enabled;
    if (filterType === "sms")
      return matchesSearch && user.notification_preferences?.sms_enabled;
    if (filterType === "email")
      return matchesSearch && user.notification_preferences?.email_enabled;

    return matchesSearch;
  });

  const notificationTypes = [
    {
      value: "health_tip",
      label: "Health Tip",
      icon: Heart,
      color: "text-green-600",
    },
    {
      value: "vaccination_reminder",
      label: "Vaccination Reminder",
      icon: Calendar,
      color: "text-blue-600",
    },
    {
      value: "emergency_alert",
      label: "Emergency Alert",
      icon: AlertTriangle,
      color: "text-red-600",
    },
    {
      value: "appointment_reminder",
      label: "Appointment Reminder",
      icon: Calendar,
      color: "text-purple-600",
    },
  ];

  const deliveryMethods = [
    {
      value: "whatsapp",
      label: "WhatsApp",
      icon: MessageSquare,
      color: "text-green-600",
    },
    { value: "sms", label: "SMS", icon: Smartphone, color: "text-blue-600" },
    { value: "email", label: "Email", icon: Mail, color: "text-purple-600" },
  ];

  const tabs = [
    { id: "dashboard", name: "Dashboard", icon: Users },
    { id: "users", name: "Users", icon: UserPlus },
    { id: "notifications", name: "Send Notifications", icon: Send },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-4"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white rounded-2xl shadow-xl p-8 mb-6"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                <Users className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">
                  Admin Panel
                </h1>
                <p className="text-gray-600">Welcome back, {admin?.name}</p>
              </div>
            </div>
            <button
              onClick={onLogout}
              className="flex items-center space-x-2 px-4 py-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
            >
              <span>Logout</span>
            </button>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6"
        >
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Users</p>
                <p className="text-2xl font-bold text-gray-800">
                  {users.length}
                </p>
              </div>
              <Users className="w-8 h-8 text-blue-600" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">WhatsApp Enabled</p>
                <p className="text-2xl font-bold text-green-600">
                  {
                    users.filter(
                      (u) => u.notification_preferences?.whatsapp_enabled
                    ).length
                  }
                </p>
              </div>
              <MessageSquare className="w-8 h-8 text-green-600" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">SMS Enabled</p>
                <p className="text-2xl font-bold text-blue-600">
                  {
                    users.filter((u) => u.notification_preferences?.sms_enabled)
                      .length
                  }
                </p>
              </div>
              <Smartphone className="w-8 h-8 text-blue-600" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Email Enabled</p>
                <p className="text-2xl font-bold text-purple-600">
                  {
                    users.filter(
                      (u) => u.notification_preferences?.email_enabled
                    ).length
                  }
                </p>
              </div>
              <Mail className="w-8 h-8 text-purple-600" />
            </div>
          </div>
        </motion.div>

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-white rounded-2xl shadow-xl"
        >
          {/* Tabs */}
          <div className="flex border-b border-gray-200">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 flex items-center justify-center space-x-2 py-4 px-6 font-medium transition-colors ${
                    activeTab === tab.id
                      ? "text-purple-600 border-b-2 border-purple-600 bg-purple-50"
                      : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{tab.name}</span>
                </button>
              );
            })}
          </div>

          {/* Tab Content */}
          <div className="p-8">
            {activeTab === "dashboard" && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <h2 className="text-xl font-semibold text-gray-800 mb-6">
                  Quick Actions
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setActiveTab("notifications")}
                    className="p-6 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-shadow"
                  >
                    <Send className="w-8 h-8 mb-4" />
                    <h3 className="font-semibold text-lg">
                      Send Notifications
                    </h3>
                    <p className="text-green-100 text-sm mt-2">
                      Send messages to users
                    </p>
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setActiveTab("users")}
                    className="p-6 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-shadow"
                  >
                    <UserPlus className="w-8 h-8 mb-4" />
                    <h3 className="font-semibold text-lg">Manage Users</h3>
                    <p className="text-blue-100 text-sm mt-2">
                      View and manage user accounts
                    </p>
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="p-6 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-shadow"
                  >
                    <Bell className="w-8 h-8 mb-4" />
                    <h3 className="font-semibold text-lg">Templates</h3>
                    <p className="text-purple-100 text-sm mt-2">
                      Manage notification templates
                    </p>
                  </motion.button>
                </div>

                {/* Manual Notification Actions */}
                <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    📢 Manual Notification Center
                  </h3>
                  <p className="text-gray-600 text-sm mb-6">
                    Send notifications immediately to users. All notifications
                    are processed automatically by the notification system.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Quick Send Section */}
                    <div className="space-y-3">
                      <h4 className="font-medium text-gray-700">
                        Quick Send Actions
                      </h4>

                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleSendDemoNotifications}
                        disabled={loading || users.length === 0}
                        className={`w-full px-4 py-3 rounded-lg font-medium transition-colors ${
                          loading || users.length === 0
                            ? "bg-gray-400 cursor-not-allowed text-white"
                            : "bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white"
                        }`}
                      >
                        <div className="flex items-center justify-center space-x-2">
                          <Bell className="w-5 h-5" />
                          <span>Send Demo Notifications</span>
                        </div>
                      </motion.button>

                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleSendToAllUsers}
                        disabled={loading || users.length === 0}
                        className={`w-full px-4 py-3 rounded-lg font-medium transition-colors ${
                          loading || users.length === 0
                            ? "bg-gray-400 cursor-not-allowed text-white"
                            : "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white"
                        }`}
                      >
                        <div className="flex items-center justify-center space-x-2">
                          <Send className="w-5 h-5" />
                          <span>Send to All Users</span>
                        </div>
                      </motion.button>

                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleQuickMessage}
                        disabled={loading || users.length === 0}
                        className={`w-full px-4 py-3 rounded-lg font-medium transition-colors ${
                          loading || users.length === 0
                            ? "bg-gray-400 cursor-not-allowed text-white"
                            : "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
                        }`}
                      >
                        <div className="flex items-center justify-center space-x-2">
                          <MessageSquare className="w-5 h-5" />
                          <span>Send Quick Message</span>
                        </div>
                      </motion.button>

                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleProcessNotifications}
                        disabled={loading}
                        className={`w-full px-4 py-3 rounded-lg font-medium transition-colors ${
                          loading
                            ? "bg-gray-400 cursor-not-allowed text-white"
                            : "bg-gradient-to-r from-indigo-500 to-blue-500 hover:from-indigo-600 hover:to-blue-600 text-white"
                        }`}
                      >
                        <div className="flex items-center justify-center space-x-2">
                          <Bell className="w-5 h-5" />
                          <span>Process Notifications Now</span>
                        </div>
                      </motion.button>
                    </div>

                    {/* Custom Notification Section */}
                    <div className="space-y-3">
                      <h4 className="font-medium text-gray-700">
                        Custom Notifications
                      </h4>

                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          setActiveTab("notifications");
                          toast.info(
                            'Go to "Send Notifications" tab to create custom notifications for selected users'
                          );
                        }}
                        className="w-full px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-lg font-medium transition-colors"
                      >
                        <div className="flex items-center justify-center space-x-2">
                          <MessageSquare className="w-5 h-5" />
                          <span>Custom Notification</span>
                        </div>
                      </motion.button>

                      <div className="text-xs text-gray-500 bg-white p-3 rounded-lg border">
                        <p className="font-medium mb-1">💡 How it works:</p>
                        <ul className="space-y-1 text-xs">
                          <li>• Notifications are sent via WhatsApp</li>
                          <li>• Messages are processed automatically</li>
                          <li>
                            • Users receive messages in their preferred language
                          </li>
                          <li>• Failed messages are retried automatically</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {users.length === 0 && (
                    <div className="mt-4 p-3 bg-orange-100 border border-orange-300 rounded-lg">
                      <p className="text-sm text-orange-700">
                        ⚠️ <strong>No users found.</strong> Register some users
                        first to test notifications.
                      </p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {activeTab === "users" && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-800">
                    User Management
                  </h2>
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="text"
                        placeholder="Search users..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                    <select
                      value={filterType}
                      onChange={(e) => setFilterType(e.target.value)}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      <option value="all">All Users</option>
                      <option value="whatsapp">WhatsApp Enabled</option>
                      <option value="sms">SMS Enabled</option>
                      <option value="email">Email Enabled</option>
                    </select>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-600">
                      Showing {filteredUsers.length} of {users.length} users
                    </p>
                    <div className="flex space-x-2">
                      <button
                        onClick={selectAllUsers}
                        className="px-3 py-1 text-sm bg-blue-100 text-blue-600 rounded-md hover:bg-blue-200 transition-colors"
                      >
                        Select All
                      </button>
                      <button
                        onClick={clearSelection}
                        className="px-3 py-1 text-sm bg-gray-100 text-gray-600 rounded-md hover:bg-gray-200 transition-colors"
                      >
                        Clear Selection
                      </button>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  {filteredUsers.map((user) => (
                    <div
                      key={user.id}
                      className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <input
                            type="checkbox"
                            checked={selectedUsers.includes(user.id)}
                            onChange={() => handleUserSelect(user.id)}
                            className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                          />
                          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                            <span className="text-white font-medium text-sm">
                              {user.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <h3 className="font-medium text-gray-800">
                              {user.name}
                            </h3>
                            <p className="text-sm text-gray-600">
                              {user.mobile_number}
                            </p>
                            {user.email && (
                              <p className="text-sm text-gray-600">
                                {user.email}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {user.notification_preferences?.whatsapp_enabled && (
                            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                              WhatsApp
                            </span>
                          )}
                          {user.notification_preferences?.sms_enabled && (
                            <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                              SMS
                            </span>
                          )}
                          {user.notification_preferences?.email_enabled && (
                            <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
                              Email
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === "notifications" && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-800">
                    Send Notifications
                  </h2>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-500">
                      Selected: {selectedUsers.length} users
                    </span>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleSendNotification}
                      disabled={
                        loading ||
                        selectedUsers.length === 0 ||
                        !notificationForm.title ||
                        !notificationForm.message
                      }
                      className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                        loading ||
                        selectedUsers.length === 0 ||
                        !notificationForm.title ||
                        !notificationForm.message
                          ? "bg-gray-400 cursor-not-allowed text-white"
                          : "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white"
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        <Send className="w-4 h-4" />
                        <span>Send Now</span>
                      </div>
                    </motion.button>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Notification Form */}
                  <div className="space-y-6">
                    <h3 className="text-lg font-medium text-gray-700">
                      Notification Details
                    </h3>

                    {/* Type Selection */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Notification Type
                      </label>
                      <div className="grid grid-cols-2 gap-3">
                        {notificationTypes.map((type) => {
                          const Icon = type.icon;
                          return (
                            <button
                              key={type.value}
                              onClick={() =>
                                setNotificationForm((prev) => ({
                                  ...prev,
                                  type: type.value,
                                }))
                              }
                              className={`p-3 rounded-lg border-2 transition-colors ${
                                notificationForm.type === type.value
                                  ? "border-purple-500 bg-purple-50"
                                  : "border-gray-200 hover:border-gray-300"
                              }`}
                            >
                              <Icon
                                className={`w-5 h-5 ${type.color} mx-auto mb-2`}
                              />
                              <p className="text-sm font-medium text-gray-700">
                                {type.label}
                              </p>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Delivery Method */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Delivery Method
                      </label>
                      <div className="flex space-x-3">
                        {deliveryMethods.map((method) => {
                          const Icon = method.icon;
                          return (
                            <button
                              key={method.value}
                              onClick={() =>
                                setNotificationForm((prev) => ({
                                  ...prev,
                                  delivery_method: method.value,
                                }))
                              }
                              className={`flex items-center space-x-2 px-4 py-2 rounded-lg border-2 transition-colors ${
                                notificationForm.delivery_method ===
                                method.value
                                  ? "border-purple-500 bg-purple-50"
                                  : "border-gray-200 hover:border-gray-300"
                              }`}
                            >
                              <Icon className={`w-4 h-4 ${method.color}`} />
                              <span className="text-sm font-medium text-gray-700">
                                {method.label}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Title */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Title
                      </label>
                      <input
                        type="text"
                        value={notificationForm.title}
                        onChange={(e) =>
                          setNotificationForm((prev) => ({
                            ...prev,
                            title: e.target.value,
                          }))
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="Enter notification title"
                      />
                    </div>

                    {/* Message */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Message
                      </label>
                      <textarea
                        value={notificationForm.message}
                        onChange={(e) =>
                          setNotificationForm((prev) => ({
                            ...prev,
                            message: e.target.value,
                          }))
                        }
                        rows={4}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="Enter notification message"
                      />
                    </div>

                    {/* Schedule */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Schedule (Optional)
                      </label>
                      <input
                        type="datetime-local"
                        value={notificationForm.scheduled_at}
                        onChange={(e) =>
                          setNotificationForm((prev) => ({
                            ...prev,
                            scheduled_at: e.target.value,
                          }))
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>

                    {/* Send Buttons */}
                    <div className="space-y-3">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleSendNotification}
                        disabled={loading || selectedUsers.length === 0}
                        className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
                          loading || selectedUsers.length === 0
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
                        } text-white`}
                      >
                        {loading ? (
                          <div className="flex items-center justify-center">
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                            Sending...
                          </div>
                        ) : (
                          `Send to ${selectedUsers.length} users`
                        )}
                      </motion.button>

                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleSendDummyNotification}
                        disabled={loading || selectedUsers.length === 0}
                        className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
                          loading || selectedUsers.length === 0
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
                        } text-white`}
                      >
                        {loading ? (
                          <div className="flex items-center justify-center">
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                            Sending...
                          </div>
                        ) : (
                          `Send with Dummy Data (${selectedUsers.length} users)`
                        )}
                      </motion.button>
                    </div>
                  </div>

                  {/* Selected Users */}
                  <div className="space-y-6">
                    <h3 className="text-lg font-medium text-gray-700">
                      Selected Users ({selectedUsers.length})
                    </h3>

                    {selectedUsers.length > 0 ? (
                      <div className="space-y-3 max-h-96 overflow-y-auto">
                        {selectedUsers.map((userId) => {
                          const user = users.find((u) => u.id === userId);
                          return user ? (
                            <div
                              key={userId}
                              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                            >
                              <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                                  <span className="text-white font-medium text-xs">
                                    {user.name.charAt(0).toUpperCase()}
                                  </span>
                                </div>
                                <div>
                                  <p className="font-medium text-gray-800 text-sm">
                                    {user.name}
                                  </p>
                                  <p className="text-xs text-gray-600">
                                    {user.mobile_number}
                                  </p>
                                </div>
                              </div>
                              <button
                                onClick={() => handleUserSelect(userId)}
                                className="text-red-500 hover:text-red-700"
                              >
                                <XCircle className="w-4 h-4" />
                              </button>
                            </div>
                          ) : null;
                        })}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <Users className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                        <p>No users selected</p>
                        <p className="text-sm">
                          Go to Users tab to select recipients
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default AdminPanel;
