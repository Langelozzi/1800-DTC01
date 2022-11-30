/**
 * Generate a random integer from 0 to max.
 * 
 * @param {number} max The maximum integer able to be chosen.
 */
function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

/**
 * Return the id of a user in the database to use as a receiver based on preferred compliment type or randomized.
 * 
 * @param {number} userId The id of the currently logged in user.
 * @param {string} type The type of compliment that was chosen to send.
 * @return {Promise<string>} The id of the user who has been chosen as the receiver.
 */
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

/**
 * Create a new message document in firestore.
 * 
 * @param {number} senderId The id of the message sender.
 * @param {number} receiverId The id of the message receiver.
 * @param {number} complimentId The id of the compliment being sent in this message.
 * @param {number} chainId The id of the chain to which the message belongs.
 * @returns {Promise<any>} A reference to the new message document in firestore.
 */
function createNewMessageDocument(senderId, receiverId, complimentId, chainId) {
    const messagesRef = db.collection("messages");

    // Get current date
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

/**
 * Choose receiver, create proper message document, and modify attribute values to properly send the message.
 * 
 * @param {number} complimentId The id of the compliment being sent.
 * @param {string} type The type of compliment that was chosen to send.
 */
function sendMessage(complimentId, chainId, originalMessageId, type) {
    // Get current user from firebase auth
    firebase.auth().onAuthStateChanged(async (user) => {
        if (user) {
            // Get random user id from firestore users collection
            const receiverId = await chooseReceiver(user.uid, type)

            try {
                var newMessageRef = await createNewMessageDocument(user.uid, receiverId, complimentId, chainId);
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

            // Add the new message id to the chain
            db.collection("chains").doc(chainId).update({
                messages: firebase.firestore.FieldValue.arrayUnion(newMessageRef.id)
            });

            // Update original message to paid forward
            db.collection("messages").doc(originalMessageId).update({
                paidForward: true
            });

            // Open success modal and redirect to browse page
            $('#success-modal').modal('show');
            setTimeout(() => {
                $('#success-modal').modal('hide');
                window.location.href = "inbox.html";
            }, 4000);
        }
        else {
            console.log("no user");

            // Redirect to login page if no user is logged in
            window.location.href = "../html/login.html";
        }
    });
}

/**
 * Find the compliment data of chosen compliment from firestore and display as card in html.
 * 
 * @param {number} complimentId The id of the compliment being sent.
 */
function populateComplimentData(complimentId) {
    db.collection('compliments').doc(complimentId).get().then((data) => {
        const complimentData = data.data();

        $('#compliment-text').html(`"${complimentData.compliment}"`);
        $('#compliment-type').html(complimentData.type);
    })
}

/**
 * Retrieve url param values, populate compliment data and set event listeners.
 */
function setUp() {
    // Get compliment id from html or query param
    const urlParams = new URLSearchParams(window.location.search);
    const complimentId = urlParams.get('complimentId');
    const messageId = urlParams.get('messageId');

    populateComplimentData(complimentId);

    $('#send-btn').click(async () => {
        const messageRef = await db.collection('messages').doc(messageId).get();
        const messageData = messageRef.data();

        const chainId = messageData.chainId;

        const complimentRef = await db.collection('compliments').doc(complimentId).get()
        const complimentData = complimentRef.data();

        sendMessage(complimentId, chainId, messageId, complimentData.type);
    });
}

// Call set up function once the document has loaded
$(document).ready(setUp);