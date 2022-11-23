function loadSkeleton() {
    $('#navbarPlaceholder').load('./templates/nav.html');
    $('#navbar-back-btnPlaceholder').load('./templates/nav-back-btn.html');
    $('#navbar-no-account-iconPlaceholder').load('./templates/nav-no-account-icon.html');
    $('#footerEmptyPlaceholder').load('./templates/footer-empty.html');
    $('#footerPlaceholder').load('./templates/footer.html');
}
loadSkeleton();