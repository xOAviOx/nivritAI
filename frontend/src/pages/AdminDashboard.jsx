import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Users,
  MessageCircle,
  Bell,
  AlertTriangle,
  TrendingUp,
  Activity,
  Send,
  Download,
  RefreshCw,
  Eye,
  Filter,
  Search,
  Calendar,
  MapPin,
  Phone,
  Mail,
  Shield,
  BarChart3,
  PieChart,
  LineChart,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  LineChart as RechartsLineChart,
  Line,
  AreaChart,
  Area,
} from "recharts";
import toast from "react-hot-toast";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDistrict, setFilterDistrict] = useState("all");

  // Sample data - in real app, this would come from API
  const [users] = useState([
    {
      id: 1,
      name: "Rajesh Kumar",
      phone: "9876543210",
      email: "rajesh@email.com",
      childDOB: "2020-05-15",
      district: "Lucknow",
      language: "hi",
      registeredAt: "2024-01-15",
    },
    {
      id: 2,
      name: "Priya Sharma",
      phone: "9876543211",
      email: "priya@email.com",
      childDOB: "2019-08-22",
      district: "Kanpur",
      language: "en",
      registeredAt: "2024-01-16",
    },
    {
      id: 3,
      name: "Amit Singh",
      phone: "9876543212",
      email: "amit@email.com",
      childDOB: "2021-03-10",
      district: "Agra",
      language: "hi",
      registeredAt: "2024-01-17",
    },
    {
      id: 4,
      name: "Sunita Devi",
      phone: "9876543213",
      email: "sunita@email.com",
      childDOB: "2020-11-05",
      district: "Varanasi",
      language: "hi",
      registeredAt: "2024-01-18",
    },
    {
      id: 5,
      name: "Vikram Patel",
      phone: "9876543214",
      email: "vikram@email.com",
      childDOB: "2019-12-18",
      district: "Meerut",
      language: "en",
      registeredAt: "2024-01-19",
    },
  ]);

  const [reminders] = useState([
    {
      id: 1,
      user: "Rajesh Kumar",
      vaccine: "Polio-3",
      dueDate: "2024-02-15",
      status: "sent",
      method: "WhatsApp",
    },
    {
      id: 2,
      user: "Priya Sharma",
      vaccine: "Measles",
      dueDate: "2024-02-20",
      status: "pending",
      method: "SMS",
    },
    {
      id: 3,
      user: "Amit Singh",
      vaccine: "BCG",
      dueDate: "2024-02-25",
      status: "sent",
      method: "WhatsApp",
    },
  ]);

  const [alerts] = useState([
    {
      id: 1,
      disease: "Dengue",
      district: "Lucknow",
      date: "2024-02-10",
      severity: "high",
      status: "active",
    },
    {
      id: 2,
      disease: "Malaria",
      district: "Kanpur",
      date: "2024-02-12",
      severity: "medium",
      status: "active",
    },
    {
      id: 3,
      disease: "Chikungunya",
      district: "Agra",
      date: "2024-02-14",
      severity: "low",
      status: "resolved",
    },
  ]);

  // Chart data
  const userGrowthData = [
    { month: "Jan", users: 120, reminders: 45, alerts: 8 },
    { month: "Feb", users: 180, reminders: 67, alerts: 12 },
    { month: "Mar", users: 250, reminders: 89, alerts: 15 },
    { month: "Apr", users: 320, reminders: 112, alerts: 18 },
    { month: "May", users: 400, reminders: 145, alerts: 22 },
    { month: "Jun", users: 480, reminders: 178, alerts: 25 },
  ];

  const vaccineCoverageData = [
    { name: "BCG", completed: 95, pending: 5 },
    { name: "Polio", completed: 88, pending: 12 },
    { name: "DPT", completed: 82, pending: 18 },
    { name: "Measles", completed: 90, pending: 10 },
    { name: "Hepatitis B", completed: 85, pending: 15 },
  ];

  const languageDistributionData = [
    { name: "English", value: 60, color: "#1E90FF" },
    { name: "Hindi", value: 35, color: "#38A169" },
    { name: "Other", value: 5, color: "#FF6B6B" },
  ];

  const districtData = [
    { name: "Lucknow", users: 45, alerts: 3 },
    { name: "Kanpur", users: 38, alerts: 2 },
    { name: "Agra", users: 32, alerts: 1 },
    { name: "Varanasi", users: 28, alerts: 2 },
    { name: "Meerut", users: 25, alerts: 1 },
  ];

  const stats = [
    {
      label: "Total Users",
      value: users.length,
      icon: Users,
      color: "blue",
      change: "+12%",
    },
    {
      label: "Messages Sent",
      value: "2,450",
      icon: MessageCircle,
      color: "green",
      change: "+8%",
    },
    {
      label: "Reminders Sent",
      value: "1,230",
      icon: Bell,
      color: "purple",
      change: "+15%",
    },
    {
      label: "Active Alerts",
      value: alerts.filter((a) => a.status === "active").length,
      icon: AlertTriangle,
      color: "red",
      change: "-5%",
    },
  ];

  const handleTriggerReminders = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));
      toast.success("Vaccination reminders sent successfully!");
    } catch (error) {
      toast.error("Failed to send reminders");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendAlerts = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));
      toast.success("Outbreak alerts sent successfully!");
    } catch (error) {
      toast.error("Failed to send alerts");
    } finally {
      setIsLoading(false);
    }
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone.includes(searchTerm) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDistrict =
      filterDistrict === "all" || user.district === filterDistrict;
    return matchesSearch && matchesDistrict;
  });

  const tabs = [
    { id: "overview", name: "Overview", icon: BarChart3 },
    { id: "users", name: "Users", icon: Users },
    { id: "reminders", name: "Reminders", icon: Bell },
    { id: "alerts", name: "Alerts", icon: AlertTriangle },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-4 sm:py-6 gap-4 sm:gap-0">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Admin Dashboard
              </h1>
              <p className="text-gray-600 text-sm sm:text-base">
                Manage users, reminders, and alerts
              </p>
            </div>
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
              <button className="px-3 sm:px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center text-sm sm:text-base">
                <Download className="h-4 w-4 mr-2" />
                Export
              </button>
              <button className="px-3 sm:px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center text-sm sm:text-base">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg"
              >
                <div className="flex items-center justify-between">
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">
                      {stat.label}
                    </p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
                      {stat.value}
                    </p>
                    <p
                      className={`text-xs sm:text-sm ${
                        stat.change.startsWith("+")
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {stat.change} from last month
                    </p>
                  </div>
                  <div
                    className={`w-8 h-8 sm:w-12 sm:h-12 bg-${stat.color}-100 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0`}
                  >
                    <Icon
                      className={`h-4 w-4 sm:h-6 sm:w-6 text-${stat.color}-600`}
                    />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg mb-6 sm:mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex overflow-x-auto space-x-4 sm:space-x-8 px-4 sm:px-6">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-3 sm:py-4 px-1 border-b-2 font-medium text-xs sm:text-sm flex items-center space-x-1 sm:space-x-2 whitespace-nowrap ${
                      activeTab === tab.id
                        ? "border-primary text-primary"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    <Icon className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span>{tab.name}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="p-6">
            {/* Overview Tab */}
            {activeTab === "overview" && (
              <div className="space-y-8">
                {/* Charts Row 1 */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="bg-gray-50 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      User Growth
                    </h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <AreaChart data={userGrowthData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Area
                          type="monotone"
                          dataKey="users"
                          stackId="1"
                          stroke="#1E90FF"
                          fill="#1E90FF"
                          fillOpacity={0.6}
                        />
                        <Area
                          type="monotone"
                          dataKey="reminders"
                          stackId="2"
                          stroke="#38A169"
                          fill="#38A169"
                          fillOpacity={0.6}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Language Distribution
                    </h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <RechartsPieChart>
                        <Pie
                          data={languageDistributionData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={100}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {languageDistributionData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </RechartsPieChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Charts Row 2 */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="bg-gray-50 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Vaccination Coverage
                    </h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={vaccineCoverageData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar
                          dataKey="completed"
                          fill="#38A169"
                          name="Completed"
                        />
                        <Bar dataKey="pending" fill="#FF6B6B" name="Pending" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      District-wise Users
                    </h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={districtData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="users" fill="#1E90FF" name="Users" />
                        <Bar dataKey="alerts" fill="#FF6B6B" name="Alerts" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-semibold mb-2">
                          Trigger Reminders
                        </h3>
                        <p className="text-green-100 mb-4">
                          Send vaccination reminders to all registered users
                        </p>
                        <button
                          onClick={handleTriggerReminders}
                          disabled={isLoading}
                          className="bg-white text-green-600 px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors disabled:opacity-50"
                        >
                          {isLoading ? "Sending..." : "Send Reminders"}
                        </button>
                      </div>
                      <Bell className="h-12 w-12 text-green-200" />
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-xl p-6 text-white">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-semibold mb-2">
                          Send Alerts
                        </h3>
                        <p className="text-red-100 mb-4">
                          Send outbreak alerts to affected districts
                        </p>
                        <button
                          onClick={handleSendAlerts}
                          disabled={isLoading}
                          className="bg-white text-red-600 px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors disabled:opacity-50"
                        >
                          {isLoading ? "Sending..." : "Send Alerts"}
                        </button>
                      </div>
                      <AlertTriangle className="h-12 w-12 text-red-200" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Users Tab */}
            {activeTab === "users" && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Registered Users
                  </h3>
                  <div className="flex space-x-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search users..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>
                    <select
                      value={filterDistrict}
                      onChange={(e) => setFilterDistrict(e.target.value)}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    >
                      <option value="all">All Districts</option>
                      {[...new Set(users.map((u) => u.district))].map(
                        (district) => (
                          <option key={district} value={district}>
                            {district}
                          </option>
                        )
                      )}
                    </select>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          User
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Contact
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Child DOB
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          District
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Language
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredUsers.map((user) => (
                        <tr key={user.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                                <span className="text-white font-semibold text-sm">
                                  {user.name
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                                </span>
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">
                                  {user.name}
                                </div>
                                <div className="text-sm text-gray-500">
                                  ID: {user.id}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {user.phone}
                            </div>
                            <div className="text-sm text-gray-500">
                              {user.email}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {new Date(user.childDOB).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              <MapPin className="h-3 w-3 mr-1" />
                              {user.district}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                user.language === "hi"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-blue-100 text-blue-800"
                              }`}
                            >
                              {user.language === "hi" ? "हिन्दी" : "English"}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button className="text-primary hover:text-blue-600 mr-3">
                              <Eye className="h-4 w-4" />
                            </button>
                            <button className="text-green-600 hover:text-green-800">
                              <MessageCircle className="h-4 w-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Reminders Tab */}
            {activeTab === "reminders" && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Vaccination Reminders
                  </h3>
                  <button
                    onClick={handleTriggerReminders}
                    disabled={isLoading}
                    className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 flex items-center"
                  >
                    <Send className="h-4 w-4 mr-2" />
                    {isLoading ? "Sending..." : "Send All Reminders"}
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          User
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Vaccine
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Due Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Method
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {reminders.map((reminder) => (
                        <tr key={reminder.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {reminder.user}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {reminder.vaccine}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {new Date(reminder.dueDate).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                reminder.status === "sent"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-yellow-100 text-yellow-800"
                              }`}
                            >
                              {reminder.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {reminder.method}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button className="text-primary hover:text-blue-600 mr-3">
                              <Send className="h-4 w-4" />
                            </button>
                            <button className="text-green-600 hover:text-green-800">
                              <Bell className="h-4 w-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Alerts Tab */}
            {activeTab === "alerts" && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Outbreak Alerts
                  </h3>
                  <button
                    onClick={handleSendAlerts}
                    disabled={isLoading}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center"
                  >
                    <AlertTriangle className="h-4 w-4 mr-2" />
                    {isLoading ? "Sending..." : "Send All Alerts"}
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Disease
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          District
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Severity
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {alerts.map((alert) => (
                        <tr key={alert.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {alert.disease}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              <MapPin className="h-3 w-3 mr-1" />
                              {alert.district}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {new Date(alert.date).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                alert.severity === "high"
                                  ? "bg-red-100 text-red-800"
                                  : alert.severity === "medium"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-green-100 text-green-800"
                              }`}
                            >
                              {alert.severity}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                alert.status === "active"
                                  ? "bg-red-100 text-red-800"
                                  : "bg-green-100 text-green-800"
                              }`}
                            >
                              {alert.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button className="text-primary hover:text-blue-600 mr-3">
                              <Eye className="h-4 w-4" />
                            </button>
                            <button className="text-red-600 hover:text-red-800">
                              <AlertTriangle className="h-4 w-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
