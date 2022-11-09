

function populateInboxData(messagesRef) {
    db.collection('messages').doc(messagesRef).get()
    const inboxData = data.data();

    let inboxMessages = [];

    for (let i = 0; i < inboxData.length; i++) {

        if (inboxData[i].receiverId == user.uid) {

            $('#inbox-compliment-text').html(`"${inboxData.complimentId.compliment}"`);
            $('#inbox-send-at').html(inboxData.sendAt);
        } else {
            console.log("no messages to this user")
        }
    }

}

function receiveMessage() {

    // get current date
    const currentDate = firebase.firestore.Timestamp.now();

    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            populateInboxData(messagesRef)
            // .then((messagesRef) => {
            //     // add opened time to message
            //     // add one to users number of compliments received
            //     db.collection("messages").doc(messagesRef).update({
            //         openedAt: firebase.firestore.FieldValue.update(currentDate)
            //     });

            //     db.collection("users").doc(user.uid).update({
            //         complimentsReceived: firebase.firestore.FieldValue.increment(1)
            //     });

            // })
            // .catch((error) => {
            //     console.error("Error adding new message document: ", error);
            // })
        } else {
            console.log("no user");
        }
    });

}

function setUp() {
    // get message id from db
    const urlParams = new URLSearchParams(window.location.search);
    const senderId = urlParams.get('senderId');
    const complimentId = urlParams.get('complimentId');

    populateInboxData(user.uid, senderId, complimentId);

}

$(document).ready(setUp);


