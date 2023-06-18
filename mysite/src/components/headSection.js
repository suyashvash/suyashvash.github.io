import React from "react";
import "../App.css";

export default function Header({ name, job, github, linkdin, insta, yt }) {
  return (
    <section className="siteSection headParent">
      <h1>{name}</h1>
      <h3>{job}</h3>
      <div className="socialHolder">
        <a rel="noreferrer" target="blank" href={github} className="social">
          <i id="Sicon" className="fa fa-github"></i>
        </a>

        <a rel="noreferrer" target="blank" href={linkdin} className="social">
          <i id="Sicon" className="fa fa-linkedin"></i>
        </a>

        <a rel="noreferrer" target="blank" href={insta} className="social">
          <i id="Sicon" className="fa fa-instagram"></i>
        </a>

        <a rel="noreferrer" target="blank" href={yt} className="social">
          <i id="Sicon" className="fa fa-youtube"></i>
        </a>
      </div>

      <div className="pageNav">
        <a rel="noreferrer" href="#about" className="navAnchor">
          About
        </a>
        <a rel="noreferrer" href="#myskills" className="navAnchor">
          Services
        </a>
        <a rel="noreferrer" href="#portfolio" className="navAnchor">
          My Works
        </a>
        <a rel="noreferrer" href="#youtube" className="navAnchor">
          My YouTube
        </a>
        <a rel="noreferrer" href="#contact" className="navAnchor">
          Contact
        </a>
      </div>
    </section>
  );
}
