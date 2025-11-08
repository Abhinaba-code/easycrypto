
'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface User {
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  login: (name: string, email: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // This effect prevents flicker on load by waiting to render children
  // until we know if a user is "logged in" or not (from localStorage).
  useEffect(() => {
    try {
        const storedUser = localStorage.getItem('arcade-user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    } catch (error) {
        console.error("Could not parse user from localStorage", error)
        localStorage.removeItem('arcade-user');
    }
    setLoading(false);
  }, []);

  const login = (name: string, email: string) => {
    const userToLogin: User = { name, email };
    setUser(userToLogin);
    localStorage.setItem('arcade-user', JSON.stringify(userToLogin));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('arcade-user');
  };

  if (loading) {
      return null; // or a loading spinner
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
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
