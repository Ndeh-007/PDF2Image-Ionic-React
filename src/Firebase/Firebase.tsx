import React from "react";
// Import the functions you need from the SDKs you need
import firebase from "firebase"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCVI_kylsPS0XjicHbelhxYAuQIWTwcEqo",
  authDomain: "learning-76483.firebaseapp.com",
  databaseURL: "https://learning-76483-default-rtdb.firebaseio.com",
  projectId: "learning-76483",
  storageBucket: "learning-76483.appspot.com",
  messagingSenderId: "134716710728",
  appId: "1:134716710728:web:dacf7989cf34991ab1dd7d",
  measurementId: "G-KSR4C27XJS"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const storage = firebase.storage();
const firestore = firebase.firestore();

export {storage,app,firestore}

