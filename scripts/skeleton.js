function loadSkeleton() {
    $('#navbar-placeholder').load('../templates/nav.html');
    $('#navbar-back-btn-placeholder').load('../templates/nav-back-btn.html');
    $('#navbar-no-account-iconPlaceholder').load('../templates/nav-no-account-icon.html');
    $('#footerEmptyPlaceholder').load('../templates/footer-empty.html');
    $('#footer-placeholder').load('../templates/footer.html');
}
loadSkeleton();