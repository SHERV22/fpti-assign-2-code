import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  orderBy,
  getDocs,
  getDoc,
  setDoc,
  Timestamp,
} from 'firebase/firestore';
import { db } from './config';

/**
 * Add a new transaction
 */
export const addTransaction = async (userId, transactionData) => {
  try {
    const transactionsRef = collection(db, 'users', userId, 'transactions');
    const docRef = await addDoc(transactionsRef, {
      ...transactionData,
      userId,
      date: Timestamp.fromDate(new Date(transactionData.date)),
      createdAt: Timestamp.now(),
    });
    return docRef.id;
  } catch (error) {
    console.error('Error adding transaction:', error);
    throw error;
  }
};

/**
 * Get all transactions for a user
 */
export const getTransactions = async (userId, startDate = null, endDate = null) => {
  try {
    const transactionsRef = collection(db, 'users', userId, 'transactions');
    let q = query(transactionsRef, orderBy('date', 'desc'));

    if (startDate && endDate) {
      q = query(
        transactionsRef,
        where('date', '>=', Timestamp.fromDate(startDate)),
        where('date', '<=', Timestamp.fromDate(endDate)),
        orderBy('date', 'desc')
      );
    }

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      date: doc.data().date.toDate(),
    }));
  } catch (error) {
    console.error('Error getting transactions:', error);
    throw error;
  }
};

/**
 * Get transactions by category
 */
export const getTransactionsByCategory = async (userId, category, startDate, endDate) => {
  try {
    const transactionsRef = collection(db, 'users', userId, 'transactions');
    const q = query(
      transactionsRef,
      where('category', '==', category),
      where('date', '>=', Timestamp.fromDate(startDate)),
      where('date', '<=', Timestamp.fromDate(endDate)),
      orderBy('date', 'desc')
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      date: doc.data().date.toDate(),
    }));
  } catch (error) {
    console.error('Error getting transactions by category:', error);
    throw error;
  }
};

/**
 * Update a transaction
 */
export const updateTransaction = async (userId, transactionId, updatedData) => {
  try {
    const transactionRef = doc(db, 'users', userId, 'transactions', transactionId);
    await updateDoc(transactionRef, {
      ...updatedData,
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    console.error('Error updating transaction:', error);
    throw error;
  }
};

/**
 * Delete a transaction
 */
export const deleteTransaction = async (userId, transactionId) => {
  try {
    const transactionRef = doc(db, 'users', userId, 'transactions', transactionId);
    await deleteDoc(transactionRef);
  } catch (error) {
    console.error('Error deleting transaction:', error);
    throw error;
  }
};

/**
 * Get or create budget for a user
 */
export const getBudget = async (userId) => {
  try {
    const budgetRef = doc(db, 'users', userId, 'budgets', 'current');
    const budgetSnap = await getDoc(budgetRef);

    if (budgetSnap.exists()) {
      return { id: budgetSnap.id, ...budgetSnap.data() };
    }
    return null;
  } catch (error) {
    console.error('Error getting budget:', error);
    throw error;
  }
};

/**
 * Update budget
 */
export const updateBudget = async (userId, budgetData) => {
  try {
    const budgetRef = doc(db, 'users', userId, 'budgets', 'current');
    await updateDoc(budgetRef, {
      ...budgetData,
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    console.error('Error updating budget:', error);
    throw error;
  }
};

/**
 * Create initial budget
 */
export const createBudget = async (userId, budgetData) => {
  try {
    const budgetRef = doc(db, 'users', userId, 'budgets', 'current');
    await setDoc(budgetRef, {
      ...budgetData,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    console.error('Error creating budget:', error);
    throw error;
  }
};

/**
 * Save AI-generated insight
 */
export const saveInsight = async (userId, insightData) => {
  try {
    const insightsRef = collection(db, 'users', userId, 'insights');
    const docRef = await addDoc(insightsRef, {
      ...insightData,
      createdAt: Timestamp.now(),
    });
    return docRef.id;
  } catch (error) {
    console.error('Error saving insight:', error);
    throw error;
  }
};

/**
 * Get recent insights
 */
export const getInsights = async (userId, limit = 10) => {
  try {
    const insightsRef = collection(db, 'users', userId, 'insights');
    const q = query(insightsRef, orderBy('createdAt', 'desc'));

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.slice(0, limit).map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error('Error getting insights:', error);
    throw error;
  }
};
