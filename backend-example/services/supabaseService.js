const { createClient } = require("@supabase/supabase-js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

class SupabaseService {
  constructor() {
    this.supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY // Use service role key for server-side operations
    );

    this.jwtSecret = process.env.JWT_SECRET || "your-jwt-secret-key";
  }

  // User Registration
  async registerUser(userData) {
    try {
      const {
        name,
        mobile_number,
        email,
        password,
        language_preference = "en",
        location,
        date_of_birth,
      } = userData;

      // Check if user already exists
      const { data: existingUser, error: checkError } = await this.supabase
        .from("users")
        .select("id")
        .or(`mobile_number.eq.${mobile_number},email.eq.${email}`)
        .single();

      if (existingUser) {
        return {
          success: false,
          error: "User with this mobile number or email already exists",
        };
      }

      // Hash password
      const saltRounds = 10;
      const password_hash = await bcrypt.hash(password, saltRounds);

      // Create user
      const { data: user, error: userError } = await this.supabase
        .from("users")
        .insert({
          name,
          mobile_number,
          email,
          password_hash,
          language_preference,
          location,
          date_of_birth,
        })
        .select()
        .single();

      if (userError) {
        return {
          success: false,
          error: userError.message,
        };
      }

      // Create default notification preferences
      const { error: prefError } = await this.supabase
        .from("notification_preferences")
        .insert({
          user_id: user.id,
          whatsapp_enabled: true,
          sms_enabled: false,
          email_enabled: true,
          vaccination_reminders: true,
          health_tips: true,
          emergency_alerts: true,
        });

      if (prefError) {
        console.error("Error creating notification preferences:", prefError);
        // Don't fail registration if preferences creation fails
      }

      // Generate JWT token
      const token = jwt.sign(
        {
          userId: user.id,
          mobile_number: user.mobile_number,
          type: "user",
        },
        this.jwtSecret,
        { expiresIn: "7d" }
      );

      // Create session
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7);

      await this.supabase.from("user_sessions").insert({
        user_id: user.id,
        session_token: token,
        expires_at: expiresAt.toISOString(),
        platform: "web",
      });

      return {
        success: true,
        user: {
          id: user.id,
          name: user.name,
          mobile_number: user.mobile_number,
          email: user.email,
          language_preference: user.language_preference,
          location: user.location,
          date_of_birth: user.date_of_birth,
          created_at: user.created_at,
        },
        token,
      };
    } catch (error) {
      console.error("Registration error:", error);
      return {
        success: false,
        error: "Internal server error",
      };
    }
  }

  // User Login
  async loginUser(credentials) {
    try {
      const { mobile_number, password } = credentials;

      // Get user with password hash
      const { data: user, error: userError } = await this.supabase
        .from("users")
        .select("*")
        .eq("mobile_number", mobile_number)
        .eq("is_active", true)
        .single();

      if (userError || !user) {
        return {
          success: false,
          error: "Invalid mobile number or password",
        };
      }

      // Verify password
      const isPasswordValid = await bcrypt.compare(
        password,
        user.password_hash
      );
      if (!isPasswordValid) {
        return {
          success: false,
          error: "Invalid mobile number or password",
        };
      }

      // Generate JWT token
      const token = jwt.sign(
        {
          userId: user.id,
          mobile_number: user.mobile_number,
          type: "user",
        },
        this.jwtSecret,
        { expiresIn: "7d" }
      );

      // Create session
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7);

      await this.supabase.from("user_sessions").insert({
        user_id: user.id,
        session_token: token,
        expires_at: expiresAt.toISOString(),
        platform: "web",
      });

      return {
        success: true,
        user: {
          id: user.id,
          name: user.name,
          mobile_number: user.mobile_number,
          email: user.email,
          language_preference: user.language_preference,
          location: user.location,
          date_of_birth: user.date_of_birth,
          created_at: user.created_at,
        },
        token,
      };
    } catch (error) {
      console.error("Login error:", error);
      return {
        success: false,
        error: "Internal server error",
      };
    }
  }

  // Admin Login
  async loginAdmin(credentials) {
    try {
      const { email, password } = credentials;

      // Get admin with password hash
      const { data: admin, error: adminError } = await this.supabase
        .from("admin_users")
        .select("*")
        .eq("email", email)
        .eq("is_active", true)
        .single();

      if (adminError || !admin) {
        return {
          success: false,
          error: "Invalid email or password",
        };
      }

      // Verify password
      const isPasswordValid = await bcrypt.compare(
        password,
        admin.password_hash
      );
      if (!isPasswordValid) {
        return {
          success: false,
          error: "Invalid email or password",
        };
      }

      // Generate JWT token
      const token = jwt.sign(
        {
          adminId: admin.id,
          email: admin.email,
          role: admin.role,
          type: "admin",
        },
        this.jwtSecret,
        { expiresIn: "24h" }
      );

      // Create session
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 24);

      await this.supabase.from("admin_sessions").insert({
        admin_id: admin.id,
        session_token: token,
        expires_at: expiresAt.toISOString(),
      });

      return {
        success: true,
        admin: {
          id: admin.id,
          name: admin.name,
          email: admin.email,
          role: admin.role,
          created_at: admin.created_at,
        },
        token,
      };
    } catch (error) {
      console.error("Admin login error:", error);
      return {
        success: false,
        error: "Internal server error",
      };
    }
  }

  // Get all users (for admin panel)
  async getAllUsers(page = 1, limit = 10, search = "") {
    try {
      let query = this.supabase
        .from("users")
        .select(
          `
          *,
          notification_preferences(*)
        `
        )
        .eq("is_active", true)
        .order("created_at", { ascending: false });

      if (search) {
        query = query.or(
          `name.ilike.%${search}%,mobile_number.ilike.%${search}%,email.ilike.%${search}%`
        );
      }

      const from = (page - 1) * limit;
      const to = from + limit - 1;

      const { data: users, error, count } = await query.range(from, to);

      if (error) {
        return {
          success: false,
          error: error.message,
        };
      }

      return {
        success: true,
        users: users || [],
        total: count,
        page,
        limit,
      };
    } catch (error) {
      console.error("Get users error:", error);
      return {
        success: false,
        error: "Internal server error",
      };
    }
  }

  // Send notification to users
  async sendNotification(notificationData) {
    try {
      const {
        user_ids,
        type,
        title,
        message,
        delivery_method = "whatsapp",
        scheduled_at = null,
        admin_id,
      } = notificationData;

      // Validate delivery method
      const validDeliveryMethods = ["whatsapp", "sms", "email"];
      if (!validDeliveryMethods.includes(delivery_method)) {
        return {
          success: false,
          error: `Invalid delivery method. Must be one of: ${validDeliveryMethods.join(
            ", "
          )}`,
        };
      }

      // Validate users exist and have required data for delivery method
      if (delivery_method === "whatsapp") {
        const userValidation = await this.validateUsersForWhatsApp(user_ids);
        if (!userValidation.success) {
          return userValidation;
        }
      }

      const notifications = user_ids.map((user_id) => ({
        user_id,
        admin_id,
        type,
        title,
        message,
        status: "pending",
        delivery_method,
        scheduled_at: scheduled_at || new Date().toISOString(),
        data: {
          created_by_admin: true,
          delivery_method: delivery_method,
          created_at: new Date().toISOString(),
        },
      }));

      const { data, error } = await this.supabase
        .from("notifications")
        .insert(notifications)
        .select();

      if (error) {
        return {
          success: false,
          error: error.message,
        };
      }

      return {
        success: true,
        notifications: data,
        count: data.length,
        message: `Notification queued for ${data.length} users via ${delivery_method}`,
      };
    } catch (error) {
      console.error("Send notification error:", error);
      return {
        success: false,
        error: "Internal server error",
      };
    }
  }

  // Validate users have required data for WhatsApp delivery
  async validateUsersForWhatsApp(user_ids) {
    try {
      const { data: users, error } = await this.supabase
        .from("users")
        .select("id, mobile_number, name")
        .in("id", user_ids);

      if (error) {
        return {
          success: false,
          error: "Failed to validate users",
        };
      }

      const usersWithoutPhone = users.filter((user) => !user.mobile_number);
      if (usersWithoutPhone.length > 0) {
        return {
          success: false,
          error: `Some users (${usersWithoutPhone.length}) don't have mobile numbers for WhatsApp delivery`,
          invalid_users: usersWithoutPhone.map((u) => ({
            id: u.id,
            name: u.name,
          })),
        };
      }

      return {
        success: true,
        valid_users: users.length,
      };
    } catch (error) {
      console.error("Error validating users for WhatsApp:", error);
      return {
        success: false,
        error: "Failed to validate users",
      };
    }
  }

  // Get notification templates
  async getNotificationTemplates() {
    try {
      const { data: templates, error } = await this.supabase
        .from("notification_templates")
        .select("*")
        .eq("is_active", true)
        .order("created_at", { ascending: false });

      if (error) {
        return {
          success: false,
          error: error.message,
        };
      }

      return {
        success: true,
        templates: templates || [],
      };
    } catch (error) {
      console.error("Get templates error:", error);
      return {
        success: false,
        error: "Internal server error",
      };
    }
  }

  // Get user notifications
  async getUserNotifications(userId, page = 1, limit = 10) {
    try {
      const from = (page - 1) * limit;
      const to = from + limit - 1;

      const {
        data: notifications,
        error,
        count,
      } = await this.supabase
        .from("notifications")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .range(from, to);

      if (error) {
        return {
          success: false,
          error: error.message,
        };
      }

      return {
        success: true,
        notifications: notifications || [],
        total: count,
        page,
        limit,
      };
    } catch (error) {
      console.error("Get user notifications error:", error);
      return {
        success: false,
        error: "Internal server error",
      };
    }
  }

  // Verify JWT token
  verifyToken(token) {
    try {
      const decoded = jwt.verify(token, this.jwtSecret);
      return {
        success: true,
        data: decoded,
      };
    } catch (error) {
      return {
        success: false,
        error: "Invalid token",
      };
    }
  }

  // Get user by ID
  async getUserById(userId) {
    try {
      const { data: user, error } = await this.supabase
        .from("users")
        .select(
          `
          *,
          notification_preferences(*)
        `
        )
        .eq("id", userId)
        .single();

      if (error || !user) {
        return {
          success: false,
          error: "User not found",
        };
      }

      return {
        success: true,
        user,
      };
    } catch (error) {
      console.error("Get user by ID error:", error);
      return {
        success: false,
        error: "Internal server error",
      };
    }
  }

  // Update user preferences
  async updateUserPreferences(userId, preferences) {
    try {
      const { error } = await this.supabase
        .from("notification_preferences")
        .update(preferences)
        .eq("user_id", userId);

      if (error) {
        return {
          success: false,
          error: error.message,
        };
      }

      return {
        success: true,
      };
    } catch (error) {
      console.error("Update preferences error:", error);
      return {
        success: false,
        error: "Internal server error",
      };
    }
  }
}

module.exports = new SupabaseService();
