import  fb from 'firebase/app';
import "firebase/auth";
import "firebase/database";
import 'firebase/storage';
import 'firebase/firestore';

// BEGINNING OF PART TO EDIT
 
var firebaseConfig = {
  apiKey: "",
  authDomain: "",
  databaseURL: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: "",
  measurementId: ""
};

const geoapify = {
  apiKey: ''
};

const emailjskey = {
  userkey: '',
  servicekey:'',
  templatekey_hostrequest:'',
  templatekey_feedback:'',
};

// END OF PART TO EDIT

const firebaseApp = fb.initializeApp(firebaseConfig);

const firebase = {
  app: firebaseApp,
  auth: firebaseApp.auth(),
  db: firebaseApp.database(),
  fs: firebaseApp.firestore(),
  storage: firebaseApp.storage()
};

export {
  firebase,
  geoapify,
  emailjskey
};