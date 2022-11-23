var currentUser

function populateInfo() {
    firebase.auth().onAuthStateChanged(user => {
        // Check if user is signed in:
        if (user) {

            //go to the correct user document by referencing to the user uid
            currentUser = db.collection("users").doc(user.uid)
            //get the document for current user.
            currentUser.get()
                .then(userDoc => {
                    //get the data fields of the user
                    var userPreferredType = userDoc.data().preferredComplimentType;

                    //if the data fields are not empty, then write them in to the form.
                    if (userPreferredType != null) {
                        $('#preferredComplimentType').val(userPreferredType);
                    }
                })
        } else {
            // No user is signed in.
            console.log("No user is signed in");
        }
    });
}

function editUserInfo() {
    //Enable the form fields
    $('#personalInfoFields').prop('disabled', false);
}//event-listener that call the function editUserInfo after clicking on the button.

function saveUserInfo() {
    userPreferredType = $('#preferredComplimentType').val();

    currentUser.update({
        preferredComplimentType: userPreferredType
    })
        .then(() => {
            console.log("Document successfully updated!");
        })
    $('#personalInfoFields').prop('disabled', true);
}

function setUp() {
    populateInfo();
}

$(document).ready(setUp);