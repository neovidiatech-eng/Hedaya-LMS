import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "hedaya-notifications.firebaseapp.com",
  projectId: "hedaya-notifications",
  storageBucket: "hedaya-notifications.firebasestorage.app",
  messagingSenderId: "45798723333",
  appId: "1:45798723333:web:c31684ce8c9778ccc8316c",
  measurementId: "G-JTY340BHG4"
};

export const app = initializeApp(firebaseConfig);
export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;
export const messaging = typeof window !== 'undefined' ? getMessaging(app) : null;

export const requestForToken = async () => {
  if (!messaging) return null;
  try {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
      await navigator.serviceWorker.ready; // Wait until the SW is active

      const currentToken = await getToken(messaging, { 
        vapidKey: 'BA4BPzY02EzF6gXxO4txqIg-10u__PICjpguvXZKLqokirX65TI0TIwK4fPtcJ_mzQJtF9txH_vsPINCVhlk8Wg',
        serviceWorkerRegistration: registration
      });
      if (currentToken) {
        return currentToken;
      } else {
        console.log('No registration token available. Request permission to generate one.');
      }
    } else {
      console.log('Notification permission denied.');
    }
  } catch (err) {
    console.error('An error occurred while retrieving token. ', err);
  }
  return null;
};

export const onMessageListener = () =>
  new Promise((resolve) => {
    if (!messaging) return;
    onMessage(messaging, (payload: any) => {
      resolve(payload);
    });
  });
