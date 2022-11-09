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

    chainsRef.add({
        starterId: userId,
        messages: [messageId],
        createdAt: currentDate
    }).then((newChainRef) => {
        // add one to users number of chains started
        db.collection("users").doc(userId).update({
            chainsStarted: firebase.firestore.FieldValue.increment(1)
        });
    }).catch((error) => {
        console.error("Error adding new chain document: ", error);
    });
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

                        createNewChainDocument(user.uid, newMessageRef.id);

                    })
                    .catch((error) => {
                        console.error("Error adding new message document: ", error);
                    });
            })

        } else {
            console.log("no user");
        }
    });

}

function writeCompliments() {
    //define a variable for the collection you want to create in Firestore to populate data
    var complimentsRef = db.collection("compliments");

    complimentsRef.add({
        compliment: "",
        type: "Character",
    });
    complimentsRef.add({
        compliment: "You're all that and a super-size bag of chips!",
        type: "Personality",
    });
    complimentsRef.add({
        compliment: "How is it that you always look great, even in sweatpants?",
        type: "Physical",
    });
    complimentsRef.add({
        compliment: "This is tough, but you're tougher.",
        type: "Encouragement",
    });
    complimentsRef.add({
        compliment: "",
        type: "Intellectual",
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