import React from "react";
import FeatureCard from "../FeatureCard/FeatureCard";
import styles from "./FeatureSection.module.css";

function FeatureSection() {
  const features = [
    {
      title: "AI-Powered Lists",
      description:
        "Smart suggestions based on your destination, weather, and activities",
    },
    {
      title: "Fully Customizable",
      description: "Add, remove, or modify items to match your specific needs",
    },
    {
      title: "Access Anywhere",
      description: "Your packing lists are synced across all your devices",
    },
  ];

  return (
    <section className={styles.featureSection}>
      {features.map((feature, index) => (
        <FeatureCard
          key={index}
          title={feature.title}
          description={feature.description}
        />
      ))}
    </section>
  );
}

export default FeatureSection;
