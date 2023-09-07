import React from "react";
import "./nav_styles.css";

export default function NavBar() {

  let activeRoute = window.location.pathname;



  return (
    <div className="navbar">
      <div className="navbar_wrapper">

      <div className="navbar__links">
          <a className="nav_links app_link active" href="/">HOME</a>
          <a className="nav_links app_link" href="/about">ABOUT</a>
          <a className="nav_links app_link" href="/projects">PROJECTS</a>
          <a className="nav_links app_link" href="/contact">CONTACT</a>
        </div>


        <div className="navbar__logo">
          <h3>Suyash Vashishtha</h3>
        </div>

        <div className="navbar__social">
          <a className="nav_links app_link"
            href="
            https://www.linkedin.com/in/andrew-lee-3a1b1b1b1/
            "
          >
            LinkedIn
          </a>

          <a className="nav_links app_link"
            href="
            https://www.linkedin.com/in/andrew-lee-3a1b1b1b1/
            "
          >
            LinkedIn
          </a>
          <a className="nav_links app_link"
            href="
            https://www.linkedin.com/in/andrew-lee-3a1b1b1b1/
            "
          >
            LinkedIn
          </a>
        </div>
      </div>
    </div>
  );
}
