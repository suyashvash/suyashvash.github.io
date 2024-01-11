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



function openContactModal() {
    disableScroll();
    document.querySelector(".modal.backdrop").classList.add("show");
    document.querySelector(".contactModal-title").classList.add("showTitle");
}

function closeContactModal() {
    enableScroll();
    document.querySelector(".modal.backdrop").classList.remove("show");
    document.querySelector(".contactModal-title").classList.remove("showTitle");
}



const submitForm = async () => {
    gtag("event", "form_submit");
    var name = document.getElementById("inputName").value;

    var email = document.getElementById("inputEmail").value;
    var message = document.getElementById("inputMessage").value;
    var serviceType = document.querySelector('input[name="service"]:checked')?.value || null;
    var formButton = document.getElementById("formButton")
    var closeButton = document.getElementById("closeForm")

    const dateTime = new Date().getTime();

    var mailformat = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/

    if (name == "") {
        alert("Please Enter your First Name !")
        return
    }

    if (email == "") {
        alert("Please Enter your Email !")
        return
    }

    if (!email.match(mailformat)) {
        alert("You have entered an invalid email address!")
        return
    }

    if (serviceType == null) {
        alert("Please Select a Service !")
        return
    }
    if (message == "") {
        alert("Please Enter your Message !")
        return
    }

    if (name == "" || email == "" || message == "") {
        alert("Please fill all the fields")
        return
    } else {
        const body = {
            email,
            firstname: name,
            lastname: name,
            message: message,
            sentOn: `${new Date()}`,
            timestamp: dateTime,
            status: "none",
        }
        formButton.innerHTML = "Loading..."
        formButton.onclick = null
        formButton.style.cursor = "not-allowed"
        formButton.style.opacity = "0.5"

        closeButton.style.cursor = "not-allowed"
        closeButton.style.opacity = "0.5"
        closeButton.onclick = null


        fetch("https://suyashvashishthabackend.azurewebsites.net/api/v8/enquiries/submit", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        }).then(res => res.json())
            .then(data => {
                gtag("event", "form_submit_success");
                alert("Thank you for contacting me. I will get back to you soon.")

                formButton.innerHTML = "Submit"
                formButton.onclick = submitForm
                formButton.style.cursor = "pointer"
                formButton.style.opacity = "1"

                closeButton.style.cursor = "pointer"
                closeButton.style.opacity = "1"
                closeButton.onclick = closeContactModal



            }).catch(err => {
                gtag("event", "form_submit_error");
                alert("Something went wrong. Please try again later.")

                formButton.innerHTML = "Submit"
                formButton.onclick = submitForm
                formButton.style.cursor = "pointer"
                formButton.style.opacity = "1"

                closeButton.style.cursor = "pointer"
                closeButton.style.opacity = "1"
                closeButton.onclick = closeContactModal
            })



    }
}