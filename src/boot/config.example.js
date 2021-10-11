import fb from "firebase/app";
import "firebase/auth";
import "firebase/database";
import "firebase/storage";
import "firebase/firestore";

// BEGINNING OF PART TO EDIT

var firebaseConfig = {
  apiKey: "",
  authDomain: "",
  databaseURL: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: "",
  measurementId: "",
};

const geoapify = {
  apiKey: "",
};

const emailjskey = {
  userkey: "",
  servicekey: "",
  templatekey_hostrequest: "",
  templatekey_feedback: "",
};

// END OF PART TO EDIT

const firebaseApp = fb.initializeApp(firebaseConfig);

const appCheck = firebase.appCheck();

appCheck.activate(
  // reCAPTCHA v3 site key (public key) to activate()
  "",
  // Optional argument. If true, the SDK automatically refreshes App Check
  // tokens as needed.
  true);

const firebase = {
  app: firebaseApp,
  auth: firebaseApp.auth(),
  db: firebaseApp.database(),
  fs: firebaseApp.firestore(),
  storage: firebaseApp.storage(),
};

if (location.hostname === "localhost") {
  firebase.db.useEmulator("localhost", 9000);
  firebase.fs.useEmulator("localhost", 8080);
}

export { firebase, geoapify, emailjskey };
