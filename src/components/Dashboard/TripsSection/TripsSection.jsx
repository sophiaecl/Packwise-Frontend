import { useState, useEffect } from "react";
import styles from "./TripsSection.module.css";
import TripCard from "../TripCard/TripCard";

function TripsSection({ trips: initialTrips = [], loading: initialLoading = false }) {
  const [trips, setTrips] = useState(initialTrips);
  const [loading, setLoading] = useState(initialLoading);

  // Update local state when props change
  useEffect(() => {
    setTrips(initialTrips);
    setLoading(initialLoading);
  }, [initialTrips, initialLoading]);
  
  // Function to determine trip status based on dates
  const determineTripStatus = (startDate, endDate) => {
    const today = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (end < today) {
      return "completed";
    } else if (start <= today && today <= end) {
      return "ongoing";
    } else {
      return "upcoming";
    }
  };
  
  // Function to calculate progress based on dates
  const calculateProgress = (startDate, endDate, status) => {
    if (status === "completed") {
      return 100;
    }
    
    const today = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (status === "upcoming") {
      // For upcoming trips, calculate planning progress (arbitrary, you might want to base this on actual planning data)
      const daysUntilTrip = Math.floor((start - today) / (1000 * 60 * 60 * 24));
      // Closer to trip date = higher progress; max 90% before trip starts
      return Math.min(90, Math.max(10, 100 - (daysUntilTrip * 3)));
    } else if (status === "ongoing") {
      // For ongoing trips, calculate based on trip duration
      const totalDuration = (end - start) / (1000 * 60 * 60 * 24);
      const daysElapsed = (today - start) / (1000 * 60 * 60 * 24);
      return Math.min(99, Math.floor((daysElapsed / totalDuration) * 100));
    }
    
    return 0;
  };

  return (
    <section className={styles.tripsSection}>
      <div className={styles.tripsHeader}>
        <h2 className={styles.tripsTitle}>Your Trips</h2>
        <button className={styles.newTripButton}>New Trip</button>
      </div>
      
      {loading ? (
        <div>Loading trips...</div>
      ) : trips.length === 0 ? (
        <div className={styles.noTrips}>No trips found. Plan your next adventure!</div>
      ) : (
        trips.map((trip) => {
          const status = determineTripStatus(trip.start_date, trip.end_date);
          const progress = calculateProgress(trip.start_date, trip.end_date, status);
          
          return (
            <TripCard 
              key={trip.trip_id}
              name={`${trip.city}, ${trip.country}`}
              date={`${trip.start_date} to ${trip.end_date}`}
              status={status}
              progress={progress}
            />
          );
        })
      )}
    </section>
  );
}

export default TripsSection;