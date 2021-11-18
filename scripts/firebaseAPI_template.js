// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA7MXZoaFeMaE2YJcGSql8dVZfAMSyD7vU",
  authDomain: "soliclarity-dbb49.firebaseapp.com",
  projectId: "soliclarity-dbb49",
  storageBucket: "soliclarity-dbb49.appspot.com",
  messagingSenderId: "468461573919",
  appId: "1:468461573919:web:d5b87a2513a2b494b9c22a"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();