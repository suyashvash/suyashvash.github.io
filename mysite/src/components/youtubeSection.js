import { React } from "react";
import "../App.css";

export default function Youtube(params) {
  return (
    <section id="youtube" className="siteSection latestSection">
      <div className="ytText">
        <h1 className="head">My Youtube Channel</h1>
        <h2 className="ytName">aka Coding Knight</h2>
        <h3>Here are some of my latest courses !</h3>
      </div>
      <div className="latestHolder">
        <iframe title="y1" className="ytlat" src="https://www.youtube.com/embed/videoseries?list=PLAm5kWzgrn9ZpFd8UI0S4mvDOKsTBrWlf" frameBorder="0" allow="autoplay; encrypted-media" allowFullScreen></iframe>
        <iframe title="y2" className="ytlat" src="https://www.youtube.com/embed/videoseries?list=PLAm5kWzgrn9ZSOgkF7cnb1RO_WCp_W-ef" frameBorder="0" allow="autoplay; encrypted-media" allowFullScreen ></iframe>
      </div>
      <a rel="noreferrer" className="visitChannel" target="_blank" href="https://www.youtube.com/c/CodingKnight/">Visit Channel</a>
    </section>
  );
}
