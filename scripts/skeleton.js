function loadSkeleton() {
    $('.inbox-card-placeholder').load('/templates/inbox-card.html');
    $('#navbarPlaceholder').load('./templates/nav.html');
    $('#navbar-back-btnPlaceholder').load('./templates/nav-back-btn.html');
    $('#footerPlaceholder').load('./templates/footer.html');
    // $('.browse-card-placeholder').load('/templates/browse-card.html');
    $('.detail-card-placeholder').load('/templates/compliment-detail-card.html');
}
loadSkeleton();