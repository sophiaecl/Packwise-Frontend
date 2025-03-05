import React from "react";
import styles from "./FeatureCard.module.css";

function FeatureCard({ title, description }) {
  return (
    <article className={styles.featureCard}>
      <div className={styles.featureContent}>
        <h3 className={styles.featureTitle}>{title}</h3>
        <p className={styles.featureDescription}>{description}</p>
      </div>
    </article>
  );
}

export default FeatureCard;
