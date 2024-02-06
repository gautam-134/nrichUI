importScripts('https://www.gstatic.com/firebasejs/9.1.3/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.1.3/firebase-messaging-compat.js');
firebase.initializeApp({
  apiKey: "AIzaSyBCqhAfU6KVY8hg1mzUDn5ebiefplaoGcQ",
  authDomain: "nrichnotifications.firebaseapp.com",
  projectId: "nrichnotifications",
  storageBucket: "nrichnotifications.appspot.com",
  messagingSenderId: "244631308103",
  appId: "1:244631308103:web:5648306f7c7d8d0bc7ee62",
  measurementId: "G-ZMHWQ087S5"
});

const message = firebase
  .messaging()
