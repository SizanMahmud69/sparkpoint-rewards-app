
'use client';

import type { User, Withdrawal, Task, PaymentMethod, PointTransaction, Notification } from './types';
import { mockUsers, mockWithdrawals, mockTasks, mockPaymentMethods, mockPointHistory, mockNotifications } from './data';

const USERS_KEY = 'sparkpoint_users_v2';
const WITHDRAWALS_KEY = 'sparkpoint_withdrawals_v2';
const TASKS_KEY = 'sparkpoint_tasks_v2';
const PAYMENT_METHODS_KEY = 'sparkpoint_payment_methods_v2';
const POINT_HISTORY_KEY = 'sparkpoint_point_history_v2';
const MIN_WITHDRAWAL_KEY = 'sparkpoint_min_withdrawal_v1';
const NOTIFICATIONS_KEY = 'sparkpoint_notifications_v1';


const getLocalStorage = () => {
  if (typeof window !== 'undefined' && window.localStorage) {
    return window.localStorage;
  }
  return null;
};

const getFromStorage = <T>(key: string, mockData: T[]): T[] => {
    const storage = getLocalStorage();
    if (!storage) return []; 
    const dataJson = storage.getItem(key);
    if (dataJson) {
        try {
            return JSON.parse(dataJson);
        } catch (e) {
            console.error(`Failed to parse ${key} from localStorage`, e);
            return mockData;
        }
    } else {
        storage.setItem(key, JSON.stringify(mockData));
        return mockData;
    }
};

const saveToStorage = <T>(key: string, data: T[]) => {
    const storage = getLocalStorage();
    if (storage) {
        storage.setItem(key, JSON.stringify(data));
    }
};

export const getUsers = (): User[] => getFromStorage<User>(USERS_KEY, mockUsers);
export const saveUsers = (users: User[]) => saveToStorage<User>(USERS_KEY, users);

export const getWithdrawals = (): Withdrawal[] => getFromStorage<Withdrawal>(WITHDRAWALS_KEY, mockWithdrawals);
export const saveWithdrawals = (withdrawals: Withdrawal[]) => saveToStorage<Withdrawal>(WITHDRAWALS_KEY, withdrawals);

export const getTasks = (): Task[] => getFromStorage<Task>(TASKS_KEY, mockTasks);
export const saveTasks = (tasks: Task[]) => saveToStorage<Task>(TASKS_KEY, tasks);

export const getPaymentMethods = (): PaymentMethod[] => getFromStorage<PaymentMethod>(PAYMENT_METHODS_KEY, mockPaymentMethods);
export const savePaymentMethods = (methods: PaymentMethod[]) => saveToStorage<PaymentMethod>(PAYMENT_METHODS_KEY, methods);

export const getAllPointHistory = (): PointTransaction[] => getFromStorage<PointTransaction>(POINT_HISTORY_KEY, mockPointHistory);

export const getPointHistoryForUser = (userId: number): PointTransaction[] => {
    const allHistory = getAllPointHistory();
    return allHistory.filter(t => t.userId === userId);
}

export const addPointTransaction = (transaction: Omit<PointTransaction, 'id'>) => {
    const allHistory = getAllPointHistory();
    const newTransaction: PointTransaction = {
        ...transaction,
        id: allHistory.length > 0 ? Math.max(...allHistory.map(t => t.id)) + 1 : 1,
    }
    saveToStorage<PointTransaction>(POINT_HISTORY_KEY, [newTransaction, ...allHistory]);
}

export const getMinWithdrawal = (): number => {
    const storage = getLocalStorage();
    if (!storage) return 1000;
    const minWithdrawal = storage.getItem(MIN_WITHDRAWAL_KEY);
    if (minWithdrawal) {
        try {
            return JSON.parse(minWithdrawal);
        } catch (e) {
            console.error(`Failed to parse ${MIN_WITHDRAWAL_KEY} from localStorage`, e);
            return 1000;
        }
    } else {
        storage.setItem(MIN_WITHDRAWAL_KEY, JSON.stringify(1000));
        return 1000;
    }
};

export const saveMinWithdrawal = (amount: number) => {
    const storage = getLocalStorage();
    if (storage) {
        storage.setItem(MIN_WITHDRAWAL_KEY, JSON.stringify(amount));
    }
};

// Notification Storage Functions
export const getAllNotifications = (): Notification[] => getFromStorage<Notification>(NOTIFICATIONS_KEY, mockNotifications);
export const saveAllNotifications = (notifications: Notification[]) => saveToStorage<Notification>(NOTIFICATIONS_KEY, notifications);

export const getNotificationsForUser = (userId: number): Notification[] => {
    return getAllNotifications().filter(n => n.userId === userId).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

export const addNotification = (notification: Omit<Notification, 'id'>) => {
    const allNotifications = getAllNotifications();
    const newNotification: Notification = {
        ...notification,
        id: allNotifications.length > 0 ? Math.max(...allNotifications.map(n => n.id)) + 1 : 1,
    };
    saveAllNotifications([newNotification, ...allNotifications]);
};

export const markNotificationsAsRead = (userId: number) => {
    const allNotifications = getAllNotifications();
    const updatedNotifications = allNotifications.map(n => 
        n.userId === userId ? { ...n, read: true } : n
    );
    saveAllNotifications(updatedNotifications);
};

export const deleteUserAndData = (userId: number) => {
    // Delete user
    const users = getUsers();
    const updatedUsers = users.filter(u => u.id !== userId);
    saveUsers(updatedUsers);

    // Delete withdrawal history
    const withdrawals = getWithdrawals();
    const updatedWithdrawals = withdrawals.filter(w => w.userId !== userId);
    saveWithdrawals(updatedWithdrawals);

    // Delete point history
    const pointHistory = getAllPointHistory();
    const updatedPointHistory = pointHistory.filter(p => p.userId !== userId);
    saveToStorage<PointTransaction>(POINT_HISTORY_KEY, updatedPointHistory);

    // Delete notifications
    const notifications = getAllNotifications();
    const updatedNotifications = notifications.filter(n => n.userId !== userId);
    saveAllNotifications(updatedNotifications);
};
