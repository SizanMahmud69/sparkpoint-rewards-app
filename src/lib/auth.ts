
'use client';

import type { User } from './types';

const USERS_KEY = 'sparkpoint_users';
const LOGGED_IN_USER_KEY = 'sparkpoint_logged_in_user';

// Helper to safely access localStorage
const getLocalStorage = () => {
  if (typeof window !== 'undefined' && window.localStorage) {
    return window.localStorage;
  }
  return null;
};

// Function to get all users from localStorage
const getUsers = (): User[] => {
  const storage = getLocalStorage();
  if (!storage) return [];
  const usersJson = storage.getItem(USERS_KEY);
  return usersJson ? JSON.parse(usersJson) : [];
};

// Function to save all users to localStorage
const saveUsers = (users: User[]) => {
  const storage = getLocalStorage();
  if (storage) {
    storage.setItem(USERS_KEY, JSON.stringify(users));
  }
};

// Register a new user
export const registerUser = (name: string, email: string, password: string): { success: boolean; message: string; user?: User } => {
  const users = getUsers();
  const existingUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());

  if (existingUser) {
    return { success: false, message: 'An account with this email already exists.' };
  }
  
  // In a real app, you would hash the password. For this simulation, we store it in plain text.
  const newUser: User = {
    id: users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1,
    name,
    email,
    password, // Storing password for simulation purposes. Not for production!
    points: 50, // Bonus points for registering
    registrationDate: new Date().toISOString().split('T')[0],
    status: 'Active',
    avatar: 'https://placehold.co/100x100.png',
  };

  users.push(newUser);
  saveUsers(users);
  
  return { success: true, message: 'Registration successful!', user: newUser };
};

// Login a user
export const loginUser = (email: string, password: string): User | null => {
  const users = getUsers();
  const user = users.find(
    u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
  );
  return user || null;
};

// Set the currently logged-in user
export const setLoggedInUser = (user: User) => {
  const storage = getLocalStorage();
  if (storage) {
    // Don't store the password in the logged-in session data
    const { password, ...userToStore } = user;
    storage.setItem(LOGGED_IN_USER_KEY, JSON.stringify(userToStore));
  }
};

// Get the currently logged-in user
export const getLoggedInUser = (): Omit<User, 'password'> | null => {
  const storage = getLocalStorage();
  if (!storage) return null;
  const userJson = storage.getItem(LOGGED_IN_USER_KEY);
  return userJson ? JSON.parse(userJson) : null;
};

// Logout the user
export const logoutUser = () => {
  const storage = getLocalStorage();
  if (storage) {
    storage.removeItem(LOGGED_IN_USER_KEY);
  }
};
