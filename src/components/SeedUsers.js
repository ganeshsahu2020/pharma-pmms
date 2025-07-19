import { db } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';

async function SeedUsers() {
  const users = [
    { email: 'user1@example.com', createdAt: new Date().toISOString() },
    { email: 'user2@example.com', createdAt: new Date().toISOString() }
  ];

  try {
    for (const user of users) {
      await addDoc(collection(db, 'users'), user);
    }
    console.log('Users seeded successfully');
  } catch (err) {
    console.error('Error seeding users:', err);
  }
}

export default SeedUsers;