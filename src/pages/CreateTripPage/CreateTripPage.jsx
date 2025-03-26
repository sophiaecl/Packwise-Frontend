import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header/Header";
import { tripService } from "../../services/api";
import styles from "./CreateTripPage.module.css";

const CreateTripPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [dateError, setDateError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [overlappingTrips, setOverlappingTrips] = useState([]);
  const [existingTrips, setExistingTrips] = useState([]);
  
  const [formData, setFormData] = useState({
    city: "",
    country: "",
    start_date: "",
    end_date: "",
    luggage_type: "carry on",
    trip_purpose: "vacation"
  });

  // Fetch user's existing trips for overlap validation
  useEffect(() => {
    const fetchExistingTrips = async () => {
      try {
        // Get trips from the dashboard endpoint
        const response = await tripService.getTrips();
        
        // Verify the response format and log for debugging
        console.log("Dashboard API response:", response.data);
        
        if (response.data && response.data.trips) {
          console.log("Fetched existing trips:", response.data.trips);
          setExistingTrips(response.data.trips);
        } else {
          console.warn("Unexpected response format from dashboard API:", response.data);
          setExistingTrips([]); // Initialize with empty array on error
        }
      } catch (err) {
        console.error("Error fetching trips:", err);
        setExistingTrips([]); // Initialize with empty array on error
      }
    };

    fetchExistingTrips();
  }, []);
  
  // For debugging
  useEffect(() => {
    if (existingTrips.length > 0) {
      console.log("Existing trips loaded:", existingTrips.length, existingTrips);
    }
  }, [existingTrips]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));

    // Clear date error when date fields change
    if (name === "start_date" || name === "end_date") {
      setDateError(null);
      
      // Validate dates when either date changes
      if (name === "end_date" && value && formData.start_date) {
        validateDates(formData.start_date, value);
      } else if (name === "start_date" && value && formData.end_date) {
        validateDates(value, formData.end_date);
      }
    }
  };

  // Validate that end date is not before start date - only used during form field changes
  const validateDates = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);

    // Just check for invalid dates during typing
    if (end < start) {
      setDateError("End date cannot be before start date");
      return false;
    }
    
    // Clear any existing date error
    setDateError(null);
    return true;
  };

  // Check if new trip dates overlap with existing trips
  const checkForOverlappingTrips = (start, end) => {
    if (!existingTrips || existingTrips.length === 0) {
      return []; // No existing trips to compare with
    }
    
    return existingTrips.filter(trip => {
      // Handle different date formats
      let tripStart, tripEnd;
      
      // Try to handle various date formats that might come from the API
      if (typeof trip.start_date === 'string') {
        // Replace slashes with dashes for consistent date parsing
        const startDateStr = trip.start_date.replace(/\//g, '-');
        const endDateStr = trip.end_date.replace(/\//g, '-');
        
        tripStart = new Date(startDateStr);
        tripEnd = new Date(endDateStr);
        
        // Handle potential invalid dates
        if (isNaN(tripStart.getTime()) || isNaN(tripEnd.getTime())) {
          console.warn("Invalid date format in trip data:", trip);
          return false;
        }
      } else {
        console.warn("Unexpected trip date format:", trip);
        return false;
      }
      
      // Check if dates overlap
      return (
        (start <= tripEnd && start >= tripStart) || // New start date falls within existing trip
        (end <= tripEnd && end >= tripStart) || // New end date falls within existing trip
        (start <= tripStart && end >= tripEnd) // New trip completely contains existing trip
      );
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Check for same day or overlapping trips without returning early
    const start = new Date(formData.start_date);
    const end = new Date(formData.end_date);

    // Check for invalid dates first
    if (end < start) {
      setDateError("End date cannot be before start date");
      return;
    }

    // Check for same day trips
    if (start.getTime() === end.getTime()) {
      setModalMessage("Your trip starts and ends on the same day. Is this correct?");
      setShowModal(true);
      return; // Stop and wait for user confirmation
    }

    // Check for overlapping trips
    const overlaps = checkForOverlappingTrips(start, end);
    if (overlaps.length > 0) {
      setOverlappingTrips(overlaps);
      setModalMessage(`This trip overlaps with ${overlaps.length} existing trip${overlaps.length > 1 ? 's' : ''}. Do you still want to create it?`);
      setShowModal(true);
      return; // Stop and wait for user confirmation
    }
    
    // If we get here, there are no warnings, proceed with submission
    submitTrip();
  };
  
  // Separated the actual submission logic
  const submitTrip = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await tripService.createTrip(formData);
      navigate(`/trip/${response.data.trip_id}`);
    } catch (err) {
      console.error("Error creating trip:", err);
      setError(err.response?.data?.detail || "Failed to create trip. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/dashboard");
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setOverlappingTrips([]);
  };

  const handleProceedAnyway = () => {
    setShowModal(false);
    // Reset overlapping trips - user has acknowledged
    setOverlappingTrips([]);
    // Proceed with trip creation
    submitTrip();
  };

  return (
    <div className={styles.app}>
      <Header />
      <main className={styles.content}>
        <div className={styles.container}>
          <h1 className={styles.title}>Create New Trip</h1>

          {error && <div className={styles.errorMessage}>{error}</div>}
          {dateError && <div className={styles.errorMessage}>{dateError}</div>}

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formGroup}>
              <label className={styles.label}>City</label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                className={styles.inputField}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Country</label>
              <input
                type="text"
                name="country"
                value={formData.country}
                onChange={handleChange}
                className={styles.inputField}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Start Date</label>
              <input
                type="date"
                name="start_date"
                value={formData.start_date}
                onChange={handleChange}
                className={styles.inputField}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>End Date</label>
              <input
                type="date"
                name="end_date"
                value={formData.end_date}
                min={formData.start_date} // Prevent selecting dates before start date
                onChange={handleChange}
                className={styles.inputField}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Luggage Type</label>
              <select
                name="luggage_type"
                value={formData.luggage_type}
                onChange={handleChange}
                className={styles.select}
                required
              >
                <option value="hand">Hand Luggage</option>
                <option value="carry on">Carry On</option>
                <option value="checked">Checked Luggage</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Trip Purpose</label>
              <select
                name="trip_purpose"
                value={formData.trip_purpose}
                onChange={handleChange}
                className={styles.select}
                required
              >
                <option value="business">Business</option>
                <option value="vacation">Vacation</option>
              </select>
            </div>

            <div className={styles.formActions}>
              <button 
                type="button" 
                onClick={handleCancel}
                className={styles.cancelButton}
                disabled={loading}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className={styles.submitButton}
                disabled={loading || dateError !== null}
              >
                {loading ? "Creating..." : "Create Trip"}
              </button>
            </div>
          </form>
        </div>
      </main>

      {/* Warning Modal for same-day or overlapping trips */}
      {showModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h2 className={styles.modalTitle}>Trip Date Warning</h2>
            <p className={styles.modalText}>{modalMessage}</p>
            
            {overlappingTrips.length > 0 && (
              <div className={styles.overlappingTripsBox}>
                <h3>Overlapping Trips:</h3>
                <ul>
                  {overlappingTrips.map((trip, index) => (
                    <li key={index}>
                      {trip.city}, {trip.country} ({trip.start_date} to {trip.end_date})
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            <div className={styles.modalButtons}>
              <button 
                className={styles.modalCancelButton}
                onClick={handleCloseModal}
              >
                Go Back
              </button>
              <button 
                className={styles.modalConfirmButton}
                onClick={handleProceedAnyway}
              >
                Proceed Anyway
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateTripPage;