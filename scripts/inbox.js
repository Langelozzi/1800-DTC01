var userId;

function generateComplimentMessage(message) {
    const complimentRef = db.collection('compliments');
    let messageData = message.data();

    complimentRef.doc(messageData.complimentId).get().then((compliment) => {
        let messageText = compliment.data().compliment;
        let messageSentAtDate = messageData.sendAt.toDate().toDateString();

        var template = document.getElementById('inbox-card-template');
        var clone = template.content.cloneNode(true);
        clone.querySelector('#inbox-compliment-text').innerHTML = `"${messageText}"`;
        clone.querySelector('#inbox-send-at').innerHTML = messageSentAtDate;
        clone.querySelector('#inbox-card')
            .setAttribute('href', `../message-details.html?messageId=${message.id}`);

        $('#inbox-card-list').append(clone);
    })
}

function generateEmojiMessage(message) {
    let messageData = message.data();
    let messageSentAtDate = messageData.sendAt.toDate().toDateString();

    var template = document.getElementById('inbox-card-template');
    var clone = template.content.cloneNode(true);

    clone.querySelector('#inbox-compliment-text').innerHTML = `&#${messageData.emojiId};`;
    clone.querySelector('#inbox-send-at').innerHTML = messageSentAtDate;
    clone.querySelector('#inbox-card')
        .setAttribute('href', `../message-details.html?messageId=${message.id}`);

    $('#inbox-card-list').append(clone);
}

function populateInboxData() {
    const messagesRef = db.collection('messages');

    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            userId = user.uid;

            messagesRef.get().then((data) => {
                if (data.empty) {
                    $('#inbox-card-list').append(`
                        <h3><i>Your inbox is currently empty.</i></h3>
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


