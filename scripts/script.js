// calculating the top of the bottom nav and placing right above
function setSendSectionPosition() {
    $('#send-section').css({
        'bottom': $('#bottom-nav').outerHeight() + 30 + 'px'
    })
}

function setUp() {
    setSendSectionPosition();
}

$(document).ready(setUp);