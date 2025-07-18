import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics, isSupported } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: 'AIzaSyDX6z8pAb0pgd3Z6vhiQU0nc_xe0krzKJU',
  authDomain: 'pharma-pmms-2025.firebaseapp.com',
  projectId: 'pharma-pmms-2025',
  storageBucket: 'pharma-pmms-2025.appspot.com',
  messagingSenderId: '245838175947',
  appId: '1:245838175947:web:20d2f5569f1c5f008d454e'
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

if (typeof window !== 'undefined') {
  isSupported()
    .then((supported) => {
      if (supported) getAnalytics(app);
    })
    .catch((err) => {
      console.warn('Analytics not supported:', err.message);
    });
}

export { app, auth, db };
