import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import 'firebase/storage';

firebase.initializeApp({
  apiKey: 'AIzaSyAGhQYp2qVcfL9P5bq0Upncc-N_IsXm93I',
  authDomain: 'organizer-9f1de.firebaseapp.com',
  databaseURL: 'https://organizer-9f1de-default-rtdb.europe-west1.firebasedatabase.app',
  projectId: 'organizer-9f1de',
  storageBucket: 'organizer-9f1de.appspot.com',
  messagingSenderId: '934898720370',
  appId: '1:934898720370:web:af9d1f0b690b5d9d7baceb',
  measurementId: 'G-7WCNLW8E7N',
});

const auth = firebase.auth();
const database = firebase.database();
const storage = firebase.storage();

export { auth, database, storage };
