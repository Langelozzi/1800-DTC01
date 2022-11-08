function loadComplimentCards() {
    var template = document.getElementById('browse-card-template');

    db.collection('compliments').get().then((data) => {
        data.forEach(element => {
            let complimentData = element.data();
            let complimentId = element.id;
            let complimentText = complimentData.compliment;
            let complimentType = complimentData.type;

            var clone = template.content.cloneNode(true);

            clone.querySelector('.compliment-text').innerHTML = `"${complimentText}"`;
            clone.querySelector('.compliment-type').innerHTML = complimentType;
            clone.querySelector('.select-btn').setAttribute('href', `../compliment-details.html?complimentId=${complimentId}`);
            console.log(clone);

            $('#browse-card-list').append(clone);
            // $('#browse-card-list').appendTo($newCard);
        });
    });
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

function setUp() {
    loadComplimentCards();
}

$(document).ready(setUp);