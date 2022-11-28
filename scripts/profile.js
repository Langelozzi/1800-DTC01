/**
 * Populate the form with the info in the logged in users document from firestore.
 */
function populateInfo() {
    firebase.auth().onAuthStateChanged(async (user) => {
        // Check if user is signed in:
        if (user) {
            //go to the correct user document by referencing to the user uid
            const currentUserDoc = await db.collection("users").doc(user.uid).get();
            //get the data fields of the user
            var userName = currentUserDoc.data().name;
            var userEmail = currentUserDoc.data().email;
            var userCity = currentUserDoc.data().city;
            var userCountry = currentUserDoc.data().country;

            //if the data fields are not empty, then write them in to the form.
            if (userName != null) {
                $('#nameInput').val(userName);
            }
            if (userEmail != null) {
                $('#emailInput').val(userEmail);
            }
            if (userCity != null) {
                $('#cityInput').val(userCity);
            }
            if (userCountry != null) {
                $('#countryInput').val(userCountry);
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
 * Enable form fields for editing.
 */
function editUserInfo() {
    // Enable the form fields
    $('#personalInfoFields').prop('disabled', false);
}// event-listener that call the function editUserInfo after clicking on the button.

/**
 * Update user info in firestore with values from form.
 */
function saveUserInfo() {
    userName = $('#nameInput').val();
    userSchool = $('#emailInput').val();
    userCity = $('#cityInput').val();
    userCountry = $('#countryInput').val();

    currentUser.update({
        name: userName,
        school: userSchool,
        city: userCity,
        country: userCountry
    }).then(() => {
        console.log("Document successfully updated!");
    })

    $('#personalInfoFields').prop('disabled', true);
}

/**
 * Run functions that will be called on page load.
 */
function setUp() {
    populateInfo();
}

// Call set up function once the document has loaded
$(document).ready(setUp);