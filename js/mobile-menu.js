function toggleMobileMenu() {
  document.getElementById('header-actions').classList.toggle('mobile-open');
}
document.addEventListener('click', function (e) {
  const menu = document.getElementById('header-actions');
  const toggle = document.getElementById('mobile-menu-toggle');
  if (!menu || !toggle) return;
  if (menu.classList.contains('mobile-open') &&
      !menu.contains(e.target) && !toggle.contains(e.target)) {
    menu.classList.remove('mobile-open');
  }
});
