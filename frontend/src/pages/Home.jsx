import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  MessageCircle,
  Shield,
  Bell,
  Users,
  Heart,
  Smartphone,
  Globe,
  CheckCircle,
  ArrowRight,
  Activity,
  TrendingUp,
  AlertTriangle,
  MapPin,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";

const Home = () => {
  // Sample data for visualizations
  const vaccinationData = [
    { name: "BCG", completed: 95, pending: 5 },
    { name: "Polio", completed: 88, pending: 12 },
    { name: "DPT", completed: 82, pending: 18 },
    { name: "Measles", completed: 90, pending: 10 },
    { name: "Hepatitis B", completed: 85, pending: 15 },
  ];

  const outbreakData = [
    { name: "Jan", cases: 45 },
    { name: "Feb", cases: 38 },
    { name: "Mar", cases: 52 },
    { name: "Apr", cases: 67 },
    { name: "May", cases: 43 },
    { name: "Jun", cases: 29 },
  ];

  const languageData = [
    { name: "English", value: 60, color: "#1E90FF" },
    { name: "Hindi", value: 35, color: "#38A169" },
    { name: "Other", value: 5, color: "#FF6B6B" },
  ];

  const features = [
    {
      icon: MessageCircle,
      title: "AI Chatbot",
      description: "Multilingual AI assistant for health queries and guidance",
      color: "from-blue-500 to-blue-600",
    },
    {
      icon: Bell,
      title: "Vaccination Reminders",
      description: "Automated reminders for your child's vaccination schedule",
      color: "from-green-500 to-green-600",
    },
    {
      icon: AlertTriangle,
      title: "Outbreak Alerts",
      description: "Real-time alerts about disease outbreaks in your area",
      color: "from-red-500 to-red-600",
    },
    {
      icon: Smartphone,
      title: "WhatsApp & SMS",
      description: "Receive notifications through your preferred channel",
      color: "from-purple-500 to-purple-600",
    },
    {
      icon: Globe,
      title: "Multilingual Support",
      description: "Available in English, Hindi, and other regional languages",
      color: "from-orange-500 to-orange-600",
    },
    {
      icon: Shield,
      title: "Secure & Private",
      description:
        "Your health data is protected with enterprise-grade security",
      color: "from-indigo-500 to-indigo-600",
    },
  ];

  const stats = [
    { label: "Active Users", value: "10,000+", icon: Users },
    { label: "Messages Sent", value: "50,000+", icon: MessageCircle },
    { label: "Reminders Sent", value: "25,000+", icon: Bell },
    { label: "Alerts Delivered", value: "5,000+", icon: AlertTriangle },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary via-blue-600 to-secondary py-12 sm:py-16 lg:py-20 overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="text-white text-center lg:text-left"
            >
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 leading-tight">
                AI-Powered
                <span className="block text-yellow-300">NivritAI</span>
                <span className="block">Assistant</span>
              </h1>
              <p className="text-lg sm:text-xl mb-6 sm:mb-8 text-blue-100 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                Get instant health guidance, vaccination reminders, and outbreak
                alerts through WhatsApp and SMS. Available in multiple
                languages.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start">
                <Link
                  to="/chatbot"
                  className="inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 bg-white text-primary font-semibold rounded-xl hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg text-sm sm:text-base"
                >
                  <MessageCircle className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                  Start Chatting
                  <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                </Link>
                <Link
                  to="/centers"
                  className="inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 transition-all duration-300 transform hover:scale-105 text-sm sm:text-base"
                >
                  <MapPin className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                  Find Centers
                </Link>
                <Link
                  to="/register"
                  className="inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 bg-transparent border-2 border-white text-white font-semibold rounded-xl hover:bg-white hover:text-primary transition-all duration-300 transform hover:scale-105 text-sm sm:text-base"
                >
                  <Users className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                  Register Now
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative mt-8 lg:mt-0"
            >
              <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-2xl">
                <div className="text-center mb-4 sm:mb-6">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                    <MessageCircle className="h-8 w-8 sm:h-10 sm:w-10 text-white" />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">
                    Live Demo
                  </h3>
                  <p className="text-blue-100 text-sm sm:text-base">
                    Try our AI chatbot now
                  </p>
                </div>

                {/* Mini chat preview */}
                <div className="space-y-2 sm:space-y-3">
                  <div className="flex justify-end">
                    <div className="bg-white text-primary px-3 sm:px-4 py-2 rounded-2xl rounded-br-sm max-w-[85%] sm:max-w-xs">
                      <p className="text-xs sm:text-sm">
                        Polio ka tika kab lagega?
                      </p>
                    </div>
                  </div>
                  <div className="flex justify-start">
                    <div className="bg-white bg-opacity-20 text-white px-3 sm:px-4 py-2 rounded-2xl rounded-bl-sm max-w-[85%] sm:max-w-xs">
                      <p className="text-xs sm:text-sm">
                        पोलियो का टीका 6, 10, 14 सप्ताह और 16-24 महीने में लगाया
                        जाता है।
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating elements */}
              <div className="absolute -top-4 -right-4 w-8 h-8 bg-yellow-400 rounded-full animate-bounce"></div>
              <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-green-400 rounded-full animate-pulse"></div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 sm:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                    <Icon className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                  </div>
                  <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-1 sm:mb-2">
                    {stat.value}
                  </h3>
                  <p className="text-gray-600 text-sm sm:text-base">
                    {stat.label}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12 sm:mb-16"
          >
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
              Why Choose Our Platform?
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto px-4">
              We combine cutting-edge AI technology with health expertise to
              provide personalized, multilingual health assistance.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
                >
                  <div
                    className={`w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center mb-4 sm:mb-6`}
                  >
                    <Icon className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
                    {feature.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Analytics Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Real-time Analytics
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Track vaccination coverage, monitor outbreak trends, and analyze
              user engagement.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Vaccination Coverage Chart */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="bg-white rounded-2xl p-8 shadow-lg"
            >
              <h3 className="text-2xl font-semibold text-gray-900 mb-6">
                Vaccination Coverage
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={vaccinationData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="completed" fill="#38A169" name="Completed" />
                  <Bar dataKey="pending" fill="#FF6B6B" name="Pending" />
                </BarChart>
              </ResponsiveContainer>
            </motion.div>

            {/* Language Distribution */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="bg-white rounded-2xl p-8 shadow-lg"
            >
              <h3 className="text-2xl font-semibold text-gray-900 mb-6">
                Language Distribution
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={languageData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {languageData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </motion.div>

            {/* Outbreak Trends */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="lg:col-span-2 bg-white rounded-2xl p-8 shadow-lg"
            >
              <h3 className="text-2xl font-semibold text-gray-900 mb-6">
                Outbreak Trends
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={outbreakData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="cases"
                    stroke="#FF6B6B"
                    strokeWidth={3}
                  />
                </LineChart>
              </ResponsiveContainer>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-secondary">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl font-bold text-white mb-6">
              Ready to Transform Health?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Join thousands of families who trust our AI-powered health
              platform for their vaccination and health needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register"
                className="inline-flex items-center px-8 py-4 bg-white text-primary font-semibold rounded-xl hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                <Users className="mr-2 h-5 w-5" />
                Get Started Free
              </Link>
              <Link
                to="/chatbot"
                className="inline-flex items-center px-8 py-4 bg-transparent border-2 border-white text-white font-semibold rounded-xl hover:bg-white hover:text-primary transition-all duration-300 transform hover:scale-105"
              >
                <MessageCircle className="mr-2 h-5 w-5" />
                Try Demo
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;
