import axios from "axios";

class AuthService {
  constructor() {
    this.baseURL = process.env.REACT_APP_API_URL || "http://localhost:5002/api";
    this.token = localStorage.getItem("token");
    this.user = JSON.parse(localStorage.getItem("user") || "null");
  }

  // Set authorization header
  getAuthHeaders() {
    return {
      Authorization: `Bearer ${this.token}`,
      "Content-Type": "application/json",
    };
  }

  // User Registration
  async register(userData) {
    try {
      const response = await axios.post(
        `${this.baseURL}/auth/register`,
        userData
      );

      if (response.data.success) {
        this.setAuthData(response.data.user, response.data.token);
        return {
          success: true,
          user: response.data.user,
          message: "Registration successful!",
        };
      } else {
        return {
          success: false,
          error: response.data.error,
        };
      }
    } catch (error) {
      return {
        success: false,
        error:
          error.response?.data?.error ||
          "Registration failed. Please try again.",
      };
    }
  }

  // User Login
  async login(credentials) {
    try {
      const response = await axios.post(
        `${this.baseURL}/auth/login`,
        credentials
      );

      if (response.data.success) {
        this.setAuthData(response.data.user, response.data.token);
        return {
          success: true,
          user: response.data.user,
          message: "Login successful!",
        };
      } else {
        return {
          success: false,
          error: response.data.error,
        };
      }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || "Login failed. Please try again.",
      };
    }
  }

  // Admin Login
  async adminLogin(credentials) {
    try {
      const response = await axios.post(
        `${this.baseURL}/auth/admin/login`,
        credentials
      );

      if (response.data.success) {
        this.setAuthData(response.data.admin, response.data.token, "admin");
        return {
          success: true,
          admin: response.data.admin,
          message: "Admin login successful!",
        };
      } else {
        return {
          success: false,
          error: response.data.error,
        };
      }
    } catch (error) {
      return {
        success: false,
        error:
          error.response?.data?.error ||
          "Admin login failed. Please try again.",
      };
    }
  }

  // Get current user profile
  async getProfile() {
    try {
      const response = await axios.get(`${this.baseURL}/auth/profile`, {
        headers: this.getAuthHeaders(),
      });

      if (response.data.success) {
        this.user = response.data.user;
        localStorage.setItem("user", JSON.stringify(this.user));
        return {
          success: true,
          user: response.data.user,
        };
      } else {
        return {
          success: false,
          error: response.data.error,
        };
      }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || "Failed to fetch profile",
      };
    }
  }

  // Update user preferences
  async updatePreferences(preferences) {
    try {
      const response = await axios.put(
        `${this.baseURL}/auth/preferences`,
        preferences,
        {
          headers: this.getAuthHeaders(),
        }
      );

      return {
        success: response.data.success,
        message: response.data.message || "Preferences updated successfully",
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || "Failed to update preferences",
      };
    }
  }

  // Get user notifications
  async getUserNotifications(page = 1, limit = 10) {
    try {
      const response = await axios.get(
        `${this.baseURL}/auth/notifications?page=${page}&limit=${limit}`,
        {
          headers: this.getAuthHeaders(),
        }
      );

      return {
        success: response.data.success,
        notifications: response.data.notifications || [],
        total: response.data.total || 0,
        page: response.data.page || 1,
        limit: response.data.limit || 10,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || "Failed to fetch notifications",
      };
    }
  }

  // Set authentication data
  setAuthData(user, token, type = "user") {
    this.user = user;
    this.token = token;
    this.userType = type;

    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("token", token);
    localStorage.setItem("userType", type);
  }

  // Clear authentication data
  logout() {
    this.user = null;
    this.token = null;
    this.userType = null;

    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("userType");
  }

  // Check if user is authenticated
  isAuthenticated() {
    return !!this.token && !!this.user;
  }

  // Check if user is admin
  isAdmin() {
    return this.userType === "admin";
  }

  // Get current user
  getCurrentUser() {
    return this.user;
  }

  // Get current token
  getToken() {
    return this.token;
  }

  // Initialize auth state from localStorage
  initializeAuth() {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");
    const storedUserType = localStorage.getItem("userType");

    if (storedUser && storedToken) {
      this.user = JSON.parse(storedUser);
      this.token = storedToken;
      this.userType = storedUserType;
      return true;
    }
    return false;
  }
}

const authService = new AuthService();
export default authService;
