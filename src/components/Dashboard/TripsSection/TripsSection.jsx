import { useState, useEffect } from "react";
import styles from "./TripsSection.module.css";
import TripCard from "../TripCard/TripCard";
import SearchAndFilters from "./SearchAndFilters";
import { useNavigate } from "react-router-dom";

function TripsSection({ trips: initialTrips = [], loading: initialLoading = false }) {
  const [trips, setTrips] = useState(initialTrips);
  const [filteredTrips, setFilteredTrips] = useState(initialTrips);
  const [loading, setLoading] = useState(initialLoading);
  const navigate = useNavigate();

  // Update local state when props change
  useEffect(() => {
    setTrips(initialTrips);
    setFilteredTrips(initialTrips);
    setLoading(initialLoading);
  }, [initialTrips, initialLoading]);

  const formatDate = (dateString) => {
    const date = new Date(dateString.replace(/\//g, '-'));
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  const handleSearch = (searchTerm) => {
    if (!searchTerm) {
      setFilteredTrips(trips);
      return;
    }
    
    const searchLower = searchTerm.toLowerCase();
    const filtered = trips.filter((trip) => 
      trip.city.toLowerCase().includes(searchLower) ||
      trip.country.toLowerCase().includes(searchLower)
    );
    setFilteredTrips(filtered);
  };

  const handleFilter = (filters) => {
    let filtered = [...trips];

    if (filters.city) {
      filtered = filtered.filter(trip => 
        trip.city.toLowerCase().includes(filters.city.toLowerCase())
      );
    }

    if (filters.country) {
      filtered = filtered.filter(trip => 
        trip.country.toLowerCase().includes(filters.country.toLowerCase())
      );
    }

    if (filters.startDate) {
      const filterStartDate = new Date(filters.startDate);
      filtered = filtered.filter(trip => {
        const tripStartDate = new Date(trip.start_date.replace(/\//g, '-'));
        return tripStartDate >= filterStartDate;
      });
    }

    if (filters.endDate) {
      const filterEndDate = new Date(filters.endDate);
      filtered = filtered.filter(trip => {
        const tripEndDate = new Date(trip.end_date.replace(/\//g, '-'));
        return tripEndDate <= filterEndDate;
      });
    }

    setFilteredTrips(filtered);
  };
  
  // Function to determine trip status based on dates
  const determineTripStatus = (startDate, endDate) => {
    const today = new Date();
    const start = new Date(startDate.replace(/\//g, '-'));
    const end = new Date(endDate.replace(/\//g, '-'));
    
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
    const start = new Date(startDate.replace(/\//g, '-'));
    const end = new Date(endDate.replace(/\//g, '-'));
    
    if (status === "upcoming") {
      const daysUntilTrip = Math.floor((start - today) / (1000 * 60 * 60 * 24));
      return Math.min(90, Math.max(10, 100 - (daysUntilTrip * 3)));
    } else if (status === "ongoing") {
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
        <button className={styles.newTripButton} onClick={() => navigate('/create-trip')}>New Trip</button>
      </div>

      <SearchAndFilters onSearch={handleSearch} onFilter={handleFilter} />
      
      {loading ? (
        <div>Loading trips...</div>
      ) : filteredTrips.length === 0 ? (
        <div className={styles.noTrips}>No trips found. Plan your next adventure!</div>
      ) : (
        filteredTrips.map((trip) => {
          const status = determineTripStatus(trip.start_date, trip.end_date);
          const progress = calculateProgress(trip.start_date, trip.end_date, status);
          
          return (
            <TripCard 
              key={trip.trip_id}
              trip_id={trip.trip_id}
              name={`${trip.city}, ${trip.country}`}
              date={`${formatDate(trip.start_date)} to ${formatDate(trip.end_date)}`}
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