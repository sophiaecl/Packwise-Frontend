import React from "react";
import styles from "../../pages/TripPage/TripPage.module.css";

function TabNavigation({ tabs, activeTab, onTabChange }) {
  return (
    <nav className={styles.tabs} role="tablist">
      {tabs.map((tab) => (
        <button
          key={tab}
          role="tab"
          aria-selected={activeTab === tab}
          className={activeTab === tab ? styles.tabactive : styles.tab}
          onClick={() => onTabChange(tab)}
        >
          {tab}
        </button>
      ))}
    </nav>
  );
}

export default TabNavigation;
