import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

export const getEmailFromEmployeeId = async (employeeId) => {
  console.log("🔍 Starting Firestore query...");
  console.log("🆔 Input:", employeeId);

  const q = query(
    collection(db, 'users'),
    where('Employee ID', '==', employeeId) // ⚠️ Case + space fixed here
  );

  const snapshot = await getDocs(q);

  console.log("📦 Query complete. Snapshot size:", snapshot.size);

  if (!snapshot.empty) {
    const data = snapshot.docs[0].data();
    console.log("✅ Document found:", data);
    return data.Email; // 🔁 use capital 'E' as seen in Firestore
  }

  console.error("❌ No match found for employeeId:", employeeId);
  throw new Error('Employee ID not found');
};

