function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

function chooseReceiver(userId) {
    const usersRef = db.collection("users");

    return usersRef.get().then((querySnapshot) => {
        let allUserIds = [];
        querySnapshot.forEach((doc) => {
            allUserIds.push(doc.id);
        });

        if (allUserIds.length == 1) {
            return allUserIds[0];
        } else {
            // remove sender's id from list
            const possibleReceiverIds = allUserIds.filter(id => id != userId);

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
        openedAt: null
    })
}

function sendMessage(complimentId) {
    // get current user from firebase auth
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            // get random user id from firestore users collection
            chooseReceiver(user.uid).then((receiverId) => {
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
        sendMessage(complimentId);
    });
}

$(document).ready(setUp);