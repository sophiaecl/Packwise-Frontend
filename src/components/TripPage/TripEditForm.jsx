import React, { useState, useEffect } from "react";
import styles from "../../pages/TripPage/TripPage.module.css";

const TripEditForm = ({ tripData, onCancel, onSubmit, loading, error }) => {
  const [formData, setFormData] = useState({
    city: "",
    country: "",
    start_date: "",
    end_date: "",
    luggage_type: "carry on",
    trip_purpose: "vacation"
  });
  const [dateError, setDateError] = useState(null);

  // Initialize form with trip data
  useEffect(() => {
    if (tripData) {
      setFormData({
        city: tripData.city || "",
        country: tripData.country || "",
        start_date: tripData.start_date ? formatDateForInput(tripData.start_date) : "",
        end_date: tripData.end_date ? formatDateForInput(tripData.end_date) : "",
        luggage_type: tripData.luggage_type || "carry on",
        trip_purpose: tripData.trip_purpose || "vacation"
      });
    }
  }, [tripData]);

  // Format date string for date input field
  const formatDateForInput = (dateString) => {
    const date = new Date(dateString.replace(/\//g, '-'));
    return date.toISOString().split('T')[0];
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));

    // Clear date error when date fields change
    if (name === "start_date" || name === "end_date") {
      setDateError(null);
      
      // Validate dates when both start and end dates are filled
      if (name === "end_date" && value && formData.start_date) {
        validateDates(formData.start_date, value);
      } else if (name === "start_date" && value && formData.end_date) {
        validateDates(value, formData.end_date);
      }
    }
  };

  // Validate that end date is not before start date
  const validateDates = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (end < start) {
      setDateError("End date cannot be before start date");
      return false;
    }
    
    setDateError(null);
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate dates before submitting
    const start = new Date(formData.start_date);
    const end = new Date(formData.end_date);

    if (end < start) {
      setDateError("End date cannot be before start date");
      return;
    }
    
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className={styles.editForm}>
      {error && <div className={styles.errorMessage}>{error}</div>}
      {dateError && <div className={styles.errorMessage}>{dateError}</div>}

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
          onClick={onCancel}
          className={styles.cancelButton}
          disabled={loading}
        >
          Cancel
        </button>
        <button 
          type="submit" 
          className={styles.saveButton}
          disabled={loading || dateError !== null}
        >
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </form>
  );
};

export default TripEditForm;