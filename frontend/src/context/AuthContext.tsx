import React, { createContext, useContext, useState, useEffect } from "react";

/**
 * Represents the Farmer's profile in the system.
 * Fields are progressively filled out after initial OTP login.
 */
interface User {
  id: string;
  name: string;
  phone: string;
  age?: string;
  gender?: string;
  state?: string;
  district?: string;
  category?: string;
  landSize?: string;
  appliedSchemes?: { id: string; name: string; date: string; status: string }[];
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (phone: string, profile?: Partial<User>) => void;
  updateProfile: (profile: Partial<User>) => void;
  applyToScheme: (scheme: { id: string; name: string }) => void;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialization: Check if the user is already logged in upon app load
  useEffect(() => {
    // TODO (Phase 2): Replace localStorage with an HTTP-only JWT cookie check via Express backend
    const savedUser = localStorage.getItem("agrivani_user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  /**
   * Logs the user in and creates an initial session.
   * Currently mocked with localStorage.
   */
  const login = (phone: string, profile: Partial<User> = {}) => {
    // TODO (Phase 2): This will be an axios.post('/api/auth/verify-otp') call
    const newUser = { id: "1", phone, name: profile.name || "Farmer", ...profile };
    setUser(newUser);
    localStorage.setItem("agrivani_user", JSON.stringify(newUser));
  };

  /**
   * Updates the farmer's details (e.g., after using the Voice Assistant).
   */
  const updateProfile = (profile: Partial<User>) => {
    if (!user) return;
    
    // TODO (Phase 2): This will be an axios.put('/api/users/profile') call to MongoDB
    const updatedUser = { ...user, ...profile };
    setUser(updatedUser);
    localStorage.setItem("agrivani_user", JSON.stringify(updatedUser));
  };

  /**
   * Records a farmer's application to a specific scheme.
   */
  const applyToScheme = (scheme: { id: string; name: string }) => {
    if (!user) return;
    
    const application = { 
      ...scheme, 
      date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }), 
      status: "Pending Review" 
    };
    
    const updatedApplied = [...(user.appliedSchemes || []), application];
    updateProfile({ appliedSchemes: updatedApplied });
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("agrivani_user");
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, updateProfile, applyToScheme, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};