import React from "react";
import "../App.css";

const About = ({ name, job, bio, picUrl, tag1, tag2, tag3, tag4, moveRef, refValue1 }) => {
  return (
    <div>
      <section className="siteSection about">
        <div id="about" ref={moveRef} className="aboutWrapper">
          <div className={`picHolder${refValue1 ? " picHolderRevealed" : ""}`}>
            <img loading="lazy" className="mypic" src={picUrl} alt="My Profile Photo" />
          </div>
          <div className={`aboutHolder${refValue1 ? " aboutHolderRevealed" : ""}`}>
            <h1 className="aboutHead">{name}</h1>
            <h3 className="aboutTag">{job}</h3>
            <p className="aboutPara">{bio}</p>

            <div className="skillTags">
              <span className="tags">{tag1}</span>
              <span className="tags">{tag2}</span>
              <span className="tags">{tag3}</span>
              <span className="tags">{tag4}</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
