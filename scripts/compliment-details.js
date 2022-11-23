function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

function chooseReceiver(userId, type) {
    const usersRef = db.collection("users");

    return usersRef.get().then((querySnapshot) => {
        let allUserIds = [];
        let backupUserIds = [];
        querySnapshot.forEach((doc) => {
            allUserIds.push([doc.id, doc.data().preferredComplimentType]);
            backupUserIds.push([doc.id, doc.data().preferredComplimentType]);
        });
        console.log("Type is:" + type);
        if (allUserIds.length == 1) {
            return allUserIds[0];
        } else {
            // remove sender's id from list
            let possibleReceiverIds = allUserIds;

            for (let i = 0; i < allUserIds.length; i++) {
                if (possibleReceiverIds[i][1] != type && possibleReceiverIds[i][1] != null && possibleReceiverIds[i][1] != "none") {
                    console.log(possibleReceiverIds[i][1]);
                    possibleReceiverIds.splice(i, 1);
                    console.log("Removed " + allUserIds[i][0] + " from possible receivers");
                }
            }

            if (possibleReceiverIds.length <= 1) {
                console.log("Using backup Ids");
                possibleReceiverIds = backupUserIds;

                for (let i = 0; i < backupUserIds.length; i++) {
                    if (possibleReceiverIds[i][0] == userId) {
                        possibleReceiverIds.splice(i, 1);
                    }
                }
            } else {
                for (let i = 0; i < allUserIds.length; i++) {
                    if (possibleReceiverIds[i][0] == userId) {
                        possibleReceiverIds.splice(i, 1);
                    }
                }
            }

            // change this with better algorithm that looks at how many compliments user received so far
            let receiverIndex = getRandomInt(allUserIds.length - 1);

            return possibleReceiverIds[receiverIndex];
        }
    })
}

function createNewChainDocument(userId, messageId) {
    const chainsRef = db.collection("chains");

    // get current date
    const currentDate = firebase.firestore.Timestamp.now();

    return chainsRef.add({
        starterId: userId,
        messages: [messageId],
        createdAt: currentDate
    })
}

function createNewMessageDocument(senderId, receiverId, complimentId) {
    const messagesRef = db.collection("messages");

    // get current date
    const currentDate = firebase.firestore.Timestamp.now();

    return messagesRef.add({
        senderId: senderId,
        receiverId: receiverId,
        complimentId: complimentId,
        emojiId: null,
        sendAt: currentDate,
        openedAt: null,
        reactedTo: false,
        paidForward: false
    })
}

function sendMessage(complimentId, type) {
    // get current user from firebase auth
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            // get random user id from firestore users collection
            chooseReceiver(user.uid, type).then((receiverId) => {
                createNewMessageDocument(user.uid, receiverId, complimentId)
                    .then((newMessageRef) => {
                        // add one to users number of compliments sent
                        db.collection("users").doc(user.uid).update({
                            complimentsSent: firebase.firestore.FieldValue.increment(1)
                        });
                        // add one to amountSent for that compliment
                        db.collection("compliments").doc(complimentId).update({
                            amountSent: firebase.firestore.FieldValue.increment(1)
                        });

                        createNewChainDocument(user.uid, newMessageRef.id)
                            .then((newChainRef) => {
                                // add one to users number of chains started
                                db.collection("users").doc(user.uid).update({
                                    chainsStarted: firebase.firestore.FieldValue.increment(1)
                                });

                                // add the chain id to the message
                                db.collection("messages").doc(newMessageRef.id).update({
                                    chainId: newChainRef.id
                                });

                                // open success modal and redirect to browse page
                                $('#success-modal').modal('show');
                                setTimeout(() => {
                                    $('#success-modal').modal('hide');
                                    window.location.href = "browse.html";
                                }, 4000);

                            }).catch((error) => {
                                console.error("Error adding new chain document: ", error);

                                // open error modal
                                $('#error-modal').modal('show');
                                setTimeout(() => {
                                    $('#error-modal').modal('hide');
                                }, 4000);
                            });;

                    })
                    .catch((error) => {
                        console.error("Error adding new message (compliment) document: ", error);

                        // open error modal
                        $('#error-modal').modal('show');
                        setTimeout(() => {
                            $('#error-modal').modal('hide');
                        }, 4000);
                    });
            })

        } else {
            console.log("no user");
        }
    });

}

function populateComplimentData(complimentId) {
    db.collection('compliments').doc(complimentId).get().then((data) => {
        const complimentData = data.data();

        $('#compliment-text').html(`"${complimentData.compliment}"`);
        $('#compliment-type').html(complimentData.type);
    })
}

function setUp() {
    // get compliment id from html or query param
    const urlParams = new URLSearchParams(window.location.search);
    const complimentId = urlParams.get('complimentId');

    populateComplimentData(complimentId);

    $('#send-btn').click(() => {
        db.collection('compliments').doc(complimentId).get().then((data) => {
            const complimentData = data.data();

            sendMessage(complimentId, complimentData.type);
        });
    });
}

$(document).ready(setUp);