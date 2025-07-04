
"use client";

import type { ReactNode } from 'react';
import { createContext, useContext, useState } from 'react';
import { mockUsers } from '@/lib/data';

interface UserPointsContextType {
  points: number;
  updatePoints: (amount: number) => void;
}

const UserPointsContext = createContext<UserPointsContextType | undefined>(undefined);

export const UserPointsProvider = ({ children }: { children: ReactNode }) => {
  const loggedInUserId = 1;
  const initialUser = mockUsers.find(u => u.id === loggedInUserId)!;
  const [points, setPoints] = useState(initialUser.points);

  const updatePoints = (amount: number) => {
    setPoints(prevPoints => prevPoints + amount);
  };

  return (
    <UserPointsContext.Provider value={{ points, updatePoints }}>
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
