
'use client';

import type { User } from './types';
import { addUser, getUserByEmail, addPointTransaction } from './storage';

const LOGGED_IN_USER_KEY = 'sparkpoint_logged_in_user';

const getLocalStorage = () => {
  if (typeof window !== 'undefined' && window.localStorage) {
    return window.localStorage;
  }
  return null;
};

export const registerUser = async (name: string, email: string, password: string): Promise<{ success: boolean; message: string; user?: User }> => {
  const existingUser = await getUserByEmail(email);

  if (existingUser) {
    return { success: false, message: 'An account with this email already exists.' };
  }
  
  const newUser: Omit<User, 'id'> = {
    name,
    email,
    password, 
    points: 50, 
    registrationDate: new Date().toISOString(),
    status: 'Active',
    avatar: 'https://placehold.co/100x100.png',
  };

  const addedUser = await addUser(newUser);

  if (!addedUser) {
    return { success: false, message: 'Failed to create user account.' };
  }

  await addPointTransaction({
    userId: addedUser.id,
    task: 'Registration Bonus',
    points: 50,
    date: new Date().toISOString(),
  });
  
  return { success: true, message: 'Registration successful!', user: addedUser };
};

export const loginUser = async (email: string, password: string): Promise<{ success: boolean; user?: User; message: string }> => {
  const user = await getUserByEmail(email);

  if (!user || user.password !== password) {
    return { success: false, message: 'Invalid email or password. Please try again.' };
  }

  if (user.status === 'Suspended') {
    return { success: false, message: 'Your account has been suspended. Please contact support.' };
  }

  return { success: true, user, message: 'Login successful!' };
};

export const setLoggedInUser = (user: User | Omit<User, 'password'>) => {
  const storage = getLocalStorage();
  if (storage) {
    const { password, ...userToStore } = user;
    storage.setItem(LOGGED_IN_USER_KEY, JSON.stringify(userToStore));
  }
};

export const getLoggedInUser = (): Omit<User, 'password'> | null => {
  const storage = getLocalStorage();
  if (!storage) return null;
  const userJson = storage.getItem(LOGGED_IN_USER_KEY);
  return userJson ? JSON.parse(userJson) : null;
};

export const logoutUser = () => {
  const storage = getLocalStorage();
  if (storage) {
    storage.removeItem(LOGGED_IN_USER_KEY);
  }
};
