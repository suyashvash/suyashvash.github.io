import React, { useEffect, useState } from "react";
import "./hero_styles.css";
import { OutlineButton } from "../../../components";

export default function HeroSection() {
  return (
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
  );
}
