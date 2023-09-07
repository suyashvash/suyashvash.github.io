import React, { useEffect, useRef, useState } from "react";
import "./home_styles.css";
import { OutlineButton } from "../../components";
import { HomeAssets, MobileMockups } from "../../assets/images";

export default function HomePage() {
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const [currentSection, setCurrentSection] = useState(0);

  const heroRef = useRef(null);
  const aboutRef = useRef(null);
  const servicesRef = useRef(null);
  const projectsRef = useRef(null);
  const contactRef = useRef(null);

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
      title: "Services",
      href: "/services",
      id: 2,
    },
    {
      title: "Projects",
      href: "/projects",
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
    if (
      scrollPosY < heroRef.current.getBoundingClientRect().height &&
      scrollPosY > 0
    ) {
      setCurrentSection(0);
    }
    if (aboutRef.current.getBoundingClientRect().top <= 50) {
      setCurrentSection(1);
    }

    if (servicesRef.current.getBoundingClientRect().top <= 50) {
      setCurrentSection(2);
    }

    // if(projectsRef.current.getBoundingClientRect().top <=50 ){
    //   setCurrentSection(3);
    // }

    // if(contactRef.current.getBoundingClientRect().top <=50 ){
    //   setCurrentSection(4);
    // }
  };

  return (
    <div className="page flexbox home_page">
      <div className="home_indexer">
        {sections.map((section) => (
          <div
            key={section.id}
            className={
              currentSection == section.id
                ? "index_cover active_index"
                : "index_cover inactive_index"
            }
          >
            <div
              className={
                currentSection == section.id
                  ? "indexer_circle active"
                  : "indexer_circle inactive"
              }
            ></div>
          </div>
        ))}
      </div>

      <section ref={heroRef} className="hero_section">
        <div className="hero_bg_holder">
          <img src={MobileMockups.MobileOne} className="hero_bg mobile m_one" />
          <img
            src={MobileMockups.MobileFour}
            className="hero_bg mobile m_four"
          />
          <img src={MobileMockups.MobileTwo} className="hero_bg mobile m_two" />
          <img
            src={MobileMockups.MobileThree}
            className="hero_bg mobile m_three"
          />
        </div>
        {/* <div className="container_bg">
          <img src={HomeAssets.Rocket} className="rocket" />
 
          <img src={HomeAssets.Bubble} className="bubble" />

        </div> */}
        <div className="hero_container">
          <span className="tag no_dash">Mobile App Developer</span>
          <h2 className="tagline">
            Driven by Your Ideas,
            <br /> Powered by My Skills 🧑🏻‍💻
          </h2>
          <OutlineButton title="Get in Touch" href="/contact" />
        </div>
      </section>

      <section ref={aboutRef} className="about_section">
        <span className="tag about-tag">ABOUT ME</span>
        <div className="about_wrapper">
          <div className="illustration_container">
            <div className="exp-holder">
              <span className="exp-amount">4</span>
              <span className="exp-text">years of industry experience</span>
            </div>
            <img src={HomeAssets.aboutImage} className="about_image" />
          </div>

          <div className="about_container">
            <h2 className="tagline about">
              <span className="tag no_dash">Hello, I am</span>
              <br /> Suyash Vashishtha
            </h2>
            <p className="description">
              A Freelance mobile app developer with 4 years of experience,
              specializing in crafting digital solutions for startups and
              business owners like you. Over the years, I've had the privilege
              of working with both national and international brands, delivering
              innovative and elegant mobile applications. My expertise lies in
              React Native, Swift UI, and Kotlin, ensuring that your app is not
              just functional but also optimized and scalable for your
              business's unique needs.
            </p>
            <p style={{ color: "white" }} className="description">
              Have an Idea ?{" "}
              <a className="app_link highlight">Let's talk !</a>
            </p>
          </div>
        </div>
      </section>

      <section ref={servicesRef} className="services_section">
        <span className="tag about-tag">SERVICES</span>
        <div className="services_wrapper">
          <div className="service_card"></div>

          <div className="service_card"></div>

          <div className="service_card"></div>
        </div>
      </section>
    </div>
  );
}
