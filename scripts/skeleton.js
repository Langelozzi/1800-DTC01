function loadSkeleton() {
    $('.inbox-card-placeholder').load('/templates/inbox-card.html');
    $('#navbarPlaceholder').load('./text/nav.html');
    $('#footerPlaceholder').load('./text/footer.html');
}
loadSkeleton();