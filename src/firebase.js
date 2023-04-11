// Import the functions you need from the SDKs you need
import firebase from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import 'firebase/auth';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDWIcMhYCCrw6vzq-ibqX7JpRILJ7rrE2c",
    authDomain: "calendarauthorize.firebaseapp.com",
    projectId: "calendarauthorize",
    storageBucket: "calendarauthorize.appspot.com",
    messagingSenderId: "1081919931196",
    appId: "1:1081919931196:web:027e687e873049528bd439",
    measurementId: "G-G4RNNF9CTV"
};

// Initialize Firebase

firebase.initializeApp(firebaseConfig);

export default firebase;