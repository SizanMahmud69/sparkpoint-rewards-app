
'use client';

import { db } from './firebase';
import { 
    collection, 
    getDocs, 
    addDoc, 
    doc, 
    updateDoc, 
    deleteDoc, 
    writeBatch, 
    query, 
    where, 
    getDoc,
    orderBy,
    limit as firestoreLimit,
    increment,
    DocumentData,
    Query,
    QueryConstraint,
    serverTimestamp,
    Timestamp,
    collectionGroup
} from 'firebase/firestore';
import type { User, Withdrawal, Task, PaymentMethod, PointTransaction, Notification, UserTaskCompletion } from './types';


// Generic function to fetch documents from a collection
const getCollectionData = async <T>(collectionName: string, options?: { filters?: [string, any, any][], limit?: number, orderBy?: [string, 'asc' | 'desc'] }): Promise<T[]> => {
    try {
        const colRef = collection(db, collectionName);
        const constraints: QueryConstraint[] = [];

        if (options?.filters) {
            options.filters.forEach(filter => constraints.push(where(filter[0], filter[1], filter[2])));
        }
        if (options?.orderBy) {
            constraints.push(orderBy(options.orderBy[0], options.orderBy[1]));
        }
        if (options?.limit) {
            constraints.push(firestoreLimit(options.limit));
        }

        const q = query(colRef, ...constraints);
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as T));
    } catch (error) {
        console.error(`Error fetching ${collectionName}: `, error);
        return [];
    }
};

// Generic function to add a document to a collection
const addDocument = async <T extends object>(collectionName: string, data: T) => {
    try {
        const docRef = await addDoc(collection(db, collectionName), data);
        return { id: docRef.id, ...data } as T & {id: string};
    } catch (error) {
        console.error(`Error adding document to ${collectionName}:`, error);
        return null;
    }
}

// User Functions
export const getUsers = (): Promise<User[]> => getCollectionData<User>('users');
export const getUserById = async (id: string): Promise<User | null> => {
    const docRef = doc(db, "users", id);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } as User : null;
}
export const getUserByEmail = async (email: string): Promise<User | null> => {
    const users = await getCollectionData<User>('users', { filters: [['email', '==', email.toLowerCase()]], limit: 1 });
    return users.length > 0 ? users[0] : null;
};
export const addUser = (data: Omit<User, 'id'>): Promise<(User & {id: string}) | null> => addDocument<Omit<User, 'id'>>('users', data);
export const updateUserStatus = async (id: string, status: 'Active' | 'Suspended'): Promise<void> => {
    const userRef = doc(db, 'users', id);
    await updateDoc(userRef, { status });
};
export const updateUserPoints = async (id: string, pointsToAdd: number): Promise<void> => {
    const userRef = doc(db, 'users', id);
    await updateDoc(userRef, { points: increment(pointsToAdd) });
};
export const updateUserAvatar = async (id: string, avatar: string): Promise<void> => {
    const userRef = doc(db, 'users', id);
    await updateDoc(userRef, { avatar });
};

// Withdrawal Functions
export const getWithdrawals = (options?: { filters?: [string, any, any][], limit?: number, orderBy?: [string, 'asc' | 'desc'] }): Promise<Withdrawal[]> => getCollectionData<Withdrawal>('withdrawals', options);
export const getWithdrawalsForUser = (userId: string): Promise<Withdrawal[]> => getCollectionData<Withdrawal>('withdrawals', { filters: [['userId', '==', userId]] });
export const addWithdrawal = (data: Omit<Withdrawal, 'id'>): Promise<(Withdrawal & {id: string}) | null> => addDocument<Omit<Withdrawal, 'id'>>('withdrawals', data);
export const updateWithdrawalStatus = async (id: string, status: 'Pending' | 'Completed' | 'Rejected'): Promise<void> => {
    const withdrawalRef = doc(db, 'withdrawals', id);
    await updateDoc(withdrawalRef, { status });
};

// Task Functions
export const getTasks = (): Promise<Task[]> => getCollectionData<Task>('tasks');
export const addTask = (data: Omit<Task, 'id'>) => addDocument('tasks', data);
export const updateTask = async (id: string, data: Partial<Task>): Promise<void> => {
    const taskRef = doc(db, 'tasks', id);
    await updateDoc(taskRef, data);
};
export const deleteTask = async (id: string): Promise<void> => {
    const taskRef = doc(db, 'tasks', id);
    await deleteDoc(taskRef);
};

// Payment Method Functions
export const getPaymentMethods = (options?: { filters?: [string, any, any][] }): Promise<PaymentMethod[]> => getCollectionData<PaymentMethod>('paymentMethods', options);
export const addPaymentMethod = (data: Omit<PaymentMethod, 'id'>) => addDocument('paymentMethods', data);
export const updatePaymentMethod = async (id: string, data: Partial<PaymentMethod>): Promise<void> => {
    const methodRef = doc(db, 'paymentMethods', id);
    await updateDoc(methodRef, data);
};
export const deletePaymentMethod = async (id: string): Promise<void> => {
    const methodRef = doc(db, 'paymentMethods', id);
    await deleteDoc(methodRef);
};

