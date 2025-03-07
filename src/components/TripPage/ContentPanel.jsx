import React, { useState } from "react";
import styles from "../../pages/TripPage/TripPage.module.css";

function ContentPanel({ activeTab, tripData }) {
  const [isEditing, setIsEditing] = useState(false);

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString.replace(/\//g, '-'));
    return date.toLocaleDateString('en-US', {
      year: 'numeric', 
      month: 'long', 
      day: 'numeric'
    });
  };

  // Render content based on active tab
  const renderContent = () => {
    switch (activeTab) {
      case "Trip Info":
        return (
          <div className={styles.detailsCard}>
            <dl className={styles.detailsList}>
              <div className={styles.detailItem}>
                <dt>City:</dt>
                <dd>{tripData?.city || "Not specified"}</dd>
              </div>
              <div className={styles.detailItem}>
                <dt>Country:</dt>
                <dd>{tripData?.country || "Not specified"}</dd>
              </div>
              <div className={styles.detailItem}>
                <dt>Start date:</dt>
                <dd>{formatDate(tripData?.start_date) || "Not specified"}</dd>
              </div>
              <div className={styles.detailItem}>
                <dt>End date:</dt>
                <dd>{formatDate(tripData?.end_date) || "Not specified"}</dd>
              </div>
              <div className={styles.detailItem}>
                <dt>Luggage type:</dt>
                <dd>{tripData?.luggage_type || "Not specified"}</dd>
              </div>
              <div className={styles.detailItem}>
                <dt>Trip purpose:</dt>
                <dd>{tripData?.trip_purpose || "Not specified"}</dd>
              </div>
            </dl>
          </div>
        );
      case "Trip Weather":
        return (
          <div className={styles.detailsCard}>
            <p>Weather information will be displayed here.</p>
            {/* Weather data would be fetched and displayed here */}
          </div>
        );
      case "Packing Lists":
        return (
          <div className={styles.detailsCard}>
            <p>Packing lists will be displayed here.</p>
            {/* Packing lists would be fetched and displayed here */}
          </div>
        );
      case "Activities":
        return (
          <div className={styles.detailsCard}>
            <p>Activities will be displayed here.</p>
            {/* Activities would be fetched and displayed here */}
          </div>
        );
      case "Tips":
        return (
          <div className={styles.detailsCard}>
            <p>Travel tips will be displayed here.</p>
            {/* Travel tips would be fetched and displayed here */}
          </div>
        );
      default:
        return <div>Select a tab to view content</div>;
    }
  };

  return (
    <section className={styles.contentPanel} role="tabpanel">
      <div className={styles.panelHeader}>
        <h2 className={styles.panelTitle}>{activeTab}</h2>
        <button 
          className={styles.updateButton}
          onClick={() => setIsEditing(!isEditing)}
        >
          {isEditing ? "save" : "update"}
        </button>
      </div>
      {renderContent()}
    </section>
  );
}

export default ContentPanel;
