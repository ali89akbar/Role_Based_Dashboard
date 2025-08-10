import React, { useState, useEffect, createContext, useContext, useReducer } from 'react';
import { 
  Menu, 
  X, 
  Bell, 
  User, 
  Settings, 
  LogOut, 
  Sun, 
  Moon, 
  Users, 
  Shield, 
  BarChart3, 
  Home,
  Building2,
  ChevronDown,
  Eye,
  EyeOff,
  Check
} from 'lucide-react';

// Theme Context
const ThemeContext = createContext();

const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const savedTheme = window.localStorage?.getItem('theme');
    if (savedTheme) {
      setIsDark(savedTheme === 'dark');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    if (typeof window !== 'undefined') {
      localStorage.setItem('theme', newTheme ? 'dark' : 'light');
    }
  };

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      <div className={isDark ? 'dark' : ''}>{children}</div>
    </ThemeContext.Provider>
  );
};

// Auth Context
const AuthContext = createContext();

const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Mock data and utilities
const ROLES = {
  SUPER_ADMIN: 'super_admin',
  ADMIN: 'admin',
  MANAGER: 'manager',
  USER: 'user'
};

const ROLE_PERMISSIONS = {
  [ROLES.SUPER_ADMIN]: ['create_tenant', 'manage_all_users', 'view_analytics', 'system_settings'],
  [ROLES.ADMIN]: ['manage_tenant_users', 'view_team_data', 'tenant_settings'],
  [ROLES.MANAGER]: ['view_team_data', 'limited_user_management'],
  [ROLES.USER]: ['view_dashboard', 'view_profile']
};

// Mock users data
const mockUsers = {
  'superadmin@aitools.com': {
    id: 1,
    email: 'superadmin@aitools.com',
    name: 'Super Admin',
    role: ROLES.SUPER_ADMIN,
    tenantId: null,
    tenantName: 'System'
  },
  'admin@company1.com': {
    id: 2,
    email: 'admin@company1.com',
    name: 'Company 1 Admin',
    role: ROLES.ADMIN,
    tenantId: 1,
    tenantName: 'Company 1'
  },
  'manager@company1.com': {
    id: 3,
    email: 'manager@company1.com',
    name: 'Team Manager',
    role: ROLES.MANAGER,
    tenantId: 1,
    tenantName: 'Company 1'
  },
  'user@company1.com': {
    id: 4,
    email: 'user@company1.com',
    name: 'Regular User',
    role: ROLES.USER,
    tenantId: 1,
    tenantName: 'Company 1'
  }
};

// Mock notifications
const mockNotifications = [
  { id: 1, message: 'Welcome to the AI SaaS Platform!', read: false, createdAt: '2024-01-10' },
  { id: 2, message: 'Your monthly report is ready', read: false, createdAt: '2024-01-09' },
  { id: 3, message: 'System maintenance scheduled', read: true, createdAt: '2024-01-08' }
];

// Auth Provider
const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    if (token && userData) {
      setUser(JSON.parse(userData));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    // Mock authentication
    if (mockUsers[email] && password === 'password') {
      const userData = mockUsers[email];
      // Mock JWT token
      const token = `mock-jwt-token-${userData.id}`;
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      return { success: true };
    }
    return { success: false, error: 'Invalid credentials' };
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const hasPermission = (permission) => {
    if (!user) return false;
    return ROLE_PERMISSIONS[user.role]?.includes(permission) || false;
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, hasPermission, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// Notification Context
const NotificationContext = createContext();

const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState(mockNotifications);

  const markAsRead = (id) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <NotificationContext.Provider value={{ notifications, markAsRead, unreadCount }}>
      {children}
    </NotificationContext.Provider>
  );
};
// Export hooks for easier access
export { 
  ThemeProvider, 
  useTheme, 
  AuthProvider, 
  useAuth, 
  NotificationProvider, 
  useNotifications, 
  ROLES, 
  ROLE_PERMISSIONS 
};