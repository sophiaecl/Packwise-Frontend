import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header/Header";
import { tripService } from "../../services/api";
import styles from "./CreateTripPage.module.css";

const CreateTripPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    city: "",
    country: "",
    start_date: "",
    end_date: "",
    luggage_type: "carry on",
    trip_purpose: "vacation"
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
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

  return (
    <div className={styles.app}>
      <Header />
      <main className={styles.content}>
        <div className={styles.container}>
          <h1 className={styles.title}>Create New Trip</h1>

          {error && <div className={styles.errorMessage}>{error}</div>}

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
                disabled={loading}
              >
                {loading ? "Creating..." : "Create Trip"}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default CreateTripPage;