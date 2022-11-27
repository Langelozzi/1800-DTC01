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

        if (allUserIds.length == 1) {
            return allUserIds[0];
        }
        else {

            let possibleReceiverIds = allUserIds;

            // Remove user ids that have a different preferrec compliment type selected
            for (let i = 0; i < allUserIds.length; i++) {
                if (possibleReceiverIds[i][1] != type && possibleReceiverIds[i][1] != null && possibleReceiverIds[i][1] != "none") {
                    possibleReceiverIds.splice(i, 1);
                }
            }

            if (possibleReceiverIds.length <= 1) {
                possibleReceiverIds = backupUserIds;
                // Remove current user from possible receiver ids
                for (let i = 0; i < backupUserIds.length; i++) {
                    if (possibleReceiverIds[i][0] == userId) {
                        possibleReceiverIds.splice(i, 1);
                    }
                }
            }
            else {
                // Remove current user from possible receiver ids
                for (let i = 0; i < allUserIds.length; i++) {
                    if (possibleReceiverIds[i][0] == userId) {
                        possibleReceiverIds.splice(i, 1);
                    }
                }
            }

            let receiverIndex = getRandomInt(allUserIds.length - 1);

            return possibleReceiverIds[receiverIndex];
        }
    })
}

// Create new document to store and track message chains between users
function createNewChainDocument(userId, messageId) {
    const chainsRef = db.collection("chains");
    const currentDate = firebase.firestore.Timestamp.now();

    return chainsRef.add({
        starterId: userId,
        messages: [messageId],
        createdAt: currentDate
    })
}


function createNewMessageDocument(senderId, receiverId, complimentId) {
    const messagesRef = db.collection("messages");

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

async function sendMessage(complimentId, type) {
    // Get current user from firebase auth
    firebase.auth().onAuthStateChanged(async (user) => {
        if (user) {
            // Get random user id from firestore users collection
            const receiverId = await chooseReceiver(user.uid, type)

            try {
                var newMessageRef = await createNewMessageDocument(user.uid, receiverId, complimentId);
            }
            catch (error) {
                console.error("Error adding new message (compliment) document: ", error);

                // Open error modal
                $('#error-modal').modal('show');
                setTimeout(() => {
                    $('#error-modal').modal('hide');
                }, 4000);
            }

            // Add one to users number of compliments sent
            db.collection("users").doc(user.uid).update({
                complimentsSent: firebase.firestore.FieldValue.increment(1)
            });
            // Add one to amountSent for that compliment
            db.collection("compliments").doc(complimentId).update({
                amountSent: firebase.firestore.FieldValue.increment(1)
            });

            try {
                var newChainRef = await createNewChainDocument(user.uid, newMessageRef.id);
            }
            catch (error) {
                console.error("Error adding new chain document: ", error);

                // Open error modal
                $('#error-modal').modal('show');
                setTimeout(() => {
                    $('#error-modal').modal('hide');
                }, 4000);
            }

            // Add one to users number of chains started
            db.collection("users").doc(user.uid).update({
                chainsStarted: firebase.firestore.FieldValue.increment(1)
            });

            // Add the chain id to the message
            db.collection("messages").doc(newMessageRef.id).update({
                chainId: newChainRef.id
            });

            // Open success modal and redirect to browse page
            $('#success-modal').modal('show');
            setTimeout(() => {
                $('#success-modal').modal('hide');
                window.location.href = "browse.html";
            }, 4000);
        }
        else {
            console.log("no user");

            // Redirect to login page if no user is logged in
            window.location.href = "../html/login.html";
        }
    });

}

async function populateComplimentData(complimentId) {
    const data = await db.collection('compliments').doc(complimentId).get()
    const complimentData = data.data();

    $('#compliment-text').html(`"${complimentData.compliment}"`);
    $('#compliment-type').html(complimentData.type);
}

function setUp() {
    // Cet compliment id from html or query param
    const urlParams = new URLSearchParams(window.location.search);
    const complimentId = urlParams.get('complimentId');

    populateComplimentData(complimentId);

    $('#send-btn').click(async () => {
        const data = await db.collection('compliments').doc(complimentId).get()
        const complimentData = data.data();

        sendMessage(complimentId, complimentData.type);
    });
}

$(document).ready(setUp);