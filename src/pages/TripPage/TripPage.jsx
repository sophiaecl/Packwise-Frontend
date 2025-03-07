import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import styles from "./TripPage.module.css";
import Header from "../../components/Header/Header";
import TabNavigation from "../../components/TripPage/TabNavigation";
import ContentPanel from "../../components/TripPage/ContentPanel";
import { tripService } from "../../services/api";

const TripPage = () => {
  const { tripId } = useParams(); // Get the tripId from URL parameters
  const [activeTab, setActiveTab] = useState("Trip Info");
  const [tripData, setTripData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const tabs = [
    "Trip Info",
    "Trip Weather",
    "Packing Lists",
    "Activities",
    "Tips",
  ];

  // Fetch trip data when component mounts or tripId changes
  useEffect(() => {
    const fetchTripData = async () => {
      try {
        setLoading(true);
        const data = await tripService.getTrip(tripId);
        setTripData(data.data);
        setError(null);
      } catch (err) {
        console.error("Error fetching trip data:", err);
        setError("Failed to load trip data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    if (tripId) {
      fetchTripData();
    }
  }, [tripId]);

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

  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&display=swap"
        rel="stylesheet"
      />
      <div className={styles.app}>
        <Header />
        <main className={styles.mainContent}>
          <Link to="/dashboard" className={styles.returnButton}>
            ← Return to Dashboard
          </Link>
          {loading ? (
            <div className={styles.loadingContainer}>
              <p>Loading trip details...</p>
            </div>
          ) : error ? (
            <div className={styles.errorContainer}>
              <p>{error}</p>
            </div>
          ) : tripData ? (
            <>
              <h1 className={styles.title}>
                {tripData.city}, {tripData.country}
              </h1>
              <time className={styles.date}>
                {formatDate(tripData.start_date)} - {formatDate(tripData.end_date)}
              </time>
              <TabNavigation
                tabs={tabs}
                activeTab={activeTab}
                onTabChange={setActiveTab}
              />
              <ContentPanel activeTab={activeTab} tripData={tripData} />
            </>
          ) : (
            <div className={styles.errorContainer}>
              <p>No trip data found.</p>
            </div>
          )}
        </main>
      </div>
    </>
  );
};

export default TripPage;
