import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  User,
  Phone,
  Calendar,
  MapPin,
  CheckCircle,
  AlertCircle,
  Heart,
  Shield,
  Bell,
  MessageCircle,
  Mail,
} from "lucide-react";
import toast from "react-hot-toast";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    childDOB: "",
    district: "",
    email: "",
    language: "en",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const districts = [
    "Lucknow",
    "Kanpur",
    "Agra",
    "Varanasi",
    "Meerut",
    "Allahabad",
    "Bareilly",
    "Ghaziabad",
    "Moradabad",
    "Saharanpur",
    "Gorakhpur",
    "Firozabad",
    "Jhansi",
    "Muzaffarnagar",
    "Mathura",
    "Shahjahanpur",
    "Rampur",
    "Aligarh",
    "Etawah",
    "Sambhal",
    "Amroha",
    "Hardoi",
    "Fatehpur",
    "Raebareli",
    "Orai",
    "Sitapur",
    "Modinagar",
    "Unnao",
    "Jaunpur",
    "Lakhimpur",
    "Hathras",
    "Banda",
    "Pilibhit",
    "Barabanki",
    "Khurja",
    "Gonda",
    "Mainpuri",
    "Lalitpur",
    "Etah",
    "Deoria",
    "Ujhani",
    "Ghazipur",
    "Sultanpur",
    "Azamgarh",
    "Bijnor",
    "Sahaswan",
    "Najibabad",
    "Shikohabad",
    "Sikandrabad",
    "Saharanpur",
    "Tilhar",
    "Najafgarh",
    "Shamli",
    "Awagarh",
    "Kasganj",
    "Aonla",
    "Malihabad",
    "Safipur",
    "Shishgarh",
    "Sikandra Rao",
    "Tundla",
    "Pukhrayan",
    "Pilibhit",
    "Purquazi",
    "Shamli",
    "Thana Bhawan",
    "Bighapur",
    "Nawabganj",
    "Amoda",
    "Zamania",
    "Mundali",
    "Naraura",
    "Samthar",
    "Sakit",
    "Sahaspur",
    "Reoti",
    "Sikanderpur",
    "Tundla",
    "Rampur Maniharan",
    "Gangoh",
    "Bachhraon",
    "Dadri",
    "Modinagar",
    "Hapur",
    "Garhmukteshwar",
    "Tundla",
    "Jewar",
    "Sikandrabad",
    "Bulandshahr",
    "Khurja",
    "Anupshahr",
    "Debai",
    "Shikarpur",
    "Sambhal",
    "Chandausi",
    "Nakur",
    "Seohara",
    "Siana",
    "Sahaswan",
    "Bisauli",
    "Ujhani",
    "Dibai",
    "Shahjahanpur",
    "Tilhar",
    "Powayan",
    "Khutar",
    "Jaitpur",
    "Nighasan",
    "Kheri",
    "Tikunia",
    "Palia",
    "Mailani",
    "Nighasan",
    "Gola Gokarannath",
    "Mohammadi",
    "Maholi",
    "Sitapur",
    "Laharpur",
    "Biswan",
    "Mahmudabad",
    "Sidhauli",
    "Misrikh",
    "Hargaon",
    "Rampur",
    "Tanda",
    "Bilaspur",
    "Rudrapur",
    "Khatima",
    "Sitarganj",
    "Kichha",
    "Dineshpur",
    "Bazpur",
    "Kashipur",
    "Ramnagar",
    "Rudrapur",
    "Kichha",
    "Sitarganj",
    "Khatima",
    "Dineshpur",
    "Bazpur",
    "Kashipur",
    "Ramnagar",
    "Rudrapur",
    "Kichha",
    "Sitarganj",
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^[6-9]\d{9}$/.test(formData.phone)) {
      newErrors.phone = "Please enter a valid 10-digit phone number";
    }

    if (!formData.childDOB) {
      newErrors.childDOB = "Child's date of birth is required";
    } else {
      const dob = new Date(formData.childDOB);
      const today = new Date();
      if (dob > today) {
        newErrors.childDOB = "Date of birth cannot be in the future";
      }
    }

    if (!formData.district) {
      newErrors.district = "District is required";
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix the errors in the form");
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Simulate success
      setIsSuccess(true);
      toast.success(
        "Registration successful! You will now receive vaccine reminders."
      );

      // Reset form after success
      setTimeout(() => {
        setFormData({
          name: "",
          phone: "",
          childDOB: "",
          district: "",
          email: "",
          language: "en",
        });
        setIsSuccess(false);
      }, 3000);
    } catch (error) {
      toast.error("Registration failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center py-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-3xl shadow-2xl p-12 text-center max-w-md mx-4"
        >
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="h-12 w-12 text-green-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Registration Successful!
          </h2>
          <p className="text-gray-600 mb-6">
            You will now receive personalized vaccination reminders and health
            alerts.
          </p>
          <div className="space-y-3">
            <div className="flex items-center justify-center space-x-2 text-green-600">
              <Bell className="h-5 w-5" />
              <span className="text-sm">Vaccination reminders enabled</span>
            </div>
            <div className="flex items-center justify-center space-x-2 text-blue-600">
              <MessageCircle className="h-5 w-5" />
              <span className="text-sm">
                WhatsApp & SMS notifications active
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 sm:py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8 sm:mb-12"
        >
          <div className="flex flex-col sm:flex-row items-center justify-center mb-6">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-primary to-secondary rounded-2xl flex items-center justify-center mb-3 sm:mb-0 sm:mr-4">
              <User className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
            </div>
            <div className="text-center sm:text-left">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">
                Register for Health Alerts
              </h1>
              <p className="text-base sm:text-lg text-gray-600">
                Get personalized vaccination reminders and outbreak alerts
              </p>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Benefits Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-1 order-2 lg:order-1"
          >
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 mb-4 sm:mb-6">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center">
                <Heart className="h-5 w-5 sm:h-6 sm:w-6 mr-2 text-red-500" />
                Why Register?
              </h3>
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-start space-x-2 sm:space-x-3">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Bell className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 text-sm sm:text-base">
                      Vaccination Reminders
                    </h4>
                    <p className="text-xs sm:text-sm text-gray-600">
                      Never miss important vaccination dates
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-2 sm:space-x-3">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MessageCircle className="h-3 w-3 sm:h-4 sm:w-4 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 text-sm sm:text-base">
                      WhatsApp & SMS
                    </h4>
                    <p className="text-xs sm:text-sm text-gray-600">
                      Receive alerts on your preferred channel
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-2 sm:space-x-3">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Shield className="h-3 w-3 sm:h-4 sm:w-4 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 text-sm sm:text-base">
                      Outbreak Alerts
                    </h4>
                    <p className="text-xs sm:text-sm text-gray-600">
                      Stay informed about disease outbreaks in your area
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Privacy Notice */}
            <div className="bg-gray-50 rounded-xl sm:rounded-2xl p-4 sm:p-6">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 sm:mb-3 flex items-center">
                <Shield className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-gray-600" />
                Privacy & Security
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                Your personal information is encrypted and stored securely. We
                only use your data to send relevant health reminders and alerts.
                You can unsubscribe at any time.
              </p>
            </div>
          </motion.div>

          {/* Registration Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="lg:col-span-2 order-1 lg:order-2"
          >
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-6 sm:p-8">
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4 sm:mb-6">
                Registration Form
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Parent/Guardian Name *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                        errors.name ? "border-red-500" : "border-gray-300"
                      }`}
                      placeholder="Enter your full name"
                    />
                  </div>
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.name}
                    </p>
                  )}
                </div>

                {/* Phone Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                        errors.phone ? "border-red-500" : "border-gray-300"
                      }`}
                      placeholder="Enter 10-digit phone number"
                    />
                  </div>
                  {errors.phone && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.phone}
                    </p>
                  )}
                </div>

                {/* Email Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address (Optional)
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                        errors.email ? "border-red-500" : "border-gray-300"
                      }`}
                      placeholder="Enter email address"
                    />
                  </div>
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.email}
                    </p>
                  )}
                </div>

                {/* Child DOB Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Child's Date of Birth *
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="date"
                      name="childDOB"
                      value={formData.childDOB}
                      onChange={handleInputChange}
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                        errors.childDOB ? "border-red-500" : "border-gray-300"
                      }`}
                    />
                  </div>
                  {errors.childDOB && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.childDOB}
                    </p>
                  )}
                </div>

                {/* District Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    District *
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <select
                      name="district"
                      value={formData.district}
                      onChange={handleInputChange}
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                        errors.district ? "border-red-500" : "border-gray-300"
                      }`}
                    >
                      <option value="">Select your district</option>
                      {districts.map((district) => (
                        <option key={district} value={district}>
                          {district}
                        </option>
                      ))}
                    </select>
                  </div>
                  {errors.district && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.district}
                    </p>
                  )}
                </div>

                {/* Language Preference */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Preferred Language
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <label className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                      <input
                        type="radio"
                        name="language"
                        value="en"
                        checked={formData.language === "en"}
                        onChange={handleInputChange}
                        className="text-primary focus:ring-primary"
                      />
                      <span>English</span>
                    </label>
                    <label className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                      <input
                        type="radio"
                        name="language"
                        value="hi"
                        checked={formData.language === "hi"}
                        onChange={handleInputChange}
                        className="text-primary focus:ring-primary"
                      />
                      <span>हिन्दी</span>
                    </label>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-primary to-secondary text-white py-4 px-6 rounded-lg font-semibold text-lg hover:from-blue-600 hover:to-green-600 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Registering...
                    </div>
                  ) : (
                    "Register for Health Alerts"
                  )}
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Register;
