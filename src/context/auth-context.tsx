
'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';

interface User {
  name: string;
  email: string;
  walletBalance: number;
}

interface AuthContextType {
  user: User | null;
  login: (name: string, email: string) => void;
  logout: () => void;
  updateWalletBalance: (amount: number) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

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
    const existingUser = sessionStorage.getItem('arcade-user');
    let walletBalance = 1000;
    if(existingUser) {
        try {
            const parsedUser = JSON.parse(existingUser);
            if(parsedUser.email === email && typeof parsedUser.walletBalance === 'number') {
                walletBalance = parsedUser.walletBalance;
            }
        } catch (e) {
             console.error("Could not parse existing user from sessionStorage", e)
        }
    }

    const userToLogin: User = { name, email, walletBalance };
    setUser(userToLogin);
    sessionStorage.setItem('arcade-user', JSON.stringify(userToLogin));
  };
  
  const updateWalletBalance = useCallback(async (amount: number) => {
    return new Promise<void>((resolve) => {
      setUser(currentUser => {
        if (!currentUser) {
          resolve();
          return null;
        };
        const newBalance = currentUser.walletBalance + amount;
        const updatedUser = { ...currentUser, walletBalance: newBalance };
        sessionStorage.setItem('arcade-user', JSON.stringify(updatedUser));
        resolve();
        return updatedUser;
      });
    });
  }, []);

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
