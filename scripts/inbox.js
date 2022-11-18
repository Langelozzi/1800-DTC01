var userId;

function generateComplimentMessage(message) {
    const complimentRef = db.collection('compliments');
    let messageData = message.data();

    complimentRef.doc(messageData.complimentId).get().then((compliment) => {
        let messageText = compliment.data().compliment;
        let messageSentAtDate = messageData.sendAt.toDate().toDateString();

        var template = document.getElementById('inbox-compliment-card-template');
        var clone = template.content.cloneNode(true);
        clone.querySelector('#compliment-text').innerHTML = `"${messageText}"`;
        clone.querySelector('#message-date').innerHTML = messageSentAtDate;
        clone.querySelector('#inbox-card')
            .setAttribute('href', `../message-details.html?messageId=${message.id}`);

        // if its been opened, then set css to be opened
        if (messageData.openedAt != null) {
            clone.querySelector('#inbox-compliment-card').classList.remove('inbox-compliment-unopened');
            clone.querySelector('#inbox-compliment-card').classList.add('inbox-compliment-opened');
        }
        // if its been reacted to, then change icon to be check mark
        if (messageData.reactedTo) {
            clone.querySelector('#reacted-to').innerHTML = `check_circle`;
        }
        if (messageData.paidForward) {
            clone.querySelector('#paid-forward').innerHTML = `check_circle`;
        }

        $('#inbox-card-list').append(clone);
    })
}

function generateEmojiMessage(message) {
    let messageData = message.data();
    let messageSentAtDate = messageData.sendAt.toDate().toDateString();

    db.collection('messages').doc(messageData.originalMessageId).get().then((originalMessage) => {
        let originalComplimentId = originalMessage.data().complimentId;

        db.collection('compliments').doc(originalComplimentId).get().then((compliment) => {
            let messageText = compliment.data().compliment;
            var template = document.getElementById('inbox-emoji-card-template');
            var clone = template.content.cloneNode(true);

            clone.querySelector('#inbox-emoji').innerHTML = `&#${messageData.emojiId};`;
            clone.querySelector('#message-date').innerHTML = messageSentAtDate;
            clone.querySelector('#original-message').innerHTML = `"${messageText}"`;

            $('#inbox-card-list').append(clone);
        })
    })
}

function populateInboxData() {
    const messagesRef = db.collection('messages');

    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            userId = user.uid;

            messagesRef.get().then((data) => {
                if (data.empty) {
                    $('#inbox-card-list').append(`
                        <h3 class="text-muted text-center"><i>Your inbox is currently empty</i></h3>
                    `)
                }
                else {
                    data.forEach(message => {
                        if (message.data().receiverId == userId) {
                            if (message.data().complimentId != null) {
                                generateComplimentMessage(message);
                            } else if (message.data().emojiId != null) {
                                generateEmojiMessage(message);
                            }
                        }
                    });
                }
            })
        } else {
            console.log("no user");
        }
    });
}

function setUp() {
    populateInboxData();
}

$(document).ready(setUp);


