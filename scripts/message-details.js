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

function addMessageToChain(chainId, messageId) {
    // Atomically add a new message to the "messages" array field
    return db.collection("chains").doc(chainId).update({
        messages: firebase.firestore.FieldValue.arrayUnion(messageId)
    })
}

function sendEmoji(receiverId, chainId, originalMessageId) {
    const selectedEmojiId = $('input[name="emoji-selection"]:checked').attr('id');

    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            createNewMessageDocument(user.uid, receiverId, selectedEmojiId, chainId, originalMessageId)
                .then((newMessageRef) => {
                    addMessageToChain(chainId, newMessageRef.id)
                        .then(() => {
                            // add one to emojis amountSent field
                            db.collection("emojis").doc(selectedEmojiId).update({
                                amountSent: firebase.firestore.FieldValue.increment(1)
                            });

                            // set original message reactedTo to true
                            db.collection("messages").doc(originalMessageId).update({
                                reactedTo: true
                            });

                            // open success modal and disable reply button
                            $("#emoji-selection-modal").modal('hide') // hide modal
                            $('#success-modal').modal('show');
                            setTimeout(() => {
                                $('#success-modal').modal('hide');
                            }, 4000);

                            $('#reply-emoji-btn').attr('disabled', true);
                        })
                        .catch((error) => {
                            console.log("Error adding new emoji message (emoji) to chain array: ", error);

                            // open error modal
                            $("#emoji-selection-modal").modal('hide') // hide modal
                            $('#error-modal').modal('show');
                            setTimeout(() => {
                                $('#error-modal').modal('hide');
                            }, 4000);
                        });
                })
                .catch((error) => {
                    console.error("Error adding new message (emoji) document: ", error);

                    // open error modal
                    $("#emoji-selection-modal").modal('hide') // hide modal
                    $('#error-modal').modal('show');
                    setTimeout(() => {
                        $('#error-modal').modal('hide');
                    }, 4000);
                });
        } else {
            console.log("no user");
        }
    });
}

function populateInboxData(complimentId, messageId) {
    db.collection('compliments').doc(complimentId).get().then((data) => {
        const complimentData = data.data();

        var payItForwardBtn = document.getElementById('pay-it-forward-btn');
        payItForwardBtn.href += '?messageId=' + messageId


        $('#compliment-text').html(`"${complimentData.compliment}"`);
        $('#compliment-type').html(complimentData.type);
    })
}

function checkMessageStatus(messageId) {
    db.collection('messages').doc(messageId).get().then((data) => {
        const messageData = data.data();
        const reactedTo = messageData.reactedTo;
        const paidForward = messageData.paidForward;

        if (reactedTo) {
            $('#reply-emoji-btn').attr('disabled', true);
        }
        if (paidForward) {
            $('#pay-it-forward-btn').attr('disabled', true);
        }
    });
}

function setUp() {
    const urlParams = new URLSearchParams(window.location.search);
    const messageId = urlParams.get('messageId');

    db.collection('messages').doc(messageId).get().then((data) => {
        const messageData = data.data();
        const senderId = messageData.senderId;
        const chainId = messageData.chainId;
        const complimentId = messageData.complimentId;

        populateInboxData(complimentId, messageId);
        checkMessageStatus(messageId);

        $('#send-emoji-btn').click(() => {
            // NOTE: sender of message is the receiver of the emoji
            sendEmoji(senderId, chainId, messageId);
        });
    });

}

$(document).ready(setUp);