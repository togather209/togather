import { createContext, useContext, useEffect, useState } from "react";
import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: import.meta.env.VITE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_APP_ID,
  measurementId: import.meta.env.VITE_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

const FirebaseContext = createContext();

export const FirebaseProvider = ({ children }) => {
  const [fcmToken, setFcmToken] = useState(null);

  const requestPermission = async () => {

    const permission = await Notification.requestPermission();
    if (permission === "denied") {
      return;
    }


    const token = await getToken(messaging, {
      vapidKey: import.meta.env.VITE_VAPID_KEY,
    });

    if (token) {
      setFcmToken(token);
    }
  };

  const onMessageListener = () =>
    new Promise((resolve, reject) => {
      onMessage(messaging, (payload) => {
        resolve(payload);
      }, (error) => {
        reject(error);
      });
    });

  useEffect(() => {
    requestPermission();
  }, []);

  return (
    <FirebaseContext.Provider value={{ fcmToken, onMessageListener }}>
      {children}
    </FirebaseContext.Provider>
  );
};

export const useFirebase = () => {
  const context = useContext(FirebaseContext);
  if (!context) {
    throw new Error("useFirebase must be used within a FirebaseProvider");
  }
  return context;
};
