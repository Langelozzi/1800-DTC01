function writeCompliments() {
    //define a variable for the collection you want to create in Firestore to populate data
    var complimentId = db.collection("compliments");

    // ---------------------------------- personality compliments (x12)-----------------------------------

    complimentId.add({
        compliment: "You're all that and a super-size bag of chips!",
        type: "personality",
        amountSent: 0,
        emojisReceived: 0,
    });
    complimentId.add({
        compliment: "On a scale from 1 to 10, you’re an 11.",
        type: "personality",
        amountSent: 0,
        emojisReceived: 0,
    });
    complimentId.add({
        compliment: "You’re like sunshine on a rainy day.",
        type: "personality",
        amountSent: 0,
        emojisReceived: 0,
    });
    complimentId.add({
        compliment: "I bet you sweat glitter.",
        type: "personality",
        amountSent: 0,
        emojisReceived: 0,
    });
    complimentId.add({
        compliment: "If you were a box of crayons, you’d be the giant name-brand one with the built-in sharpener.",
        type: "personality",
        amountSent: 0,
        emojisReceived: 0,
    });
    complimentId.add({
        compliment: "You’re more fun than bubble wrap.",
        type: "personality",
        amountSent: 0,
        emojisReceived: 0,
    });
    complimentId.add({
        compliment: "You’re even better than a unicorn, because you’re real.",
        type: "personality",
        amountSent: 0,
        emojisReceived: 0,
    });
    complimentId.add({
        compliment: "Colors seem brighter when you're around.",
        type: "personality",
        amountSent: 0,
        emojisReceived: 0,
    });
    complimentId.add({
        compliment: "You're someone's reason to smile.",
        type: "personality",
        amountSent: 0,
        emojisReceived: 0,
    });
    complimentId.add({
        compliment: "In high school, I bet you were voted \"most likely to continue being awesome.\"",
        type: "personality",
        amountSent: 0,
        emojisReceived: 0,
    });
    complimentId.add({
        compliment: "You're smarter than Google and Mary Poppins combined.",
        type: "personality",
        amountSent: 0,
        emojisReceived: 0,
    });
    complimentId.add({
        compliment: "I know this is corny, but you are a-maize-ing!",
        type: "personality",
        amountSent: 0,
        emojisReceived: 0,
    });

    // ----------------------------------words of encouragement (x12)-----------------------------------

    complimentId.add({
        compliment: "Don’t stress. You got this!",
        type: "encouragement",
        amountSent: 0,
        emojisReceived: 0,
    });
    complimentId.add({
        compliment: "Sending some good vibes and happy thoughts your way.",
        type: "encouragement",
        amountSent: 0,
        emojisReceived: 0,
    });
    complimentId.add({
        compliment: "Good luck today! I know you are going to do great.",
        type: "encouragement",
        amountSent: 0,
        emojisReceived: 0,
    });
    complimentId.add({
        compliment: "I believe in you! And unicorns. But mostly you.",
        type: "encouragement",
        amountSent: 0,
        emojisReceived: 0,
    });
    complimentId.add({
        compliment: "You can get through this. Take it from me. I’m very wise and stuff.",
        type: "encouragement",
        amountSent: 0,
        emojisReceived: 0,
    });
    complimentId.add({
        compliment: "Be good to yourself. And let others be good to you, too.",
        type: "encouragement",
        amountSent: 0,
        emojisReceived: 0,
    });
    complimentId.add({
        compliment: "Take everything one day at a time. You've got this!",
        type: "encouragement",
        amountSent: 0,
        emojisReceived: 0,
    });
    complimentId.add({
        compliment: "Be kind to yourself.",
        type: "encouragement",
        amountSent: 0,
        emojisReceived: 0,
    });
    complimentId.add({
        compliment: "You’re doing exactly what you should be doing. Hang in there.",
        type: "encouragement",
        amountSent: 0,
        emojisReceived: 0,
    });
    complimentId.add({
        compliment: "Don’t let anyone dull your sparkle.",
        type: "encouragement",
        amountSent: 0,
        emojisReceived: 0,
    });
    complimentId.add({
        compliment: "Believe in yourself, because I believe in you!",
        type: "encouragement",
        amountSent: 0,
        emojisReceived: 0,
    });
    complimentId.add({
        compliment: "Your speed doesn’t matter. Forward is forward.",
        type: "encouragement",
        amountSent: 0,
        emojisReceived: 0,
    });

    // ----------------------------------words of affirmation (x8)-----------------------------------

    complimentId.add({
        compliment: "This is tough, but you're tougher.",
        type: "affirmation",
        amountSent: 0,
        emojisReceived: 0,
    });
    complimentId.add({
        compliment: "You are making a difference.",
        type: "affirmation",
        amountSent: 0,
        emojisReceived: 0,
    });
    complimentId.add({
        compliment: "You are enough.",
        type: "affirmation",
        amountSent: 0,
        emojisReceived: 0,
    });
    complimentId.add({
        compliment: "You are perfectly imperfect. And that’s just perfect.",
        type: "affirmation",
        amountSent: 0,
        emojisReceived: 0,
    });
    complimentId.add({
        compliment: "You are braver than you believe, stronger than you seem, and smarter than you think.",
        type: "affirmation",
        amountSent: 0,
        emojisReceived: 0,
    });
    complimentId.add({
        compliment: "You are strong enough to make your own decisions.",
        type: "affirmation",
        amountSent: 0,
        emojisReceived: 0,
    });
    complimentId.add({
        compliment: "You're doing your best and that is enough.",
        type: "affirmation",
        amountSent: 0,
        emojisReceived: 0,
    });
    complimentId.add({
        compliment: "You have the power to create change.",
        type: "affirmation",
        amountSent: 0,
        emojisReceived: 0,
    });

    // ----------------------------------appearance compliments (x8)-----------------------------------

    complimentId.add({
        compliment: "How is it that you always look great, even in sweatpants?",
        type: "appearance",
        amountSent: 0,
        emojisReceived: 0,
    });
    complimentId.add({
        compliment: "Your smile is proof that the best things in life are free.",
        type: "appearance",
        amountSent: 0,
        emojisReceived: 0,
    });
    complimentId.add({
        compliment: "I don't have a favourite colour, It's pretty much whatever you are wearing.",
        type: "appearance",
        amountSent: 0,
        emojisReceived: 0,
    });
    complimentId.add({
        compliment: "Are you a beaver, because daaaaaamn!",
        type: "appearance",
        amountSent: 0,
        emojisReceived: 0,
    });
    complimentId.add({
        compliment: "You know what's awesome? Chocolate cake, oh and your face.",
        type: "appearance",
        amountSent: 0,
        emojisReceived: 0,
    });
    complimentId.add({
        compliment: "If you were a fruit, you would be a fine-apple.",
        type: "appearance",
        amountSent: 0,
        emojisReceived: 0,
    });
    complimentId.add({
        compliment: "Your style is everything.",
        type: "appearance",
        amountSent: 0,
        emojisReceived: 0,
    });
    complimentId.add({
        compliment: "Polar bears and penguins should fear your cuteness.",
        type: "appearance",
        amountSent: 0,
        emojisReceived: 0,
    });
}