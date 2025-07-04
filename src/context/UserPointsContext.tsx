
"use client";

import type { ReactNode } from 'react';
import { createContext, useContext, useState, useEffect } from 'react';
import { getLoggedInUser, setLoggedInUser, logoutUser as authLogout } from '@/lib/auth';
import type { User } from '@/lib/types';

interface UserPointsContextType {
  points: number;
  user: Omit<User, 'password'> | null;
  updatePoints: (amount: number) => void;
  logout: () => void;
}

const UserPointsContext = createContext<UserPointsContextType | undefined>(undefined);

export const UserPointsProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<Omit<User, 'password'> | null>(null);
  const [points, setPoints] = useState(0);
  
  useEffect(() => {
    const loggedInUser = getLoggedInUser();
    if (loggedInUser) {
      setUser(loggedInUser);
      setPoints(loggedInUser.points);
    }
  }, []);

  const updatePoints = (amount: number) => {
    if (!user) return;
    const newPoints = points + amount;
    setPoints(newPoints);
    
    const updatedUser = { ...user, points: newPoints };
    setUser(updatedUser);
    setLoggedInUser(updatedUser as User);
  };

  const logout = () => {
    authLogout();
    setUser(null);
    setPoints(0);
  };


  return (
    <UserPointsContext.Provider value={{ user, points, updatePoints, logout }}>
      {children}
    </UserPointsContext.Provider>
  );
};

export const useUserPoints = () => {
  const context = useContext(UserPointsContext);
  if (context === undefined) {
    throw new Error('useUserPoints must be used within a UserPointsProvider');
  }
  return context;
};
