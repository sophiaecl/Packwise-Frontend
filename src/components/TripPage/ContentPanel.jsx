import React from "react";
import styles from "../../pages/TripPage/TripPage.module.css";

function ContentPanel({ activeTab }) {
  return (
    <section className={styles.contentPanel} role="tabpanel">
      <div className={styles.panelHeader}>
        <h2 className={styles.panelTitle}>Trip Details</h2>
        <button className={styles.updateButton}>update</button>
      </div>
      <div className={styles.detailsCard}>
        <dl className={styles.detailsList}>
          <div className={styles.detailItem}>
            <dt>City:</dt>
          </div>
          <div className={styles.detailItem}>
            <dt>Country:</dt>
          </div>
          <div className={styles.detailItem}>
            <dt>Start date:</dt>
          </div>
          <div className={styles.detailItem}>
            <dt>End date:</dt>
          </div>
          <div className={styles.detailItem}>
            <dt>Luggage type:</dt>
          </div>
          <div className={styles.detailItem}>
            <dt>Trip purpose:</dt>
          </div>
        </dl>
      </div>
    </section>
  );
}

export default ContentPanel;
