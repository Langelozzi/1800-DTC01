/**
 * Filter the compliments list by compliment type and reload the filtered list on the browse page.
 *
 * @param {string} filterType The compliment type the user wants to filter by, or undefined.
 */
function filterCompliments(compliments, filterType) {
    filterType = filterType[0].toUpperCase() + filterType.slice(1);

    var filteredCompliments = [];
    compliments.forEach((compliment) => {
        if (compliment.data().type == filterType) {
            filteredCompliments.push(compliment);
        }
    })

    loadComplimentCards(filteredCompliments);
}

/**
 * Return all of the compliments in firestore as an array.
 *
 * @return {Promise<Array<object>>} An array of all of the compliment references in firestore.
 */
function getCompliments() {
    return db.collection('compliments').get().then((data) => {
        const compliments = [];

        data.forEach(element => {
            compliments.push(element);
        });

        return compliments;
    })
}

/**
 * Render all of the compliments onto the browse page as a list of compliment cards.
 *
 * @param {Array[any]} compliments An array of all of the compliment references in firestore.
 */
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

/**
 * Open the filter dropdown menu
 */
function openFilterDropDown() {
    console.log('clicked')
    document.getElementById("dropdown-content").classList.toggle("show");
}

/**
 * Close the filter dropdown menu
 * 
 * @param {Event} event The event triggered one window click.
 */
function closeFilterDropdown(event) {
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

/**
 * Filter the compliments by matching user input the the compliment text, then load the filtered compliments onto the browse page.
 * 
 * @param {Array[any]} compliments An array of all of the compliment references in firestore.
 */
function searchBarFilter(compliments) {
    const searchInput = $('#search-bar').val(); //grabs the value of what the user types in the search bar
    var searchResult = []

    // Loops through each compliment and checks if a compliment contains the searchInput. If it does, then append that compliment to searchResult
    compliments.forEach((compliment) => {
        var complimentText = compliment.data().compliment;

        if (complimentText.includes(searchInput)) {
            searchResult.push(compliment);
        }
    })

    loadComplimentCards(searchResult);

}

/**
 * Loads the compliments from firestore, displays them on the page, and sets event listeners.
 */
async function setUp() {
    const compliments = await getCompliments();

    loadComplimentCards(compliments);

    window.onclick = closeFilterDropdown;

    $('#filter-dropdown').click(openFilterDropDown);

    $('#search-bar').keyup((event) => {
        searchBarFilter(compliments);
    });

    $('.filter-type-btn').click(function () {
        filterCompliments(compliments, this.id);
    })

    $('#clear').click(() => {
        loadComplimentCards(compliments)
    })
}

// Call set up function once the document has loaded
$(document).ready(setUp);