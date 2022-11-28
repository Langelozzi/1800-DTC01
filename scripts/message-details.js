/**
 * Create a new message document in firestore.
 * 
 * @param {number} senderId The id of the message sender.
 * @param {number} receiverId The id of the message receiver.
 * @param {number} emojiId The id of the emoji being sent in this message.
 * @param {number} chainId The id of the chain to which the message will belong to.
 * @param {number} originalMessageId The id of the message to which the message is responding to.
 * @returns {Promise<any>} A reference to the new message document in firestore.
 */
function createNewMessageDocument(senderId, receiverId, emojiId, chainId, originalMessageId) {
    const messagesRef = db.collection("messages");

    // get current date
    const currentDate = firebase.firestore.Timestamp.now();

    return messagesRef.add({
        chainId: chainId,
        senderId: senderId,
        receiverId: receiverId,
        complimentId: null,
        emojiId: emojiId,
        sendAt: currentDate,
        openedAt: null,
        originalMessageId: originalMessageId
    })
}

/**
 * Append a message document id to a chain's 'messages' array
 * 
 * @param {number} chainId The id of the chain to which the message will be appended to.
 * @param {number} messageId The id of the message being appended.
 */
function addMessageToChain(chainId, messageId) {
    // Atomically add a new message to the "messages" array field
    db.collection("chains").doc(chainId).update({
        messages: firebase.firestore.FieldValue.arrayUnion(messageId)
    })
}

/**
 * Create and modify necessary documents in firestore to send emoji response to a received compliment.
 * 
 * @param {number} receiverId The id of the message receiver.
 * @param {number} chainId The id of the chain to which the emoji response will belong to.
 * @param {number} originalMessageId The id of the message to which the emoji is responding to.
 */
async function sendEmoji(receiverId, chainId, originalMessageId) {
    const selectedEmojiId = $('input[name="emoji-selection"]:checked').attr('id');

    firebase.auth().onAuthStateChanged(async (user) => {
        if (user) {
            try {
                const newMessageRef = await createNewMessageDocument(user.uid, receiverId, selectedEmojiId, chainId, originalMessageId);

                try {
                    await addMessageToChain(chainId, newMessageRef.id);
                }
                catch (error) {
                    console.log("Error adding new emoji message (emoji) to chain array: ", error);

                    // open error modal
                    $("#emoji-selection-modal").modal('hide') // hide modal
                    $('#error-modal').modal('show');
                    setTimeout(() => {
                        $('#error-modal').modal('hide');
                    }, 4000);

                    return;
                }
            }
            catch (error) {
                console.error("Error adding new message (emoji) document: ", error);

                // open error modal
                $("#emoji-selection-modal").modal('hide') // hide modal
                $('#error-modal').modal('show');
                setTimeout(() => {
                    $('#error-modal').modal('hide');
                }, 4000);

                return;
            }

            // add one to emojis amountSent field
            db.collection("emojis").doc(selectedEmojiId).update({
                amountSent: firebase.firestore.FieldValue.increment(1)
            });

            // set original message reactedTo to true
            db.collection("messages").doc(originalMessageId).update({
                reactedTo: true
            });

            // hide emoji modal
            $("#emoji-selection-modal").modal('hide')
            // show success modal
            $('#success-modal').modal('show');
            setTimeout(() => {
                $('#success-modal').modal('hide');
            }, 4000);
            // disable the reply with emoji button
            $('#reply-emoji-btn').attr('disabled', true);

        }
        else {
            console.log("no user");

            // redirect to login page if no user is logged in
            window.location.href = "../html/login.html";
        }
    });
}

/**
 * Find the message data of selected message from firestore and display as card in html.
 * 
 * @param {number} complimentId The id of the compliment used in the message.
 * @param {number} messageId The id of the message that the compliment originated from.
 */
async function populateMessageData(complimentId, messageId) {
    const data = await db.collection('compliments').doc(complimentId).get();
    const complimentData = data.data();

    var payItForwardBtn = document.getElementById('pay-it-forward-btn');

    payItForwardBtn.href += '?messageId=' + messageId
    $('#compliment-text').html(`"${complimentData.compliment}"`);
    $('#compliment-type').html(complimentData.type);
}

/**
 * Checks the opened, reacted to and paid forward statuses of the message and modifies data and html attributes accordingly.
 * 
 * @param {number} messageId The id of the message that is being viewed.
 */
async function checkMessageStatus(messageId) {
    const data = await db.collection('messages').doc(messageId).get();

    const messageData = data.data();
    const reactedTo = messageData.reactedTo;
    const paidForward = messageData.paidForward;
    const openedAt = messageData.openedAt;

    // check if message has been reacted to, paid forward and/or opened
    if (reactedTo) {
        $('#reply-emoji-btn').attr('disabled', true);
    }
    if (paidForward) {
        $('#pay-it-forward-btn').attr('disabled', true);
    }
    if (!openedAt) {
        setMessageOpened(messageId);
    }
}

/**
 * Set the openedAt field of the viewed message to current time.
 * 
 * @param {number} messageId The id of the message that is being viewed.
 */
function setMessageOpened(messageId) {
    db.collection('messages').doc(messageId).update({
        openedAt: firebase.firestore.Timestamp.now()
    });
}

/**
 * Retrieve url param values and set up page elements and event listeners.
 */
async function setUp() {
    // get message id from html or query param
    const urlParams = new URLSearchParams(window.location.search);
    const messageId = urlParams.get('messageId');

    checkMessageStatus(messageId);

    $('#pay-it-forward-btn').click(() => {
        window.location = `sif-browse.html?messageId=${messageId}`;
    })

    const data = await db.collection('messages').doc(messageId).get();

    const messageData = data.data();
    const senderId = messageData.senderId;
    const chainId = messageData.chainId;
    const complimentId = messageData.complimentId;

    populateMessageData(complimentId, messageId);

    $('#send-emoji-btn').click(() => {
        // NOTE: sender of message is the receiver of the emoji
        sendEmoji(senderId, chainId, messageId);
    });

}

// Call set up function once the document has loaded
$(document).ready(setUp);