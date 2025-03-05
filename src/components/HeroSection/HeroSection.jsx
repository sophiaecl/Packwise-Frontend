import React from "react";
import styles from "./HeroSection.module.css";

function HeroSection() {
  return (
    <section className={styles.heroSection}>
      <h2 className={styles.heroTitle}>Start Packing Smarter</h2>
      <p className={styles.heroSubtitle}>
        AI-powered packing lists customized for your destination and travel
        style
      </p>
    </section>
  );
}

export default HeroSection;
