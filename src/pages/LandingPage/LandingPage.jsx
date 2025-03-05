import React from "react";
import Header from "../../components/LandingPage/Header/Header";
import HeroSection from "../../components/LandingPage/HeroSection/HeroSection";
import FeaturesSection from "../../components/LandingPage/FeatureSection/FeatureSection";
import BackgroundImage from "../../components/LandingPage/BackgroundImage/BackgroundImage";
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