// Point History Functions
export const getAllPointHistory = (): Promise<PointTransaction[]> => getCollectionData<PointTransaction>('pointHistory', { orderBy: ['date', 'desc'] });
export const getPointHistoryForUser = async (userId: string): Promise<PointTransaction[]> => {
    const history = await getCollectionData<PointTransaction>('pointHistory', { filters: [['userId', '==', userId]] });
    return history.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};
export const addPointTransaction = (data: Omit<PointTransaction, 'id'>): Promise<(PointTransaction & {id: string}) | null> => addDocument<Omit<PointTransaction, 'id'>>('pointHistory', data);


// Settings Functions
export const getMinWithdrawal = async (): Promise<number> => {
    const docRef = doc(db, "settings", "withdrawals");
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        return docSnap.data().minWithdrawal || 1000;
    }
    return 1000;
};
export const saveMinWithdrawal = async (amount: number) => {
    const docRef = doc(db, "settings", "withdrawals");
    await updateDoc(docRef, { minWithdrawal: amount });
};

// Notification Functions
export const getNotificationsForUser = async (userId: string): Promise<Notification[]> => {
    const notifications = await getCollectionData<Notification>('notifications', {
        filters: [['userId', '==', userId]],
    });
    return notifications.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};
export const addNotification = (data: Omit<Notification, 'id'>) => addDocument<Omit<Notification, 'id'>>('notifications', data);
export const markNotificationsAsRead = async (userId: string) => {
    const q = query(collection(db, "notifications"), where("userId", "==", userId), where("read", "==", false));
    const querySnapshot = await getDocs(q);
    const batch = writeBatch(db);
    querySnapshot.docs.forEach(doc => {
        batch.update(doc.ref, { read: true });
    });
    await batch.commit();
};

// Task Completion Functions
export const getUserTaskCompletion = async (userId: string, taskId: string): Promise<UserTaskCompletion | null> => {
    const q = query(collection(db, "userTaskCompletions"), where("userId", "==", userId), where("taskId", "==", taskId), firestoreLimit(1));
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
        return null;
    }
    const doc = querySnapshot.docs[0];
    return { id: doc.id, ...doc.data() } as UserTaskCompletion;
};

export const recordTaskCompletion = async (userId: string, taskId: string, earnedPoints: number): Promise<void> => {
    const existingCompletion = await getUserTaskCompletion(userId, taskId);
    const now = new Date();

    if (existingCompletion) {
        const firstCompletionTime = new Date(existingCompletion.firstCompletionTimestamp).getTime();
        // Check if 24 hours have passed
        if (now.getTime() - firstCompletionTime > 24 * 60 * 60 * 1000) {
            // Reset the record
            const completionRef = doc(db, 'userTaskCompletions', existingCompletion.id);
            await updateDoc(completionRef, {
                count: 1,
                firstCompletionTimestamp: now.toISOString(),
                lastEarnedPoints: earnedPoints
            });
        } else {
            // Increment the count
            const completionRef = doc(db, 'userTaskCompletions', existingCompletion.id);
            await updateDoc(completionRef, {
                count: increment(1),
                lastEarnedPoints: earnedPoints
            });
        }
    } else {
        // Create new record
        await addDoc(collection(db, "userTaskCompletions"), {
            userId,
            taskId,
            count: 1,
            firstCompletionTimestamp: now.toISOString(),
            lastEarnedPoints: earnedPoints
        });
    }
};

export const resetUserTasks = async (userId: string): Promise<void> => {
    const q = query(collection(db, 'userTaskCompletions'), where('userId', '==', userId));
    const querySnapshot = await getDocs(q);
    const batch = writeBatch(db);
    querySnapshot.docs.forEach(doc => {
        batch.delete(doc.ref);
    });
    await batch.commit();
};


// Deletion Functions
export const deleteUserAndData = async (userId: string) => {
    const batch = writeBatch(db);
    
    // Delete user doc
    const userRef = doc(db, 'users', userId);
    batch.delete(userRef);

    // Find and delete withdrawals
    const withdrawalsQuery = query(collection(db, 'withdrawals'), where('userId', '==', userId));
    const withdrawalsSnapshot = await getDocs(withdrawalsQuery);
    withdrawalsSnapshot.forEach(doc => batch.delete(doc.ref));

    // Find and delete point history
    const pointsQuery = query(collection(db, 'pointHistory'), where('userId', '==', userId));
    const pointsSnapshot = await getDocs(pointsQuery);
    pointsSnapshot.forEach(doc => batch.delete(doc.ref));

    // Find and delete notifications
    const notificationsQuery = query(collection(db, 'notifications'), where('userId', '==', userId));
    const notificationsSnapshot = await getDocs(notificationsQuery);
    notificationsSnapshot.forEach(doc => batch.delete(doc.ref));
    
    // Find and delete task completions
    const taskCompletionsQuery = query(collection(db, 'userTaskCompletions'), where('userId', '==', userId));
    const taskCompletionsSnapshot = await getDocs(taskCompletionsQuery);
    taskCompletionsSnapshot.forEach(doc => batch.delete(doc.ref));

    await batch.commit();
};
