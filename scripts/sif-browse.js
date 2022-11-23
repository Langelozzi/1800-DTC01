const COMPLIMENTS = [];

function checkComplimentFilter(filterType) {
    if (filterType) { 
        var filteredCompliments = [];
        COMPLIMENTS.forEach((compliment) => {
            if (compliment.data().type == filterType) {
                filteredCompliments.push(compliment);
            }
        })
        loadComplimentCards(filteredCompliments);
    } else {
        loadComplimentCards(COMPLIMENTS);
    }
}

function getCompliments() {
    // grab compliments from database and append them into the 'COMPLIMENTS' array
    return db.collection('compliments').get().then((data) => {
        data.forEach(element => {
            COMPLIMENTS.push(element);
        });
    })
}

function loadComplimentCards(compliments) {
    // get message id from html or query param
    const urlParams = new URLSearchParams(window.location.search);
    const messageId = urlParams.get('messageId');
    var template = document.getElementById('browse-card-template');
    $('#sif-browse-card-list').empty();
    compliments.forEach((element) => {
        let complimentData = element.data();
        let complimentId = element.id;
        let complimentText = complimentData.compliment;
        let complimentType = complimentData.type;

        var clone = template.content.cloneNode(true);

        clone.querySelector('.compliment-text').innerHTML = `"${complimentText}"`;
        clone.querySelector('.compliment-type').innerHTML = complimentType;
        clone.querySelector('.select-btn').setAttribute('href', `../html/sif-compliment-details.html?complimentId=${complimentId}&messageId=${messageId}`);

        $('#sif-browse-card-list').append(clone);

    })
}

function dropDown() {
    document.getElementById("dropdownContent").classList.toggle("show");
}

//close dropdown menu
window.onclick = function (event) {
    if (!event.target.matches('.dropdown-toggle')) {
        var dropdowns = document.getElementsByClassName("dropdown-content");
        var i;
        for (i = 0; i < dropdowns.length; i++) {
            var openDropdown = dropdowns[i];
            if (openDropdown.classList.contains("show")) {
                openDropdown.classList.remove("show")
            }
        }
    }
}

function searchBarFilter() {
    const searchInput = $('#search-bar').val(); //grabs the value of what the user types in the search bar
    var searchResult = []
    COMPLIMENTS.forEach((compliment) => { //loops through each compliment and checks if a compliment contains the searchInput. If it does, then append that compliment to searchResult
        var complimentText = compliment.data().compliment;
        if (complimentText.includes(searchInput)) {
            searchResult.push(compliment);
        }
    })
    loadComplimentCards(searchResult);

}

function setUp() {
    getCompliments().then(() => {
        loadComplimentCards(COMPLIMENTS);
        $('#search-bar').keyup((event) => {
            searchBarFilter();
        });
    })
}

$(document).ready(setUp);