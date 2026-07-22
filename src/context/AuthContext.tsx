import React, { createContext, useContext, useState, useEffect } from 'react';

export type UserRole = 'Admin' | 'Sales' | 'Warehouse' | 'Accounts';

export interface User {
  email: string;
  name: string;
  role: UserRole;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const MOCK_USERS: Record<string, { name: string; role: UserRole; password: string }> = {
  'admin@velora.com': { name: 'Alex Harrison', role: 'Admin', password: 'password123' },
  'sales@velora.com': { name: 'Sarah Jenkins', role: 'Sales', password: 'password123' },
  'warehouse@velora.com': { name: 'Marcus Vance', role: 'Warehouse', password: 'password123' },
  'accounts@velora.com': { name: 'Jane Bradley', role: 'Accounts', password: 'password123' },
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('velora_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 800));
    
    const mockUser = MOCK_USERS[email.toLowerCase().trim()];
    if (mockUser && mockUser.password === password) {
      const loggedInUser: User = {
        email: email.toLowerCase().trim(),
        name: mockUser.name,
        role: mockUser.role,
      };
      setUser(loggedInUser);
      localStorage.setItem('velora_user', JSON.stringify(loggedInUser));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('velora_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
