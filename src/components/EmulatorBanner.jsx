import { getAuth, signOut } from 'firebase/auth';

const EmulatorBanner = () => {
  const handleExitEmulator = async () => {
    const auth = getAuth();

    try {
      await signOut(auth);
      localStorage.clear(); // Optional: clear cached user/session data
      sessionStorage.clear(); // Clear session as well
      window.location.reload(); // Reload the app to reset state
    } catch (error) {
      console.error('Error signing out from emulator:', error.message);
    }
  };

  return (
    <div style={{
      backgroundColor: '#FFCC00',
      color: '#000',
      padding: '10px 16px',
      textAlign: 'center',
      fontWeight: 'bold',
      position: 'sticky',
      top: 0,
      zIndex: 9999,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }}>
      <span>⚠️ You are using Firebase Emulator Mode</span>
      <button
        onClick={handleExitEmulator}
        style={{
          marginLeft: 'auto',
          backgroundColor: '#000',
          color: '#FFF',
          border: 'none',
          padding: '6px 12px',
          cursor: 'pointer',
          fontWeight: 'bold',
          borderRadius: '4px'
        }}
      >
        Exit Emulator
      </button>
    </div>
  );
};

export default EmulatorBanner;
