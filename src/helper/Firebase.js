import firebase from "firebase/app";
import "firebase/auth";
import '@firebase/firestore'

const firebaseConfig = {
    apiKey: "AIzaSyA4nPYvdc-ZK3J02U5HPvJ3CmJXcbk3uH8",
    authDomain: "scdapp-6e784.firebaseapp.com",
    projectId: "scdapp-6e784",
    storageBucket: "scdapp-6e784.appspot.com",
    messagingSenderId: "1016965711848",
    appId: "1:1016965711848:web:e8ecfe7193c06c8b2e465d",
    measurementId: "G-YFLE338FS1"
  };

var app = firebase.initializeApp(firebaseConfig);
export var db = firebase.firestore(app);
export const auth = firebase.auth()


