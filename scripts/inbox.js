/**
 * Create a message card of a compliment and render in inbox list in html.
 * 
 * @param {any} message A reference to the message in firestore.
 */
async function generateComplimentMessage(message) {
    let messageData = message.data();

    const compliment = await db.collection('compliments').doc(messageData.complimentId).get()

    let messageText = compliment.data().compliment;
    let messageSentAtDate = messageData.sendAt.toDate().toLocaleString('en-CA', { timeZone: 'America/Vancouver' });

    let template = document.getElementById('inbox-compliment-card-template');
    let clone = template.content.cloneNode(true);

    clone.querySelector('#compliment-text').innerHTML = `"${messageText}"`;
    clone.querySelector('#inbox-card')
        .setAttribute('href', `../html/message-details.html?messageId=${message.id}`);

    // If its been opened, then set css to be opened
    if (messageData.openedAt != null) {
        clone.querySelector('#inbox-compliment-card').classList.remove('inbox-compliment-unopened');
        clone.querySelector('#inbox-compliment-card').classList.add('inbox-compliment-opened');
    }
    // If its been reacted to, then change icon to be check mark
    if (messageData.reactedTo) {
        clone.querySelector('#reacted-to').innerHTML = `check_circle`;
    }
    // If its been paid forward then change icon to be check mark
    if (messageData.paidForward) {
        clone.querySelector('#paid-forward').innerHTML = `check_circle`;
    }

    $('#inbox-card-list').append(clone);
}

/**
 * Create a message card of an emoji and render in inbox list in html.
 * 
 * @param {any} message A reference to the message in firestore.
 */
async function generateEmojiMessage(message) {
    let messageData = message.data();
    let messageSentAtDate = messageData.sendAt.toDate().toLocaleString('en-CA', { timeZone: 'America/Vancouver' });

    // Get the original message that the emoji is being reacted to
    const originalMessage = await db.collection('messages').doc(messageData.originalMessageId).get();
    let originalComplimentId = originalMessage.data().complimentId;

    // Get the original compliment that the emoji is being reacted to
    const originalCompliment = await db.collection('compliments').doc(originalComplimentId).get();
    let messageText = originalCompliment.data().compliment;

    let template = document.getElementById('inbox-emoji-card-template');
    let clone = template.content.cloneNode(true);

    clone.querySelector('#inbox-emoji').innerHTML = `&#${messageData.emojiId};`;
    clone.querySelector('#original-message').innerHTML = `"${messageText}"`;

    $('#inbox-card-list').append(clone);
}

/**
 * Iterate through the messages that the user received and populate them into the inbox.
 */
function populateInboxData() {
    const messagesRef = db.collection('messages');

    firebase.auth().onAuthStateChanged(async (user) => {
        if (user) {
            userId = user.uid;

            // Get all the messages ordered by sendAt date
            const data = await messagesRef.orderBy('sendAt', 'desc').get();

            if (data.empty) {
                // If there are no messages, then display no messages
                $('#inbox-card-list').append(`
                    <h3 class="text-muted text-center"><i>Your inbox is currently empty</i></h3>
                `);
            }
            else {
                data.forEach(message => {
                    // If the message has the logged in user id
                    if (message.data().receiverId == userId) {
                        // If the message is an emoji
                        if (message.data().emojiId != null) {
                            generateEmojiMessage(message);

                            // Set emoji to opened as soon as user sees it in inbox
                            messagesRef.doc(message.id).update({
                                openedAt: firebase.firestore.Timestamp.now()
                            });
                        }
                        // If the message is a compliment
                        else if (message.data().complimentId != null) {
                            generateComplimentMessage(message);
                        }
                    }
                });
            }
        } else {
            console.log("no user");

            // Redirect to login page if no user is logged in
            window.location.href = "../html/login.html";
        }
    });
}

/**
 * Run functions that will be called on page load.
 */
function setUp() {
    populateInboxData();
}

// Call set up function once the document has loaded
$(document).ready(setUp);


