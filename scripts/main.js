//---------------------------------
// Your own functions here
//---------------------------------

function insertName() {
    firebase.auth().onAuthStateChanged(user => {
        // Check if a user is signed in:
        if (user) {
            // Do something for the currently logged-in user here: 
            user_Name = user.displayName;

            //method #1:  insert with html only
            //document.getElementById("name-goes-here").innerText = user_Name;    //using javascript
            //method #2:  insert using jquery
            $("#name-goes-here").text(user_Name); //using jquery

        } else {
            // No user is signed in.
        }
    });
}
insertName(); //run the function

function chooseRandomNumberInRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function addQuoteOfTheDay() {
    const today = new Date().toLocaleDateString("en-US");
    const lastDateAccessed = localStorage.getItem("lastDateAccessed");
    const quoteText = localStorage.getItem("quoteOfTheDayText");
    const quoteAuthor = localStorage.getItem("quoteOfTheDayAuthor");

    // if the lastDateAccess is today and we have quote data stored, then we don't need to get a new quote
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
addQuoteOfTheDay();