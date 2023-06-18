import React from "react";
import "../App.css";

export default function Skills({ skillNameLeft, skillImageLeft, skillUsageLeft, skillNameRight, skillImageRight, skillUsageRight, skillNameMid, skillImageMid, skillUsageMid, moveRef, refValue3 }) {
  return (
    <section id="myskills" className="siteSection skills">
      <div className="skillWrapper">
        <div className="skillCard">
          <div className={`skillC L${refValue3 ? "skillC LRevealed" : ""}`}>
            <img loading="lazy" className="sImg Limg" src={skillImageLeft} alt="React Js Framework" />
            <h2>{skillNameLeft}</h2>
            <div className="hideData">
              <h4 className="usage">{skillUsageLeft}</h4>
            </div>
          </div>
        </div>

        <div className="skillCard">
          <div ref={moveRef} className={`skillC M${refValue3 ? "skillC MRevealed" : ""}`}>
            <img loading="lazy" className="sImg Mimg" src={skillImageMid} alt="React Native" />
            <h2>{skillNameMid}</h2>
            <div className="hideData">
              <h4 className="usage">{skillUsageMid}</h4>
            </div>
          </div>
        </div>

        <div className="skillCard">
          <div className={`skillC R${refValue3 ? "skillC RRevealed" : ""}`}>
            <img loading="lazy" className="sImg Rimg" src={skillImageRight} alt="HTML CSS JS" />
            <h2>{skillNameRight}</h2>
            <div className="hideData">
              <h4 className="usage">{skillUsageRight}</h4>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
