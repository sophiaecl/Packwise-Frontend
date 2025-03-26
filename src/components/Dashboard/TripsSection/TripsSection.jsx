import { useState, useEffect } from "react";
import styles from "./TripsSection.module.css";
import TripCard from "../TripCard/TripCard";
import SearchAndFilters from "./SearchAndFilters";
import { useNavigate } from "react-router-dom";
import { packingService } from "../../../services/api"; // Import the packing service

function TripsSection({ trips: initialTrips = [], loading: initialLoading = false }) {
  const [trips, setTrips] = useState(initialTrips);
  const [filteredTrips, setFilteredTrips] = useState(initialTrips);
  const [loading, setLoading] = useState(initialLoading);
  const [tripsProgress, setTripsProgress] = useState({});
  const navigate = useNavigate();

  // Update local state when props change
  useEffect(() => {
    const sortedTrips = [...initialTrips].sort((a, b) => 
      new Date(a.start_date.replace(/\//g, '-')) - new Date(b.start_date.replace(/\//g, '-'))
    );
    setTrips(sortedTrips);
    setFilteredTrips(sortedTrips);
    setLoading(initialLoading);
  }, [initialTrips, initialLoading]);

  // Fetch packing progress for all trips
  useEffect(() => {
    const fetchPackingProgress = async () => {
      if (trips.length === 0) return;
      
      const progressData = {};
      
      // Set initial loading state
      setLoading(true);
      
      try {
        // Fetch packing lists for each trip
        for (const trip of trips) {
          try {
            // Get packing lists for this trip
            const listsResponse = await packingService.getPackingLists(trip.trip_id);
            
            if (listsResponse.data && listsResponse.data.packing_lists && listsResponse.data.packing_lists.length > 0) {
              // Calculate average progress for all packing lists of this trip
              let totalProgress = 0;
              let listCount = 0;
              
              for (const list of listsResponse.data.packing_lists) {
                try {
                  const progressResponse = await packingService.getTripPackingProgress(list.list_id);
                  if (progressResponse.data && progressResponse.data.progress) {
                    totalProgress += progressResponse.data.progress;
                    listCount++;
                  }
                } catch (err) {
                  console.warn(`Error fetching progress for list ${list.list_id}:`, err);
                  // Continue with other lists
                }
              }
              
              // Calculate average progress for this trip
              if (listCount > 0) {
                progressData[trip.trip_id] = Math.round(totalProgress / listCount);
              } else {
                progressData[trip.trip_id] = 0; // No packing lists with progress data
              }
            } else {
              progressData[trip.trip_id] = 0; // No packing lists for this trip
            }
          } catch (err) {
            console.warn(`Error fetching packing lists for trip ${trip.trip_id}:`, err);
            progressData[trip.trip_id] = 0; // Set default progress on error
          }
        }
        
        setTripsProgress(progressData);
      } catch (err) {
        console.error("Error fetching packing progress:", err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchPackingProgress();
  }, [trips]);

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
  
  // Function to determine trip status based on dates (keep this as is)
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
          // Use the packing progress instead of calculated progress
          const progress = tripsProgress[trip.trip_id] || 0;
          
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