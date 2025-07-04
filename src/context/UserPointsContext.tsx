
"use client";

import type { ReactNode } from 'react';
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getLoggedInUser, setLoggedInUser, logoutUser as authLogout } from '@/lib/auth';
import { getUserById } from '@/lib/storage';
import type { User } from '@/lib/types';

interface UserPointsContextType {
  points: number;
  user: Omit<User, 'password'> | null;
  updatePoints: (amount: number) => void;
  logout: () => void;
  loading: boolean;
  refreshUser: () => Promise<void>;
}

const UserPointsContext = createContext<UserPointsContextType | undefined>(undefined);

export const UserPointsProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<Omit<User, 'password'> | null>(null);
  const [points, setPoints] = useState(0);
  const [loading, setLoading] = useState(true);
  
  const fetchCurrentUser = useCallback(async () => {
    setLoading(true);
    const loggedInUser = getLoggedInUser();
    if (loggedInUser) {
      const currentUser = await getUserById(loggedInUser.id);
      if (currentUser) {
        const { password, ...userToDisplay } = currentUser;
        setUser(userToDisplay);
        setPoints(currentUser.points);
        // Also update the local storage user in case it's stale
        setLoggedInUser(userToDisplay);
      } else {
        // User not found in DB, log them out
        logout();
      }
    }
    setLoading(false);
  }, []);

  const refreshUser = useCallback(async () => {
    await fetchCurrentUser();
  }, [fetchCurrentUser]);

  useEffect(() => {
    fetchCurrentUser();
  }, [fetchCurrentUser]);

  const updatePoints = useCallback((amount: number) => {
    if (!user) return;
    
    const newPoints = points + amount;
    setPoints(newPoints);
    
    // Update local storage session object
    const sessionUser = getLoggedInUser();
    if (sessionUser) {
        setLoggedInUser({ ...sessionUser, points: newPoints });
    }

    // Update state
    setUser(prevUser => prevUser ? { ...prevUser, points: newPoints } : null);

  }, [user, points]);

  const logout = () => {
    authLogout();
    setUser(null);
    setPoints(0);
    setLoading(false);
  };

  return (
    <UserPointsContext.Provider value={{ user, points, updatePoints, logout, loading, refreshUser }}>
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
