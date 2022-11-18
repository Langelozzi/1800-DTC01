function checkForNotifications() {
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            db.collection("messages").get().then((querySnapshot) => {
                hasNotifications = false;
                querySnapshot.forEach((doc) => {
                    if (doc.data().receiverId == user.uid && doc.data().openedAt == null) {
                        hasNotifications = true;
                    }
                });

                if (hasNotifications) {
                    $('#note-badge').show();
                } else {
                    $('#note-badge').hide();
                }
            });
        } else {
            console.log("no user");
        }
    });

}

$(document).ready(checkForNotifications);