const serviceSection = document.getElementById('services');
const workSection = document.getElementById('work');
const aboutSection = document.getElementById('about');
const blogSection = document.getElementById('blogs');
const clientSection = document.getElementById('clients');

var crossService = document.getElementById('cross-service');
var iosService = document.getElementById('cross-ios');
var androidService = document.getElementById('cross-android');

var aboutTitle = document.getElementById('about-title');
var aboutImg = document.getElementById('about-img');
var aboutPara = document.getElementById('about-para');
var aboutCta = document.getElementById('about-cta');

var workTitle = document.getElementById('work-title');
var serviceTitle = document.getElementById('service-title');
var blogTitle = document.getElementById('blog-title');
var clientTitle = document.getElementById('test-title');

var macbook = document.getElementById('macbook');

const options = {
    root: null,
    threshold: 0.7
};

const aboutObserver = new IntersectionObserver(handleAboutIntersection, options);
const workObserver = new IntersectionObserver(handleWorkIntersection, options);
const serviceObserver = new IntersectionObserver(handleServiceIntersection, options);
const blogObserver = new IntersectionObserver(handleBlogIntersection, options);
const clientObserver = new IntersectionObserver(handleClientIntersection, options);



function calculatePercentage(entry) {
    const visibleHeight = entry.intersectionRect.height;
    const totalHeight = entry.boundingClientRect.height;
    const percentage = (visibleHeight / totalHeight) * 100;
    return Math.floor(percentage);
}

// Service Observer Function
function handleServiceIntersection(entries, observer) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const percentageInView = calculatePercentage(entry);
            if (percentageInView > 69) {
                gtag("event", "scroll_to_services");
                serviceTitle.classList.add('showTitle');
                crossService.classList.add('showService');
                androidService.classList.add('showService');
                iosService.classList.add('showService');
            }
        }
    });
}

// Work Observer Function
function handleWorkIntersection(entries, observer) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const percentageInView = calculatePercentage(entry);
            if (percentageInView > 69) {
                gtag("event", "scroll_to_work");
                macbook.classList.add('showMacbook');
                workTitle.classList.add('showTitle');
            }
        }
    });
}


// About Observer Function
function handleAboutIntersection(entries, observer) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const percentageInView = calculatePercentage(entry);
            if (percentageInView > 50) {
                gtag("event", "scroll_to_about");
                aboutTitle.classList.add('showTitle');
                aboutImg.classList.add('showAboutImg');
                aboutPara.classList.add('showAboutPara');
                aboutCta.classList.add('showAboutCta');
            }
        }
    });
}

// Blog Observer Function
function handleBlogIntersection(entries, observer) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const percentageInView = calculatePercentage(entry);
            if (percentageInView > 69) {
                gtag("event", "scroll_to_blog");
                blogTitle.classList.add('showTitle');
            }
        }
    });
}

// Client Observer Function
function handleClientIntersection(entries, observer) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const percentageInView = calculatePercentage(entry);
            if (percentageInView > 69) {
                gtag("event", "scroll_to_clients");
                clientTitle.classList.add('showTitle');
            }
        }
    });
}

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

function openContactModal() {
    gtag("event", "form_open");
    disableScroll();
    document.querySelector(".modal.backdrop").classList.add("show");
    document.querySelector(".contactModal-title").classList.add("showTitle");
}


function closeContactModal() {
    gtag("event", "form_close");
    enableScroll();
    document.querySelector(".modal.backdrop").classList.remove("show");
    document.querySelector(".contactModal-title").classList.remove("showTitle");
}



// Observers
serviceObserver.observe(serviceSection);
workObserver.observe(workSection);
aboutObserver.observe(aboutSection);
blogObserver.observe(blogSection);
clientObserver.observe(clientSection);



