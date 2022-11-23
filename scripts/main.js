function chooseRandomNumberInRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function insertName() {
    firebase.auth().onAuthStateChanged(user => {
        // Check if a user is signed in:
        if (user) {
            user_Name = user.displayName;

            $("#name-goes-here").text(user_Name); //using jquery
        }
        else {
            console.log("no user");

            // redirect to login page if no user is logged in
            window.location.href = "../html/login.html";
        }
    });
}

function addQuoteOfTheDay() {
    const today = new Date().toLocaleDateString("en-US");
    // NOTE: if any of these values in localStorage don't exist then they will be null
    const lastDateAccessed = localStorage.getItem("lastDateAccessed");
    const quoteText = localStorage.getItem("quoteOfTheDayText");
    const quoteAuthor = localStorage.getItem("quoteOfTheDayAuthor");

    // if the lastDateAccess is today and quote data is not null, then we don't need to get a new quote
    // Just use the one we have in localStorage
    if (lastDateAccessed == today && quoteText && quoteAuthor) {
        $("#quote-of-the-day").html(`"${quoteText}"`);
        $("#quote-author").html(`- ${quoteAuthor}`);
    }
    // if lastDateAccessed is not today or null, then get a new quote and save it to localStorage
    else {
        localStorage.setItem('lastDateAccessed', today);

        const settings = {
            "async": true,
            "crossDomain": true,
            "url": "https://type.fit/api/quotes",
            "method": "GET"
        }

        $.ajax(settings).done(function (response) {
            const data = JSON.parse(response);
            const randomQuote = data[chooseRandomNumberInRange(0, data.length - 1)];

            localStorage.setItem("quoteOfTheDayText", randomQuote.text);
            localStorage.setItem("quoteOfTheDayAuthor", randomQuote.author);

            $("#quote-of-the-day").html(`"${randomQuote.text}"`);
            $("#quote-author").html(`- ${randomQuote.author}`);
        });
    }
}

function setUp() {
    insertName();
    addQuoteOfTheDay();
}

document.ready(setUp);