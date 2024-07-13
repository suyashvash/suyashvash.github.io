function disableScroll() {
    // Get the current page scroll position
    scrollTop =
        window.pageYOffset ||
        document.documentElement.scrollTop;
    scrollLeft =
        window.pageXOffset ||
        document.documentElement.scrollLeft,

        // if any scroll is attempted,
        // set this to the previous value
        window.onscroll = function () {
            window.scrollTo(scrollLeft, scrollTop);
        };
}

function enableScroll() {
    window.onscroll = function () { };
}


function openTest(className) {
    gtag("event", `open_client_${className}`);
    disableScroll();
    document.querySelector(".test.backdrop").classList.add("show");
    document.querySelector(`.testModal.${className}`).classList.add("showTest");

}

function closeTest(className) {
    gtag("event", `close_client_${className}`);
    enableScroll();
    document.querySelector(".test.backdrop").classList.remove("show");
    document.querySelector(`.testModal.${className}`).classList.remove("showTest");
}

