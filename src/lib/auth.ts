
'use client';

import type { User } from './types';
import { getUsers, saveUsers, addPointTransaction } from './storage';

const LOGGED_IN_USER_KEY = 'sparkpoint_logged_in_user';

const getLocalStorage = () => {
  if (typeof window !== 'undefined' && window.localStorage) {
    return window.localStorage;
  }
  return null;
};

export const registerUser = (name: string, email: string, password: string): { success: boolean; message: string; user?: User } => {
  const users = getUsers();
  const existingUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());

  if (existingUser) {
    return { success: false, message: 'An account with this email already exists.' };
  }
  
  const newUser: User = {
    id: users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1,
    name,
    email,
    password, 
    points: 50, 
    registrationDate: new Date().toISOString().split('T')[0],
    status: 'Active',
    avatar: 'https://placehold.co/100x100.png',
  };

  addPointTransaction({
    userId: newUser.id,
    task: 'Registration Bonus',
    points: 50,
    date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
  });

  saveUsers([...users, newUser]);
  
  return { success: true, message: 'Registration successful!', user: newUser };
};

export const loginUser = (email: string, password: string): { success: boolean; user?: User; message: string } => {
  const users = getUsers();
  const user = users.find(
    u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
  );

  if (!user) {
    return { success: false, message: 'Invalid email or password. Please try again.' };
  }

  if (user.status === 'Suspended') {
    return { success: false, message: 'Your account has been suspended. Please contact support.' };
  }

  return { success: true, user, message: 'Login successful!' };
};

export const setLoggedInUser = (user: User) => {
  const storage = getLocalStorage();
  if (storage) {
    const { password, ...userToStore } = user;
    storage.setItem(LOGGED_IN_USER_KEY, JSON.stringify(userToStore));
    
    const allUsers = getUsers();
    const userIndex = allUsers.findIndex(u => u.id === user.id);
    if (userIndex !== -1) {
        allUsers[userIndex] = user;
    } else {
        allUsers.push(user);
    }
    saveUsers(allUsers);
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
