import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
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
              <ContentPanel 
                activeTab={activeTab} 
                tripData={tripData} 
                weatherData={weatherData} 
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
    </>
  );
};

export default TripPage;
