var ui = new firebaseui.auth.AuthUI(firebase.auth());

var uiConfig = {
    callbacks: {
        signInSuccessWithAuthResult: function (authResult, redirectUrl) {
            // User successfully signed in.
            // Return type determines whether we continue the redirect automatically
            // or whether we leave that to developer to handle.
            var user = authResult.user;                            // get the user object from the Firebase authentication database
            if (authResult.additionalUserInfo.isNewUser) {         //if new user
                db.collection("users").doc(user.uid).set({         //write to firestore. We are using the UID for the ID in users collection
                    name: user.displayName,                    //"users" collection
                    email: user.email,                         //with authenticated user's ID (user.uid)
                    preferredComplimentType: null,
                    chainsStarted: 0,
                    complimentsSent: 0,
                    emojisSent: 0,
                    city: null,
                    country: null,
                }).then(() => {
                    console.log("New user added to firestore");
                    window.location.assign("main.html");       //re-direct to main.html after signup
                }).catch((error) => {
                    console.log("Error adding new user: " + error);
                });
            }
            else {
                return true;
            }
            return false;
        },
        uiShown: function () {
            // The widget is rendered.
            // Hide the loader.
            document.getElementById('loader').style.display = 'none';
        }
    },
    // Will use popup for IDP Providers sign-in flow instead of the default, redirect.
    signInFlow: 'popup',
    signInSuccessUrl: 'main.html',
    signInOptions: [
        firebase.auth.EmailAuthProvider.PROVIDER_ID,
    ],
};

ui.start('#firebaseui-auth-container', uiConfig);