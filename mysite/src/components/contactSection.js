import { React, useState } from "react";
import "../App.css";
import { projectFirestore } from "../components/firebase/config";

export default function Contact() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const submitForm = async () => {
    const dateTime = new Date().getTime();

    if (firstName !== "" || lastName !== "" || email !== "" || message !== "") {
      const data = {
        email: email,
        firstName: firstName,
        lastName: lastName,
        message: message,
        sentOn: new Date(),
        timeStamp: dateTime,
        status: "",
      };

      const collectionRef = projectFirestore
        .collection("enquiries")
        .doc(`${dateTime}`)
        .set(data);
      setFirstName("");
      setLastName("");
      setEmail("");
      setMessage("");
    } else { alert("Plese fill all the fields"); }
  };

  return (
    <section id="contact" className="siteSection contactSection">
      <div className="container">
        <div className="column">
          <h1 className="head">Contact Me</h1>
          <form>
            <label htmlFor="fname">First Name</label>
            <input type="text" id="fname" name="firstname" placeholder="Your name.." value={firstName} onChange={(e) => setFirstName(e.target.value)}
            />
            <label htmlFor="lname">Last Name</label>
            <input type="text" id="lname" name="lastname" placeholder="Your last name.." value={lastName} onChange={(e) => setLastName(e.target.value)}
            />
            <label htmlFor="email">Email</label>
            <input type="text" id="lname" name="email" placeholder="name@company.com" value={email} onChange={(e) => setEmail(e.target.value)}
            />
            <label htmlFor="subject">Subject</label>
            <textarea id="subject" name="subject" placeholder="Write something.." value={message} onChange={(e) => setMessage(e.target.value)}></textarea>
            <a onClick={submitForm}>Submit</a>
          </form>
        </div>
      </div>
    </section>
  );
}
