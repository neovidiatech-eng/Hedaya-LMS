importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

const urlParams = new URLSearchParams(location.search);
const configParam = urlParams.get('config');

if (configParam) {
  const firebaseConfig = JSON.parse(decodeURIComponent(configParam));
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
}
