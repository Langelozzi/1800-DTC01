function createNewMessageDocument(senderId, receiverId, emojiId) {
    const messagesRef = db.collection("messages");

    // get current date
    const currentDate = firebase.firestore.Timestamp.now();

    return messagesRef.add({
        senderId: senderId,
        receiverId: receiverId,
        complimentId: null,
        emojiId: emojiId,
        sendAt: currentDate,
        openedAt: null
    })
}

function addMessageToChain(chainId, messageId) {
    // Atomically add a new message to the "messages" array field
    return db.collection("chains").doc(chainId).update({
        messages: firebase.firestore.FieldValue.arrayUnion(messageId)
    })
}

function sendEmoji(receiverId, chainId) {
    const selectedEmojiId = $('input[name="emoji-selection"]:checked').attr('id');

    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            createNewMessageDocument(user.uid, receiverId, selectedEmojiId)
                .then((newMessageRef) => {
                    addMessageToChain(chainId, newMessageRef.id)
                        .then(() => {
                            // add one to emojis amountSent field
                            db.collection("emojis").doc(selectedEmojiId).update({
                                amountSent: firebase.firestore.FieldValue.increment(1)
                            });

                            // add the chain id to the message
                            db.collection("messages").doc(newMessageRef.id).update({
                                chainId: chainId
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

function populateInboxData(complimentId) {
    db.collection('compliments').doc(complimentId).get().then((data) => {
        const complimentData = data.data();
        const urlParams = new URLSearchParams(window.location.search);
        const chainId = urlParams.get('chainId');

        var payItForwardBtn = document.getElementById('pay-it-forward-btn');
        payItForwardBtn.href += '?chainId=' + chainId


        $('#compliment-text').html(`"${complimentData.compliment}"`);
        $('#compliment-type').html(complimentData.type);

    })
}

function setUp() {
    const urlParams = new URLSearchParams(window.location.search);
    const messageId = urlParams.get('messageId');

    db.collection('messages').doc(messageId).get().then((data) => {
        const messageData = data.data();
        const senderId = messageData.senderId;
        const chainId = messageData.chainId;
        const complimentId = messageData.complimentId;

        populateInboxData(complimentId);

        $('#send-emoji-btn').click(() => {
            // NOTE: sender of message is the receiver of the emoji
            sendEmoji(senderId, chainId);
        });
    });

}

$(document).ready(setUp);