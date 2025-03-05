import React from "react";
import FeatureCard from "../FeatureCard/FeatureCard";
import styles from "./FeatureSection.module.css";

function FeatureSection() {
  const features = [
    {
      title: "AI-Powered Lists",
      description:
        "Smart suggestions based on your destination, weather, and activities",
      background: "https://cdn.builder.io/api/v1/image/assets/TEMP/cf45f7fec0c18a73f30d2a21c3673cb1cad55c93",
      alt: "Palm tree background"
    },
    {
      title: "Fully Customizable",
      description: "Add, remove, or modify items to match your specific needs",
      background: "https://cdn.builder.io/api/v1/image/assets/TEMP/0d8ce44c7da49ad93f7def685cc014f32998c50a",
      alt: "Beach background"
    },
    {
      title: "Access Anywhere",
      description: "Your packing lists are synced across all your devices",
      background: "https://cdn.builder.io/api/v1/image/assets/TEMP/6c57f055dd12cda3cdd5d51b47b8ea93581b6988",
      alt: "Cactus background"
    },
  ];

  return (
    <section className={styles.featureSection}>
      {features.map((feature, index) => (
        <div key={index} className={styles.featureContainer}>
          <img 
            src={feature.background} 
            alt={feature.alt}
            className={styles.backgroundImage}
          />
          <FeatureCard
            title={feature.title}
            description={feature.description}
          />
        </div>
      ))}
    </section>
  );
}

export default FeatureSection;
