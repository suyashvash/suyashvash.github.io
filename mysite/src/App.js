import React, { useLayoutEffect, useRef, useState } from "react";
import "./App.css";
import Header from "./components/headSection";
import About from "./components/aboutSection";
import Skills from "./components/skillSection";
import devPic from "./res/myPic.jpg";
import Youtube from "./components/youtubeSection";
import Rjs from "./res/logos/react.png";
import RN from "./res/logos/rn.png";
import HTCSS from "./res/logos/html.png";
import Portfolio from "./components/portfolioSection";
import Contact from "./components/contactSection";

const App = () => {
  const [show, doShow] = useState({
    itemOne: false, itemThree: false, itemFour: false,
  });
  const ourRef = useRef(null),
    cardRef = useRef(null),
    projectRef = useRef(null);

  useLayoutEffect(() => {
    const bottomPos = (element) => element.getBoundingClientRect().bottom;
    //added to reduce redundancy
    const div1Pos = bottomPos(ourRef.current),
      LPos = bottomPos(cardRef.current);

    const topPos = (element) => element.getBoundingClientRect().top;
    const pPos = topPos(projectRef.current);

    const onScroll = () => {
      const scrollPos = window.scrollY + window.innerHeight;
      if (div1Pos < scrollPos) { doShow((state) => ({ ...state, itemOne: true })); }
      if (LPos < scrollPos) { doShow((state) => ({ ...state, itemThree: true })); }
      if (pPos < scrollPos) { doShow((state) => ({ ...state, itemFour: true })); }
    };

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <Header
        name={"Suyash Vashishtha"}
        job={"< Frontend Dev />"}
        github={"https://github.com/suyashvash"}
        insta={"https://www.instagram.com/suyash.codes/"}
        yt={"https://www.youtube.com/c/CodingKnight"}
        linkdin={"https://www.linkedin.com/in/suyash-vashishtha-32188717b/"}
      />

      <About
        name={"Suyash Vashishtha"}
        job={"Front-end dev"}
        bio={"Hello I am Suyash from India. I am a Front-end dev. With 3 years of experience in web dev I make clean and outstanding UI/UX Websites or Apps. With a passion-driven spirit, I code apps and website with clean and maintainable code."}
        picUrl={devPic}
        tag1={"React Js"}
        tag2={"React Native"}
        tag3={"HTML CSS"}
        tag4={"JavaScript"}
        moveRef={ourRef}
        refValue1={show.itemOne}
      />

      <Skills
        moveRef={cardRef}
        refValue3={show.itemThree}
        skillNameLeft={"React Js"}
        skillImageLeft={Rjs}
        skillUsageLeft={"Websites"}
        skillNameMid={"React Native"}
        skillImageMid={RN}
        skillUsageMid={"Mobile Apps"}
        skillNameRight={"HTML CSS"}
        skillImageRight={HTCSS}
        skillUsageRight={"Scratch Websites"}
      />

      <Portfolio projRef={projectRef} pValue={show.itemFour} />

      <Youtube />
      <Contact />
    </>
  );
};

export default App;
