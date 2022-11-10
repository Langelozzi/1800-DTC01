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

function addMessageToChain(messageId) {

}

function sendEmoji() {
    const selectedEmojiId = $('input[name="emoji-selection"]:checked').attr('id');
    // will change this to grabbing from the senderId of the message being responded to
    const receiverId = 'fillerRecieverId';

    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            createNewMessageDocument(user.uid, receiverId, selectedEmojiId)
                .then((newMessageRef) => {
                    addMessageToChain(chainId, newMessageRef.id);
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