// Function to write emoji data to firestore
function generateEmojiData() {
    const emojisRef = db.collection("emojis");

    emojisRef.doc("128522").set({
        emojiDesc: "smile",
        amountSent: 0
    });
    emojisRef.doc("128147").set({
        emojiDesc: "heart",
        amountSent: 0
    });
    emojisRef.doc("128516").set({
        emojiDesc: "big smile",
        amountSent: 0
    });
    emojisRef.doc("128518").set({
        emojiDesc: "laughter",
        amountSent: 0
    });
    emojisRef.doc("128525").set({
        emojiDesc: "heart eyes",
        amountSent: 0
    });
    emojisRef.doc("128523").set({
        emojiDesc: "tongue out",
        amountSent: 0
    });
    emojisRef.doc("128524").set({
        emojiDesc: "satisfied",
        amountSent: 0
    });
    emojisRef.doc("128526").set({
        emojiDesc: "sunglasses",
        amountSent: 0
    });
    emojisRef.doc("128079").set({
        emojiDesc: "clapping",
        amountSent: 0
    });
}