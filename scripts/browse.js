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
    return db.collection('compliments').get().then((data) => {
        data.forEach(element => {
            COMPLIMENTS.push(element);
        });
    })
}

function loadComplimentCards(compliments) {
    var template = document.getElementById('browse-card-template');

    $('#browse-card-list').empty();
    compliments.forEach((element) => {
        let complimentData = element.data();
        let complimentId = element.id;
        let complimentText = complimentData.compliment;
        let complimentType = complimentData.type;

        var clone = template.content.cloneNode(true);

        clone.querySelector('.compliment-text').innerHTML = `"${complimentText}"`;
        clone.querySelector('.compliment-type').innerHTML = complimentType;
        clone.querySelector('.select-btn').setAttribute('href', `../html/compliment-details.html?complimentId=${complimentId}`);

        $('#browse-card-list').append(clone);

    })
}

function dropDown() {
    document.getElementById("dropdownContent").classList.toggle("show");
}

//close dropdown menu
window.onclick = function (event) {
    if (!event.target.matches('.dropdown-toggle')) {
        var dropdowns = document.getElementsByClassName("dropdown-content");

        for (let i = 0; i < dropdowns.length; i++) {
            var openDropdown = dropdowns[i];
            if (openDropdown.classList.contains("show")) {
                openDropdown.classList.remove("show")
            }
        }
    }
}

function searchBarFilter() {
    const searchInput = $('#search-bar').val();
    var searchResult = []

    COMPLIMENTS.forEach((compliment) => {
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