var ui = new firebaseui.auth.AuthUI(firebase.auth());

var uiConfig = {
    callbacks: {
        // Create a new user doc in firestore if it is a new user
        signInSuccessWithAuthResult: function (authResult, redirectUrl) {
            var user = authResult.user;
            // Write new user document to Firestore if user is new                         
            if (authResult.additionalUserInfo.isNewUser) {
                db.collection("users").doc(user.uid).set({
                    name: user.displayName,
                    email: user.email,
                    preferredComplimentType: null,
                    chainsStarted: 0,
                    complimentsSent: 0,
                    emojisSent: 0,
                    city: null,
                    country: null,
                    // Redirect to main page after sign-in
                }).then(() => {
                    console.log("New user added to firestore");
                    window.location.assign("main.html");
                }).catch((error) => {
                    console.log("Error adding new user: " + error);
                });
            }
            else {
                return true;
            }
            return false;
        },
        // remove loader once auth component loads
        uiShown: function () {
            document.getElementById('loader').style.display = 'none';
        }
    },
    signInFlow: 'popup',
    signInSuccessUrl: 'main.html',
    signInOptions: [
        firebase.auth.EmailAuthProvider.PROVIDER_ID,
    ],
};

// render the firebase auth ui
ui.start('#firebaseui-auth-container', uiConfig);