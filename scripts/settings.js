/**
 * Populate the current user info into form.
 */
function populateInfo() {
    firebase.auth().onAuthStateChanged(async (user) => {
        // Check if user is signed in:
        if (user) {

            //go to the correct user document by referencing to the user uid
            const currentUserDoc = await db.collection("users").doc(user.uid).get();

            //get the data fields of the user
            var userPreferredType = currentUserDoc.data().preferredComplimentType;

            //if the data fields are not empty, then write them in to the form.
            if (userPreferredType != null) {
                $('#preferredComplimentType').val(userPreferredType);
            }
        }
        else {
            console.log("no user");

            // redirect to login page if no user is logged in
            window.location.href = "../html/login.html";
        }
    });
}

/**
 * Enable the form for editing.
 */
function editUserInfo() {
    //Enable the form fields
    $('#personal-info-fields').prop('disabled', false);
}//event-listener that call the function editUserInfo after clicking on the button.

/**
 * Save the form data into the user's firestore document.
 */
function saveUserInfo() {
    userPreferredType = $('#preferredComplimentType').val();

    firebase.auth().onAuthStateChanged(async (user) => {
        if (user) {
            const currentUserDoc = await db.collection("users").doc(user.uid);

            currentUserDoc.update({
                preferredComplimentType: userPreferredType
            }).then(() => {
                console.log("Document successfully updated!");
            })
            $('#personal-info-fields').prop('disabled', true);
        }
        else {
            console.log("no user");

            // redirect to login page if no user is logged in
            window.location.href = "../html/login.html";
        }
    })
}

/**
 * Load the current user data and set event listeners.
 */
function setUp() {
    populateInfo();

    $('#edit-btn').click(() => {
        editUserInfo()
    });

    $('#save-btn').click(() => {
        saveUserInfo()
    });
}

// Call set up function once the document has loaded
$(document).ready(setUp);