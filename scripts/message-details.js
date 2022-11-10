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

function sendEmoji() {
    const selectedEmojiId = $('input[name="emoji-selection"]:checked').attr('id');
    // will change this to grabbing from the senderId of the message being responded to
    const receiverId = 'fillerRecieverId';
    // will change this to grabbing from the chainId of the message being responded to
    const chainId = 'tueFnMNio3QtfKpx3xzW';

    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            createNewMessageDocument(user.uid, receiverId, selectedEmojiId)
                .then((newMessageRef) => {
                    addMessageToChain(chainId, newMessageRef.id)
                        .then(() => {
                            // add the chain id to the message
                            db.collection("messages").doc(newMessageRef.id).update({
                                chainId: chainId
                            });
                        })
                        .catch((error) => {
                            console.log("Error adding new emoji message (emoji) to chain array: ", error);
                        });
                })
                .catch((error) => {
                    console.error("Error adding new message (emoji) document: ", error);
                });
        } else {
            console.log("no user");
        }
    });
}

function setUp() {
    $('#send-emoji-btn').click(sendEmoji);
}

$(document).ready(setUp);