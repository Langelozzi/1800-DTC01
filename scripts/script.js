function checkForNotifications() {
    firebase.auth().onAuthStateChanged(async (user) => {
        if (user) {
            hasNotifications = false;

            const messages = await db.collection("messages").get();

            messages.forEach((message) => {
                if (message.data().receiverId == user.uid && message.data().openedAt == null) {
                    hasNotifications = true;
                }
            });

            if (hasNotifications) {
                $('#note-badge').show();
            } else {
                $('#note-badge').hide();
            }
        }
        else {
            console.log("no user");

            // redirect to login page if no user is logged in
            window.location.href = "../html/login.html";
        }
    });
}

$(document).ready(checkForNotifications);