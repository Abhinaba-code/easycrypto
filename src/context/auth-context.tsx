
'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface User {
  name: string;
  email: string;
  walletBalance: number;
}

interface AuthContextType {
  user: User | null;
  login: (name: string, email: string) => void;
  logout: () => void;
  updateWalletBalance: (amount: number) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // This effect prevents flicker on load by waiting to render children
  // until we know if a user is "logged in" or not (from sessionStorage).
  useEffect(() => {
    try {
        const storedUser = sessionStorage.getItem('arcade-user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    } catch (error) {
        console.error("Could not parse user from sessionStorage", error)
        sessionStorage.removeItem('arcade-user');
    }
    setLoading(false);
  }, []);

  const login = (name: string, email: string) => {
    const userToLogin: User = { name, email, walletBalance: 1000 };
    setUser(userToLogin);
    sessionStorage.setItem('arcade-user', JSON.stringify(userToLogin));
  };
  
  const updateWalletBalance = (amount: number) => {
    setUser(currentUser => {
      if (!currentUser) return null;
      const newBalance = currentUser.walletBalance + amount;
      const updatedUser = { ...currentUser, walletBalance: newBalance };
      sessionStorage.setItem('arcade-user', JSON.stringify(updatedUser));
      return updatedUser;
    });
  };

  const logout = () => {
    setUser(null);
    sessionStorage.removeItem('arcade-user');
  };

  if (loading) {
      return null; // or a loading spinner
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, updateWalletBalance }}>
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
