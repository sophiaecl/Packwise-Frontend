import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import styles from "./TripPage.module.css";
import Header from "../../components/Header/Header";
import TabNavigation from "../../components/TripPage/TabNavigation";
import ContentPanel from "../../components/TripPage/ContentPanel";
import { tripService, packingService } from "../../services/api";

const TripPage = () => {
  const { tripId } = useParams(); // Get the tripId from URL parameters
  const [activeTab, setActiveTab] = useState("Trip Info");
  const [tripData, setTripData] = useState(null);
  const [weatherData, setWeatherData] = useState(null);
  const [packingLists, setPackingLists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState(null);
  const [historicalData, setHistoricalData] = useState(null);

  const navigate = useNavigate();

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
        
        // Fetch trip data
        const tripResponse = await tripService.getTrip(tripId);
        setTripData(tripResponse.data);
        
        // Fetch weather data
        const weatherResponse = await tripService.getTripWeather(tripId);
        setWeatherData(weatherResponse.data);

        // Fetch historical weather data
        try {
          const historicalResponse = await tripService.getHistoricalWeather(tripId);
          if (historicalResponse.data && historicalResponse.data.historical_data) {
            setHistoricalData(historicalResponse.data.historical_data);
          }
        } catch (historicalError) {
          console.warn("Error fetching historical weather data:", historicalError);
          // Non-fatal error, continue without historical data
        }
        
        // Attempt to fetch packing lists if they exist
        try {
          const packingListsResponse = await packingService.getPackingLists(tripId);
          
          if (packingListsResponse.data && 
              packingListsResponse.data.packing_lists && 
              packingListsResponse.data.packing_lists.length > 0) {
            
            // Process each packing list one by one
            const listsData = [];
            
            for (const item of packingListsResponse.data.packing_lists) {
              try {
                const listResponse = await packingService.getPackingList(item.list_id);
                if (listResponse.data && listResponse.data.packing_list) {
                  // If the backend sends a JSON string, parse it
                  const packingListData = typeof listResponse.data.packing_list === 'string' 
                    ? JSON.parse(listResponse.data.packing_list)
                    : listResponse.data.packing_list;
                    
                  listsData.push(packingListData);
                }
              } catch (listError) {
                console.warn(`Error fetching packing list ${item.list_id}:`, listError);
                // Continue with other lists even if one fails
              }
            }
            
            setPackingLists(listsData);
          }
        } catch (packingError) {
          console.warn("Error fetching packing lists:", packingError);
          // This is non-fatal, we'll just show empty packing lists
        }
        
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

  const handleDeleteTrip = async () => {
    try {
      setDeleteLoading(true);
      setDeleteError(null);

      await tripService.deleteTrip(tripId);
      navigate("/dashboard");
    } catch (error) {
      console.error("Failed to delete trip:", error);
      setDeleteError("Failed to delete trip. Please try again later.");
    } finally {
      setDeleteLoading(false);
    }
  }

  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&display=swap"
        rel="stylesheet"
      />
      <div className={styles.app}>
        <Header />
        <main className={styles.mainContent}>
          <div className={styles.pageHeader}>
            <Link to="/dashboard" className={styles.returnButton}>
              ← Return to Dashboard
            </Link>
            <button className={styles.deleteButton} onClick={() => setShowDeleteModal(true)}>Delete Trip</button>
          </div>
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
              <ContentPanel 
                activeTab={activeTab} 
                tripData={tripData} 
                weatherData={weatherData}
                historicalData={historicalData} 
                packingLists={packingLists} 
              />
            </>
          ) : (
            <div className={styles.errorContainer}>
              <p>No trip data found.</p>
            </div>
          )}
        </main>
      </div>
      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h2 className={styles.modalTitle}>Delete Trip</h2>
            <p className={styles.modalText}>
              Are you sure you want to delete this trip to {tripData?.city}, {tripData?.country}?
            </p>
            <p className={styles.modalWarning}>
              This will permanently delete all trip data, including packing lists and weather information.
            </p>
            {deleteError && <p className={styles.modalError}>{deleteError}</p>}
            <div className={styles.modalButtons}>
              <button className={styles.cancelButton} onClick={() => setShowDeleteModal(false)} disabled={deleteLoading}>Cancel</button>
              <button className={styles.confirmDeleteButton} onClick={handleDeleteTrip} disabled={deleteLoading}>
                {deleteLoading ? "Deleting..." : "Delete Trip"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TripPage;
