import { db, collection, addDoc } from './firebase-config.js';

function enableScroll() {
    window.onscroll = function () { };
}


function closeContactModal() {
    gtag("event", "form_close");
    enableScroll();
    document.querySelector(".modal.backdrop").classList.remove("show");
    document.querySelector(".contactModal-title").classList.remove("showTitle");
}



async function submitForm() {


    gtag("event", "form_submit");
    var name = document.getElementById("inputName").value;

    var email = document.getElementById("inputEmail").value;
    var message = document.getElementById("inputMessage").value;
    var serviceType = document.querySelector('input[name="service"]:checked')?.value || null;
    var formButton = document.getElementById("formButton")
    var closeButton = document.getElementById("closeForm")

    const dateTime = new Date().getTime();
    const userAgent = navigator.userAgent;
    const referrer = document.referrer;
    const language = navigator.language || navigator.userLanguage;


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
            name,
            service: serviceType,
            message: message,
            sentOn: `${new Date()}`,
            timestamp: dateTime,
            status: "none",
            userAgent,
            referrer,
            language,

        }
        formButton.innerHTML = "Loading..."
        formButton.onclick = null
        formButton.style.cursor = "not-allowed"
        formButton.style.opacity = "0.5"

        closeButton.style.cursor = "not-allowed"
        closeButton.style.opacity = "0.5"
        closeButton.onclick = null


        try {
            await addDoc(collection(db, 'leads'), body);
            gtag("event", "form_submit_success");
            alert("Thank you for contacting me. I will get back to you soon.")

            formButton.innerHTML = "Submit"
            formButton.onclick = submitForm
            formButton.style.cursor = "pointer"
            formButton.style.opacity = "1"

            closeButton.style.cursor = "pointer"
            closeButton.style.opacity = "1"
            closeButton.onclick = closeContactModal
        } catch (error) {
            console.error('Error adding document: ', error);

            if (error.code === "permission-denied") {
                gtag("event", "form_permission_denied");
            }

            if (error.code === "unavailable") {
                gtag("event", "form_unavailable");
            }

            if (error.code === "resource-exhausted") {
                gtag("event", "form_resource_exhausted");
            }

            if (error.code === "internal") {
                gtag("event", "form_internal_error");
            }

            if (error.code === "cancelled") {
                gtag("event", "form_cancelled");
            }

            if (error.code === "deadline-exceeded") {
                gtag("event", "form_deadline_exceeded");
            }


            gtag("event", "form_submit_error");
            alert("Something went wrong. Please try reaching me out on suyashvashishtha@gmail.com !")

            formButton.innerHTML = "Submit"
            formButton.onclick = submitForm
            formButton.style.cursor = "pointer"
            formButton.style.opacity = "1"

            closeButton.style.cursor = "pointer"
            closeButton.style.opacity = "1"
            closeButton.onclick = closeContactModal
        }

    }
}

// Export the function to use in HTML
export { submitForm };