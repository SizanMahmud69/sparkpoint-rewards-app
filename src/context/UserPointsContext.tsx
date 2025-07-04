
"use client";

import type { ReactNode } from 'react';
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getLoggedInUser, setLoggedInUser, logoutUser as authLogout } from '@/lib/auth';
import { getUsers, saveUsers } from '@/lib/storage';
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
      const allUsers = getUsers();
      const currentUser = allUsers.find(u => u.id === loggedInUser.id);
      if (currentUser) {
        const { password, ...userToDisplay } = currentUser;
        setUser(userToDisplay);
        setPoints(currentUser.points);
      } else {
        logout();
      }
    }
  }, []);

  const updatePoints = useCallback((amount: number) => {
    if (!user) return;
    
    const allUsers = getUsers();
    const userIndex = allUsers.findIndex(u => u.id === user.id);

    if (userIndex > -1) {
      const newPoints = allUsers[userIndex].points + amount;
      allUsers[userIndex].points = newPoints;
      
      const fullUserRecord = allUsers[userIndex];
      const { password, ...userToDisplay } = fullUserRecord;

      saveUsers(allUsers);
      setLoggedInUser(fullUserRecord);
      setUser(userToDisplay);
      setPoints(newPoints);
    }
  }, [user]);

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
