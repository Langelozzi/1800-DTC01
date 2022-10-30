//----------------------------------------
//  Your web app's Firebase configuration
//----------------------------------------
var firebaseConfig = {
    apiKey: "AIzaSyBBjVfkrOS08UejwJ3VVmvipigxTpmDJjo",
    authDomain: "comp1800-sayitforward.firebaseapp.com",
    projectId: "comp1800-sayitforward",
    storageBucket: "comp1800-sayitforward.appspot.com",
    messagingSenderId: "788028643245",
    appId: "1:788028643245:web:b9c9c87c738dbf7305f324"
};

//--------------------------------------------
// initialize the Firebase app
// initialize Firestore database if using it
//--------------------------------------------
const app = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();