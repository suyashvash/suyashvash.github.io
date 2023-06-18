import React from "react";
import ProjectCard from "./projectCard";
import instaPic from "../res/projects/instaClone.jpg";
import netf from "../res/projects/netflix.jpg";
import sL from "../res/projects/skilline.jpg";

let about1 =
  "This is an Instagram Clone made in React Native Js. It Took me 5hrs to make it. It is my first ever clone. I made it while learning React Js and React native. I learned so many new things while developing it. ";
let about2 =
  "This is a Netflix Clone made in React Natie Js. It took me 6hrs to make this project. I made this Project in order give myself a challenge and test my skills so I can learn better. It has 3 Screen, Home/Browse ,Upcoming Shows ,Downloads. ";
let aboutSl =
  "Skillline is an Online Study tool. I made this It's Landing page. It demonstrates Skilllines features, Services, and About the App, I made it using HTML CSS React Js and JavaScript ES6. It's UI in Inspired from a Dribble post. It is just and Demo Landing page with a Frontend..";

export default function Portfolio({ projRef, pValue }) {
  return (
    <section ref={projRef} id="portfolio" className="siteSection portfolio">
      <h1 className="head">PORTFOLIO</h1>

      <ProjectCard
        Name={"Skill Line"}
        Tech={"React Js | HTML CSS"}
        about={aboutSl}
        projectMedia={sL}
        flx={"odd"}
        projectGit={"https://suyashvash.github.io/"}
        projectLink={"Visit"}
      />
      <ProjectCard
        Name={"Netflix Clone"}
        Tech={"React Native"}
        about={about2}
        projectMedia={netf}
        flx={"even"}
        projectGit={"https://github.com/suyashvash/Netflix-clone-React-native"}
        projValue={pValue}
        projectLink={"Git"}
      />

      <ProjectCard
        Name={"Instagram clone"}
        Tech={"React Native"}
        about={about1}
        projectMedia={instaPic}
        flx={"odd"}
        projectGit={"https://github.com/suyashvash/Instagram-Clone-ReactNative-Js"}
        projValue={pValue}
        projectLink={"Git"}
      />
    </section>
  );
}
