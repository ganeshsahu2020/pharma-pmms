import { useEffect } from 'react';
import {
  connectAuthEmulator,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  setPersistence,
  browserLocalPersistence
} from 'firebase/auth';
import { auth } from '../firebase';

function AutoLoginEmulator() {
  useEffect(() => {
    const hostname = window.location.hostname;

    // ✅ Emulator mode check
    if (hostname === 'localhost') {
      try {
        connectAuthEmulator(auth, 'http://localhost:9099', { disableWarnings: true });

        // Set persistent login in local browser storage
        setPersistence(auth, browserLocalPersistence).then(() => {
          // Try signing in with known test credentials
          signInWithEmailAndPassword(auth, 'ganeshchsahu2020@gmail.com', 'User!12345')
            .catch(async (err) => {
              if (err.code === 'auth/user-not-found') {
                // Auto-create test user if not exists
                await createUserWithEmailAndPassword(auth, 'ganeshchsahu2020@gmail.com', 'User!12345');
              } else {
                console.error('🚫 Emulator Login failed:', err.message);
              }
            });
        });
      } catch (error) {
        console.error('⚠️ Emulator auth setup error:', error.message);
      }
    }
  }, []);

  return null;
}

export default AutoLoginEmulator;
