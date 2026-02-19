import { db } from '../firebase';
import { collection, addDoc, getDocs, deleteDoc, doc, query, orderBy, Timestamp } from 'firebase/firestore';

// Save a summary to Firestore
export const saveSummary = async (userId, notes, summary) => {
  try {
    const summariesRef = collection(db, 'users', userId, 'summaries');
    const docRef = await addDoc(summariesRef, {
      notes: notes,
      summary: summary,
      createdAt: Timestamp.now()
    });
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error('Error saving summary:', error);
    return { success: false, error: error.message };
  }
};

// Get all summaries for a user
export const getSummaries = async (userId) => {
  try {
    const summariesRef = collection(db, 'users', userId, 'summaries');
    const q = query(summariesRef, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    
    const summaries = [];
    querySnapshot.forEach((doc) => {
      summaries.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return { success: true, summaries };
  } catch (error) {
    console.error('Error getting summaries:', error);
    return { success: false, error: error.message };
  }
};

// Delete a summary
export const deleteSummary = async (userId, summaryId) => {
  try {
    const summaryRef = doc(db, 'users', userId, 'summaries', summaryId);
    await deleteDoc(summaryRef);
    return { success: true };
  } catch (error) {
    console.error('Error deleting summary:', error);
    return { success: false, error: error.message };
  }
};