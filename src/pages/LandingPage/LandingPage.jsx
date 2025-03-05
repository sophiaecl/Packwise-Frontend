import React from "react";
import Header from "../../components/Header/Header";
import HeroSection from "../../components/HeroSection/HeroSection";
import FeaturesSection from "../../components/FeatureSection/FeatureSection";
import BackgroundImage from "../../components/BackgroundImage/BackgroundImage";
import styles from "./LandingPage.module.css";

function LandingPage() {
  return (
    <div className={styles.app}>
      <Header />
      <main className={styles.mainContent}>
        <HeroSection />
        <FeaturesSection />
      </main>
    </div>
  );
}

export default LandingPage;
