var userId;

function populateInboxData() {
    const messagesRef = db.collection('messages');
    const complimentRef = db.collection('compliments');

    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            userId = user.uid;

            messagesRef.get().then((data) => {
                data.forEach(message => {
                    let messageData = message.data();
                    let complimentType = messageData.complimentId;
                    let chainId = messageData.chainId;
                    if (messageData.receiverId == userId) {
                        complimentRef.doc(messageData.complimentId).get().then((compliment) => {
                            let messageText = compliment.data().compliment;
                            let messageSentAtDate = messageData.sendAt.toDate().toDateString();

                            var template = document.getElementById('inbox-card-template');
                            var clone = template.content.cloneNode(true);
                            console.log(chainId);
                            clone.querySelector('#inbox-compliment-text').innerHTML = `"${messageText}"`;
                            clone.querySelector('#inbox-send-at').innerHTML = messageSentAtDate;
                            clone.querySelector('#inbox-card')
                                .setAttribute('href', `../message-details.html?complimentId=${complimentType}&chainId=${chainId}&receiverId=${messageData.receiverId}`);

                            $('#inbox-card-list').append(clone);
                        })

                    }
                });
            })
        } else {
            console.log("no user");
        }
    });
}

// function receiveMessage() {

//     // get current date
//     const currentDate = firebase.firestore.Timestamp.now();

//     firebase.auth().onAuthStateChanged(function (user) {
//         if (user) {
//             populateInboxData(messagesRef)
//             .then((messagesRef) => {
//                 // add opened time to message
//                 // add one to users number of compliments received
//                 db.collection("messages").doc(messagesRef).update({
//                     openedAt: firebase.firestore.FieldValue.update(currentDate)
//                 });

//                 db.collection("users").doc(user.uid).update({
//                     complimentsReceived: firebase.firestore.FieldValue.increment(1)
//                 });

//             })
//             .catch((error) => {
//                 console.error("Error adding new message document: ", error);
//             })
//         } else {
//             console.log("no user");
//         }
//     });

// }

function setUp() {
    populateInboxData();
}

$(document).ready(setUp);


