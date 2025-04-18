
import React, { createContext, useState, useContext, useEffect } from "react";
import { User, UserRole } from "@/types";
import { users } from "@/data/mockData";

interface AuthContextType {
  currentUser: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoggedIn: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  login: async () => false,
  logout: () => {},
  isLoggedIn: false,
  isLoading: true,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing session on load
  useEffect(() => {
    const storedUser = localStorage.getItem("currentUser");
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  // Login function - in a real app, this would validate against a backend
  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
      // Store user in localStorage - in a real app, this would be a JWT token
      localStorage.setItem("currentUser", JSON.stringify(user));
      setCurrentUser(user);
      setIsLoading(false);
      return true;
    }
    
    setIsLoading(false);
    return false;
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem("currentUser");
    setCurrentUser(null);
  };

  const value = {
    currentUser,
    login,
    logout,
    isLoggedIn: !!currentUser,
    isLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Role-based authorization hook
export const useAuthorization = (allowedRoles: UserRole[]) => {
  const { currentUser, isLoggedIn } = useAuth();
  
  if (!isLoggedIn || !currentUser) {
    return false;
  }
  
  return allowedRoles.includes(currentUser.role);
};
