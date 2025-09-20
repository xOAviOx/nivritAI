import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Chatbot from "./pages/Chatbot";
import Register from "./components/Register";
import AccountPage from "./components/AccountPage";
import AdminPanel from "./components/AdminPanel";
import AdminLogin from "./components/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import HealthcareCenters from "./pages/HealthcareCenters";
import authService from "./services/authService";
import "./index.css";

function App() {
  const [user, setUser] = useState(null);
  const [admin, setAdmin] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Initialize authentication state
    const hasAuth = authService.initializeAuth();
    if (hasAuth) {
      if (authService.isAdmin()) {
        setAdmin(authService.getCurrentUser());
      } else {
        setUser(authService.getCurrentUser());
      }
    }
    setIsLoading(false);
  }, []);

  const handleRegisterSuccess = (userData) => {
    setUser(userData);
  };

  const handleLoginSuccess = (userData) => {
    if (authService.isAdmin()) {
      setAdmin(userData);
    } else {
      setUser(userData);
    }
  };

  const handleLogout = () => {
    authService.logout();
    setUser(null);
    setAdmin(null);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Show admin panel if admin is logged in
  if (admin) {
    return (
      <div className="min-h-screen bg-background">
        <AdminPanel admin={admin} onLogout={handleLogout} />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: "#363636",
              color: "#fff",
            },
            success: {
              duration: 3000,
              theme: {
                primary: "#4CAF50",
                secondary: "#black",
              },
            },
          }}
        />
      </div>
    );
  }

  // Show full website with navigation even when user is logged in
  if (user) {
    return (
      <Router>
        <div className="min-h-screen bg-background">
          <Navbar user={user} admin={admin} onLogout={handleLogout} />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/chatbot" element={<Chatbot />} />
            <Route path="/healthcare-centers" element={<HealthcareCenters />} />
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
            <Route
              path="/account"
              element={<AccountPage user={user} onLogout={handleLogout} />}
            />
            <Route
              path="/register"
              element={<AccountPage user={user} onLogout={handleLogout} />}
            />
            <Route
              path="/admin-login"
              element={<AdminLogin onLoginSuccess={handleLoginSuccess} />}
            />
          </Routes>
          <Footer />
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: "#363636",
                color: "#fff",
              },
              success: {
                duration: 3000,
                theme: {
                  primary: "#4CAF50",
                  secondary: "#black",
                },
              },
            }}
          />
        </div>
      </Router>
    );
  }

  // Show full website with navigation if no user is logged in
  return (
    <Router>
      <div className="min-h-screen bg-background">
        <Navbar user={user} admin={admin} onLogout={handleLogout} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/chatbot" element={<Chatbot />} />
          <Route path="/healthcare-centers" element={<HealthcareCenters />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route
            path="/register"
            element={<Register onRegisterSuccess={handleRegisterSuccess} />}
          />
          <Route
            path="/admin-login"
            element={<AdminLogin onLoginSuccess={handleLoginSuccess} />}
          />
        </Routes>
        <Footer />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: "#363636",
              color: "#fff",
            },
            success: {
              duration: 3000,
              theme: {
                primary: "#4CAF50",
                secondary: "#black",
              },
            },
          }}
        />
      </div>
    </Router>
  );
}

export default App;
