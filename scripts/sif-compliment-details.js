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

function createNewMessageDocument(senderId, receiverId, complimentId, chainId) {
    const messagesRef = db.collection("messages");

    // get current date
    const currentDate = firebase.firestore.Timestamp.now();

    return messagesRef.add({
        chainId: chainId,
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

function sendMessage(complimentId, chainId, originalMessageId) {
    // get current user from firebase auth
    firebase.auth().onAuthStateChanged(async (user) => {
        if (user) {
            // get random user id from firestore users collection
            const receiverId = await chooseReceiver(user.uid)

            try {
                var newMessageRef = await createNewMessageDocument(user.uid, receiverId, complimentId, chainId);
            }
            catch (error) {
                console.error("Error adding new message (compliment) document: ", error);

                // open error modal
                $('#error-modal').modal('show');
                setTimeout(() => {
                    $('#error-modal').modal('hide');
                }, 4000);
            }

            // add one to users number of compliments sent
            db.collection("users").doc(user.uid).update({
                complimentsSent: firebase.firestore.FieldValue.increment(1)
            });

            // add one to amountSent for that compliment
            db.collection("compliments").doc(complimentId).update({
                amountSent: firebase.firestore.FieldValue.increment(1)
            });

            // add the new message id to the chain
            db.collection("chains").doc(chainId).update({
                messages: firebase.firestore.FieldValue.arrayUnion(newMessageRef.id)
            });

            // update original message to paid forward
            db.collection("messages").doc(originalMessageId).update({
                paidForward: true
            });

            // open success modal and redirect to browse page
            $('#success-modal').modal('show');
            setTimeout(() => {
                $('#success-modal').modal('hide');
                window.location.href = "inbox.html";
            }, 4000);
        }
        else {
            console.log("no user");

            // redirect to login page if no user is logged in
            window.location.href = "../html/login.html";
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
    const messageId = urlParams.get('messageId');

    populateComplimentData(complimentId);

    $('#send-btn').click(() => {
        db.collection('messages').doc(messageId).get().then((data) => {
            const messageData = data.data();
            const chainId = messageData.chainId;

            sendMessage(complimentId, chainId, messageId);
        });
    });
}

$(document).ready(setUp);