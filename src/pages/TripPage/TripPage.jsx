import React, { useState } from "react";
import styles from "./TripPage.module.css";
import Header from "../../components/Header/Header";
import TabNavigation from "../../components/TripPage/TabNavigation";
import ContentPanel from "../../components/TripPage/ContentPanel";

const TripPage = () => {
  const [activeTab, setActiveTab] = useState("Trip Info");

  const tabs = [
    "Trip Info",
    "Trip Weather",
    "Packing Lists",
    "Activities",
    "Tips",
  ];

  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&display=swap"
        rel="stylesheet"
      />
      <div className={styles.app}>
        <Header />
        <main className={styles.mainContent}>
          <h1 className={styles.title}>Paris, France</h1>
          <time className={styles.date}>March 15-17, 2024</time>
          <TabNavigation
            tabs={tabs}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />
          <ContentPanel activeTab={activeTab} />
        </main>
      </div>
    </>
  );
};

export default TripPage;
