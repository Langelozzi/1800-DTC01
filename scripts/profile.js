/**
 * Populate the form with the info in the logged in users document from firestore.
 */
function populateInfo() {
    firebase.auth().onAuthStateChanged(async (user) => {
        // Check if user is signed in:
        if (user) {
            // Go to the correct user document by referencing to the user uid
            const currentUserDoc = await db.collection("users").doc(user.uid).get();
            // Get the data fields of the user
            var userName = currentUserDoc.data().name;
            var userEmail = currentUserDoc.data().email;
            var userCity = currentUserDoc.data().city;
            var userCountry = currentUserDoc.data().country;

            // If the data fields are not empty, then write them in to the form.
            if (userName != null) {
                $('#name-input').val(userName);
            }
            if (userEmail != null) {
                $('#email-input').val(userEmail);
            }
            if (userCity != null) {
                $('#city-input').val(userCity);
            }
            if (userCountry != null) {
                $('#country-input').val(userCountry);
            }
        }
        else {
            console.log("no user");

            // Redirect to login page if no user is logged in
            window.location.href = "../html/login.html";
        }
    });
}

/**
 * Enable form fields for editing.
 */
function editUserInfo() {
    // Enable the form fields
    $('#personal-info-fields').prop('disabled', false);
}// Event-listener that call the function editUserInfo after clicking on the button.

/**
 * Update user info in firestore with values from form.
 */
function saveUserInfo() {
    userName = $('#name-input').val();
    userSchool = $('#email-input').val();
    userCity = $('#city-input').val();
    userCountry = $('#country-input').val();

    firebase.auth().onAuthStateChanged(async (user) => {
        if (user) {
            const currentUserDoc = await db.collection("users").doc(user.uid);

            currentUserDoc.update({
                name: userName,
                school: userSchool,
                city: userCity,
                country: userCountry
            }).then(() => {
                console.log("Document successfully updated!");
            })
            $('#personal-info-fields').prop('disabled', true);
        }
        else {
            console.log("no user");

            // Redirect to login page if no user is logged in
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