import React,{useEffect,useState} from "react";
import "./home_styles.css";
import { OutlineButton } from "../../components";

export default function HomePage() {

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);


  const [currentSection, setCurrentSection] = useState(0);

  const sections = [
    {
      title: "Home",
      href: "/",
      id: 0,
    },
    {
      title: "About",
      href: "/about",
      id: 1,
    },
    {
      title: "Projects",
      href: "/projects",
      id: 2,
    },
    {
      title: "Services",
      href: "/services",
      id: 3,
    },
    {
      title: "Contact",
      href: "/contact",
      id: 4,
    },
  ];

  const handleScroll = () => {
    let scrollPosY = window.scrollY;

    if(scrollPosY < 963){
      setCurrentSection(0);
    }else if (scrollPosY > 960){
      setCurrentSection(1);
    }
  };


  return (
    <div className="page flexbox home_page">

      <div className="home_indexer">
        {sections.map((section) => (
          <div className={currentSection==section.id ? "index_cover active_index" : "index_cover inactive_index"}>
              <div className={currentSection==section.id ? "indexer_circle active" : "indexer_circle inactive"} onClick={() => setCurrentSection(section.id)}></div>
          </div>
        ))}
      </div>


      <section className="hero_section">
        <div className="hero_container">
          <span className="hero_me">Hi, I am Suyash Vashishtha</span>
          <h2 className="tagline">
            Turning Ideas,
            <br />
            Into Realties
          </h2>
          <OutlineButton title="Get in Touch" href="/contact" />
        </div>
      </section>

      <section className="hero_section">
        <div className="hero_container">
          <span className="hero_me">Hi, I am Suyash Vashishtha</span>
          <h2 className="tagline">
            Turning Ideas,
            <br />
            Into Realties
          </h2>
          <OutlineButton title="Get in Touch" href="/contact" />
        </div>
      </section>

      
    </div>
  );
}
