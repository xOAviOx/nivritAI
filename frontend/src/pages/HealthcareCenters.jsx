import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  MapPin,
  Phone,
  Globe,
  Search,
  Filter,
  Building2,
  Stethoscope,
  Pill,
  Calendar,
  Navigation,
  Clock,
  CheckCircle,
  AlertCircle,
  Loader2,
  Users,
} from "lucide-react";

const HealthcareCenters = () => {
  const [centers, setCenters] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchType, setSearchType] = useState("hospital");
  const [location, setLocation] = useState("");
  const [userLocation, setUserLocation] = useState(null);

  // Healthcare centers data
  const healthcareCentersData = {
    hospital: [
      {
        name: "All India Institute of Medical Sciences (AIIMS)",
        type: "hospital",
        address: "Ansari Nagar, New Delhi, Delhi 110029",
        phone: "+91-11-26588500",
        website: "https://www.aiims.edu",
        lat: 28.5665,
        lon: 77.243,
      },
      {
        name: "Apollo Hospitals",
        type: "hospital",
        address: "Sarita Vihar, New Delhi, Delhi 110076",
        phone: "+91-11-26925858",
        website: "https://www.apollohospitals.com",
        lat: 28.5355,
        lon: 77.391,
      },
      {
        name: "Fortis Healthcare",
        type: "hospital",
        address: "Sector 62, Noida, Uttar Pradesh 201301",
        phone: "+91-120-4302222",
        website: "https://www.fortishealthcare.com",
        lat: 28.6279,
        lon: 77.3731,
      },
      {
        name: "Max Super Speciality Hospital",
        type: "hospital",
        address: "Saket, New Delhi, Delhi 110017",
        phone: "+91-11-40554055",
        website: "https://www.maxhealthcare.in",
        lat: 28.5355,
        lon: 77.2185,
      },
      {
        name: "Sir Ganga Ram Hospital",
        type: "hospital",
        address: "Rajinder Nagar, New Delhi, Delhi 110060",
        phone: "+91-11-25750000",
        website: "https://www.sgrh.com",
        lat: 28.6448,
        lon: 77.2161,
      },
    ],
    clinic: [
      {
        name: "Dr. Sharma's Family Clinic",
        type: "clinic",
        address: "Connaught Place, New Delhi, Delhi 110001",
        phone: "+91-11-23456789",
        website: null,
        lat: 28.6315,
        lon: 77.2167,
      },
      {
        name: "City Health Center",
        type: "clinic",
        address: "Karol Bagh, New Delhi, Delhi 110005",
        phone: "+91-11-28765432",
        website: null,
        lat: 28.6517,
        lon: 77.1909,
      },
      {
        name: "Wellness Clinic",
        type: "clinic",
        address: "Lajpat Nagar, New Delhi, Delhi 110024",
        phone: "+91-11-29876543",
        website: null,
        lat: 28.5679,
        lon: 77.2431,
      },
    ],
    pharmacy: [
      {
        name: "Apollo Pharmacy",
        type: "pharmacy",
        address: "CP Market, New Delhi, Delhi 110001",
        phone: "+91-11-23456789",
        website: "https://www.apollopharmacy.in",
        lat: 28.6315,
        lon: 77.2167,
      },
      {
        name: "MedPlus Pharmacy",
        type: "pharmacy",
        address: "Rajouri Garden, New Delhi, Delhi 110027",
        phone: "+91-11-28765432",
        website: "https://www.medplusmart.com",
        lat: 28.6448,
        lon: 77.2161,
      },
      {
        name: "Wellness Forever Pharmacy",
        type: "pharmacy",
        address: "Greater Kailash, New Delhi, Delhi 110048",
        phone: "+91-11-29876543",
        website: null,
        lat: 28.5355,
        lon: 77.2185,
      },
    ],
    dentist: [
      {
        name: "Dental Care Center",
        type: "dentist",
        address: "South Extension, New Delhi, Delhi 110049",
        phone: "+91-11-23456789",
        website: null,
        lat: 28.5679,
        lon: 77.2431,
      },
      {
        name: "Smile Dental Clinic",
        type: "dentist",
        address: "Pitampura, New Delhi, Delhi 110034",
        phone: "+91-11-28765432",
        website: null,
        lat: 28.6448,
        lon: 77.2161,
      },
    ],
    camp: [
      {
        name: "Free Health Checkup Camp - AIIMS",
        type: "camp",
        address: "Central Park, Connaught Place, New Delhi, Delhi 110001",
        phone: "+91-11-26588500",
        website: "https://www.aiims.edu",
        lat: 28.6315,
        lon: 77.2167,
        campDate: "2024-01-15",
        campTime: "09:00 AM - 05:00 PM",
        services: "Blood Pressure, Diabetes, BMI, General Health Checkup",
        organizer: "AIIMS Delhi",
        registration: "Walk-in registration available",
      },
      {
        name: "Community Health Camp - Apollo",
        type: "camp",
        address: "Rajiv Gandhi Park, Karol Bagh, New Delhi, Delhi 110005",
        phone: "+91-11-26925858",
        website: "https://www.apollohospitals.com",
        lat: 28.6517,
        lon: 77.1909,
        campDate: "2024-01-20",
        campTime: "08:00 AM - 04:00 PM",
        services: "Eye Checkup, Dental Checkup, Blood Sugar Test",
        organizer: "Apollo Hospitals",
        registration: "Pre-registration required",
      },
      {
        name: "Women's Health Camp",
        type: "camp",
        address: "Community Center, Lajpat Nagar, New Delhi, Delhi 110024",
        phone: "+91-11-29876543",
        website: null,
        lat: 28.5679,
        lon: 77.2431,
        campDate: "2024-01-25",
        campTime: "10:00 AM - 06:00 PM",
        services:
          "Gynecological Checkup, Breast Cancer Screening, Nutrition Counseling",
        organizer: "Delhi Health Department",
        registration: "Free for all women",
      },
      {
        name: "Senior Citizens Health Camp",
        type: "camp",
        address:
          "Senior Citizen Center, Greater Kailash, New Delhi, Delhi 110048",
        phone: "+91-11-23456789",
        website: null,
        lat: 28.5355,
        lon: 77.2185,
        campDate: "2024-01-30",
        campTime: "09:30 AM - 03:30 PM",
        services: "Heart Checkup, Bone Density Test, Memory Assessment",
        organizer: "Max Healthcare",
        registration: "Age 60+ only",
      },
      {
        name: "Child Health & Vaccination Camp",
        type: "camp",
        address: "Primary School Ground, Pitampura, New Delhi, Delhi 110034",
        phone: "+91-11-28765432",
        website: null,
        lat: 28.6448,
        lon: 77.2161,
        campDate: "2024-02-05",
        campTime: "09:00 AM - 05:00 PM",
        services: "Child Vaccination, Growth Monitoring, Nutrition Assessment",
        organizer: "UNICEF & Delhi Government",
        registration: "Bring child's vaccination card",
      },
      {
        name: "Mental Health Awareness Camp",
        type: "camp",
        address: "Community Hall, Saket, New Delhi, Delhi 110017",
        phone: "+91-11-40554055",
        website: "https://www.maxhealthcare.in",
        lat: 28.5355,
        lon: 77.2185,
        campDate: "2024-02-10",
        campTime: "11:00 AM - 07:00 PM",
        services: "Mental Health Screening, Counseling, Stress Management",
        organizer: "Max Mental Health Department",
        registration: "Confidential consultation available",
      },
    ],
  };

  const facilityTypes = [
    {
      id: "hospital",
      name: "Hospitals",
      icon: Building2,
      color: "bg-red-100 text-red-600",
    },
    {
      id: "clinic",
      name: "Clinics",
      icon: Stethoscope,
      color: "bg-blue-100 text-blue-600",
    },
    {
      id: "pharmacy",
      name: "Pharmacies",
      icon: Pill,
      color: "bg-green-100 text-green-600",
    },
    {
      id: "dentist",
      name: "Dentists",
      icon: Stethoscope,
      color: "bg-purple-100 text-purple-600",
    },
    {
      id: "camp",
      name: "Medical Camps",
      icon: Users,
      color: "bg-orange-100 text-orange-600",
    },
  ];

  // Get user's current location
  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      setLoading(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          setUserLocation({ lat, lon });
          setLocation(`${lat},${lon}`);
          setLoading(false);
          setError(null);
        },
        (error) => {
          console.error("Error getting location:", error);
          setError(
            "Unable to get your location. Please enter coordinates manually."
          );
          setLoading(false);
        }
      );
    } else {
      setError("Geolocation is not supported by this browser.");
    }
  };

  // Search for healthcare centers
  const searchCenters = async () => {
    if (!location) {
      setError("Please enter a location or use current location");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Simulate API call with delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Use hardcoded data based on search type
      const data = healthcareCentersData[searchType] || [];
      setCenters(data);
    } catch (err) {
      setError("Network error. Please try again.");
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Auto-search when location changes
  useEffect(() => {
    if (location && userLocation) {
      searchCenters();
    }
  }, [location, searchType]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Find Healthcare Centers
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover nearby hospitals, clinics, pharmacies, and medical
              facilities in your area
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white rounded-lg shadow-sm p-6 mb-8"
        >
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Location Input */}
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location (Latitude, Longitude)
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g., 28.6139,77.2090 (Delhi)"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  onClick={getCurrentLocation}
                  disabled={loading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Navigation className="h-4 w-4" />
                  )}
                  Current
                </button>
              </div>
            </div>

            {/* Facility Type Selector */}
            <div className="lg:w-64">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Facility Type
              </label>
              <select
                value={searchType}
                onChange={(e) => setSearchType(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {facilityTypes.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Search Button */}
            <div className="lg:w-auto flex items-end">
              <button
                onClick={searchCenters}
                disabled={loading || !location}
                className="w-full lg:w-auto px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Search className="h-4 w-4" />
                )}
                Search
              </button>
            </div>
          </div>

          {/* Quick Location Examples */}
          <div className="mt-4">
            <p className="text-sm text-gray-600 mb-2">
              Quick examples (Major Indian Cities):
            </p>
            <div className="flex flex-wrap gap-2">
              {[
                { name: "Delhi", coords: "28.6139,77.2090" },
                { name: "Mumbai", coords: "19.0760,72.8777" },
                { name: "Bangalore", coords: "12.9716,77.5946" },
                { name: "Chennai", coords: "13.0827,80.2707" },
                { name: "Kolkata", coords: "22.5726,88.3639" },
                { name: "Hyderabad", coords: "17.3850,78.4867" },
                { name: "Pune", coords: "18.5204,73.8567" },
                { name: "Ahmedabad", coords: "23.0225,72.5714" },
                { name: "Jaipur", coords: "26.9124,75.7873" },
                { name: "Lucknow", coords: "26.8467,80.9462" },
              ].map((city) => (
                <button
                  key={city.name}
                  onClick={() => setLocation(city.coords)}
                  className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
                >
                  {city.name}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6"
          >
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
              <p className="text-red-800">{error}</p>
            </div>
          </motion.div>
        )}

        {/* Results */}
        {centers.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Found {centers.length}{" "}
                {facilityTypes.find((t) => t.id === searchType)?.name}
              </h2>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <CheckCircle className="h-4 w-4 text-green-600" />
                Live data from OpenStreetMap
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {centers.map((center, index) => {
                const facilityType = facilityTypes.find(
                  (t) => t.id === searchType
                );
                const Icon = facilityType?.icon || Building2;
                const colorClass =
                  facilityType?.color || "bg-gray-100 text-gray-600";

                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className={`p-2 rounded-lg ${colorClass}`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-1 text-sm text-gray-500">
                          <MapPin className="h-3 w-3" />
                          <span>
                            {center.lat ? center.lat.toFixed(4) : "N/A"},{" "}
                            {center.lon ? center.lon.toFixed(4) : "N/A"}
                          </span>
                        </div>
                      </div>
                    </div>

                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                      {center.name}
                    </h3>

                    <div className="space-y-2">
                      <div className="flex items-start gap-2 text-sm text-gray-600">
                        <MapPin className="h-4 w-4 mt-0.5 text-gray-400" />
                        <span className="line-clamp-2">{center.address}</span>
                      </div>

                      {/* Camp-specific information */}
                      {center.type === "camp" && (
                        <>
                          {center.campDate && (
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Calendar className="h-4 w-4 text-gray-400" />
                              <span className="font-medium text-orange-600">
                                Date:{" "}
                                {new Date(center.campDate).toLocaleDateString(
                                  "en-IN",
                                  {
                                    weekday: "long",
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                  }
                                )}
                              </span>
                            </div>
                          )}
                          {center.campTime && (
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Clock className="h-4 w-4 text-gray-400" />
                              <span className="font-medium text-orange-600">
                                Time: {center.campTime}
                              </span>
                            </div>
                          )}
                          {center.services && (
                            <div className="text-sm text-gray-600">
                              <span className="font-medium text-gray-800">
                                Services:{" "}
                              </span>
                              <span className="text-gray-600">
                                {center.services}
                              </span>
                            </div>
                          )}
                          {center.organizer && (
                            <div className="text-sm text-gray-600">
                              <span className="font-medium text-gray-800">
                                Organizer:{" "}
                              </span>
                              <span className="text-gray-600">
                                {center.organizer}
                              </span>
                            </div>
                          )}
                          {center.registration && (
                            <div className="text-sm text-gray-600">
                              <span className="font-medium text-gray-800">
                                Registration:{" "}
                              </span>
                              <span className="text-gray-600">
                                {center.registration}
                              </span>
                            </div>
                          )}
                        </>
                      )}

                      {center.phone &&
                        center.phone !== "Phone not available" && (
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Phone className="h-4 w-4 text-gray-400" />
                            <a
                              href={`tel:${center.phone}`}
                              className="text-blue-600 hover:text-blue-800"
                            >
                              {center.phone}
                            </a>
                          </div>
                        )}

                      {center.website && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Globe className="h-4 w-4 text-gray-400" />
                          <a
                            href={center.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 truncate"
                          >
                            Visit Website
                          </a>
                        </div>
                      )}
                    </div>

                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span className="capitalize">{center.type}</span>
                        {center.type === "camp" ? (
                          <span className="text-orange-600 font-medium">
                            Free Camp
                          </span>
                        ) : (
                          <span>Updated recently</span>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* No Results */}
        {centers.length === 0 && !loading && location && !error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <div className="text-gray-400 mb-4">
              <Search className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No {facilityTypes.find((t) => t.id === searchType)?.name} found
            </h3>
            <p className="text-gray-600">
              Try adjusting your location or search for a different facility
              type.
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default HealthcareCenters;
