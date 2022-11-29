/**
 * Randomly select a number in range min-max.
 * 
 * @param {number} min The minimum value able to be chosen.
 * @param {number} max The maximum value able to be chosen.
 * @return {number} The randomly selected integer.
 */
function chooseRandomNumberInRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Insert the current user's name onto main jumbotron.
 */
function insertName() {
    firebase.auth().onAuthStateChanged(user => {
        // Check if a user is signed in:
        if (user) {
            userName = user.displayName;

            $("#name-goes-here").text(userName);
        }
        else {
            console.log("no user");

            // Redirect to login page if no user is logged in
            window.location.href = "../html/login.html";
        }
    });
}

/**
 * Randomly set a quote from https://type.fit/api/quotes api as the quote of the day and display in html.
 */
function addQuoteOfTheDay() {
    const today = new Date().toLocaleDateString("en-US");
    // NOTE: if any of these values in localStorage don't exist then they will be null
    const lastDateAccessed = localStorage.getItem("lastDateAccessed");
    const quoteText = localStorage.getItem("quoteOfTheDayText");
    const quoteAuthor = localStorage.getItem("quoteOfTheDayAuthor");

    // If the lastDateAccess is today and quote data is not null, then we don't need to get a new quote
    // Just use the one we have in localStorage
    if (lastDateAccessed == today && quoteText && quoteAuthor) {
        $("#quote-of-the-day").html(`"${quoteText}"`);
        $("#quote-author").html(`- ${quoteAuthor}`);
    }
    // If lastDateAccessed is not today or null, then get a new quote and save it to localStorage
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

/**
 * Run functions that will be called on page load.
 */
function setUp() {
    insertName();
    addQuoteOfTheDay();
}

// Call set up function once the document has loaded
$(document).ready(setUp);