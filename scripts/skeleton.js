function loadSkeleton() {
    $('.inbox-card-placeholder').load('/templates/inbox-card.html');
    $('#navbarPlaceholder').load('./text/nav.html');
    $('#navbar-back-btnPlaceholder').load('./text/nav-back-btn.html');
    $('#footerPlaceholder').load('./text/footer.html');
}
loadSkeleton();