
function openMenu() {
    disableScroll();
    document.querySelector(".menu.backdrop").classList.add("showMenu");
}

function closeMenu() {
    enableScroll();
    document.querySelector(".menu.backdrop").classList.remove("showMenu");
}
