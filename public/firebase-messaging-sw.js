importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

const firebaseConfig = {
  apiKey: "AIzaSyAv4cSCrFD9fddrVDol7kZIFMulHzjMICE",
  authDomain: "hedaya-notifications.firebaseapp.com",
  projectId: "hedaya-notifications",
  storageBucket: "hedaya-notifications.firebasestorage.app",
  messagingSenderId: "45798723333",
  appId: "1:45798723333:web:c31684ce8c9778ccc8316c",
  measurementId: "G-JTY340BHG4"
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/logo.png'
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
