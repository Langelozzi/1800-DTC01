function loadSkeleton() {
    $('#navbarPlaceholder').load('./templates/nav.html');
    $('#navbar-back-btnPlaceholder').load('./templates/nav-back-btn.html');
    $('#navbar-no-account-iconPlaceholder').load('./templates/nav-no-account-icon.html');
    $('#footerPlaceholder').load('./templates/footer.html');
}
loadSkeleton();