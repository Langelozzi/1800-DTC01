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
        console.error("Error adding document: ", error);
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

                        createNewChainDocument(user.uid, newMessageRef.id)
                    })
                    .catch((error) => {
                        console.error("Error adding document: ", error);
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
        complimentID: "CH01",
        complimentContent: "",
        complimentCategory: "character",
        timesSent: 0,
        timesReacted: 0,
    });
    complimentsRef.add({
        complimentID: "PE01",
        complimentContent: "You're all that and a super-size bag of chips!",
        complimentCategory: "personality",
    });
    complimentsRef.add({
        complimentID: "AP01",
        complimentContent: "How is it that you always look great, even in sweatpants?",
        complimentCategory: "appearance",
    });
    complimentsRef.add({
        complimentID: "EN01",
        complimentContent: "This is tough, but you're tougher.",
        complimentCategory: "encouragement",
    });
}
}

function setUp() {
    // get compliment id from html or query param
    const complimentId = "testComplimentId"

    $('#send-btn').click(() => {
        sendMessage(complimentId);
    });
}

$(document).ready(setUp);