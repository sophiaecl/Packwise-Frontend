import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header/Header";
import { profileService } from "../../services/api";
import styles from "./ProfilePage.module.css";

const ProfilePage = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState({
    name: "",
    age: "",
    gender: "prefer-not-to-say"
  });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const response = await profileService.getProfile();
        setProfile(response.data);
        setError(null);
      } catch (err) {
        console.error("Error fetching profile:", err);
        setError("Failed to load profile data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: name === 'age' ? (value === '' ? '' : parseInt(value, 10)) : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await profileService.updateProfile(profile);
      setIsEditing(false);
      setSuccessMessage("Profile updated successfully!");
      setTimeout(() => setSuccessMessage(null), 3000);
      setError(null);
    } catch (err) {
      console.error("Error updating profile:", err);
      setError("Failed to update profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    // Refetch original data
    profileService.getProfile().then(response => {
      setProfile(response.data);
      setIsEditing(false);
    });
  };

  return (
    <div className={styles.app}>
      <Header />
      <main className={styles.mainContent}>
        <button 
          className={styles.returnButton}
          onClick={() => navigate("/dashboard")}
        >
          ← Return to Dashboard
        </button>

        <h1 className={styles.title}>Your Profile</h1>

        {loading && !isEditing ? (
          <div className={styles.loadingContainer}>
            <p>Loading your profile...</p>
          </div>
        ) : error ? (
          <div className={styles.errorContainer}>
            <p>{error}</p>
          </div>
        ) : (
          <>
            {successMessage && (
              <div className={styles.successMessage}>
                {successMessage}
              </div>
            )}

            <div className={styles.profileContainer}>
              <div className={styles.profileHeader}>
                <h2 className={styles.sectionTitle}>Personal Information</h2>
                {!isEditing && (
                  <button 
                    className={styles.editButton}
                    onClick={() => setIsEditing(true)}
                  >
                    Edit
                  </button>
                )}
              </div>

              {isEditing ? (
                <form onSubmit={handleSubmit}>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Name</label>
                    <input
                      type="text"
                      name="name"
                      value={profile.name}
                      onChange={handleChange}
                      required
                      className={styles.inputField}
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.label}>Age</label>
                    <input
                      type="number"
                      name="age"
                      value={profile.age}
                      onChange={handleChange}
                      min="13"
                      max="120"
                      required
                      className={styles.inputField}
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.label}>Gender</label>
                    <select
                      name="gender"
                      value={profile.gender}
                      onChange={handleChange}
                      className={styles.select}
                    >
                      <option value="female">Female</option>
                      <option value="male">Male</option>
                      <option value="non-binary">Non-binary</option>
                      <option value="prefer-not-to-say">Prefer not to say</option>
                    </select>
                  </div>

                  <div className={styles.formActions}>
                    <button 
                      type="submit" 
                      className={styles.saveButton}
                      disabled={loading}
                    >
                      {loading ? "Saving..." : "Save Changes"}
                    </button>
                    <button 
                      type="button" 
                      className={styles.cancelButton}
                      onClick={handleCancel}
                      disabled={loading}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <div className={styles.profileDetails}>
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Name:</span>
                    <span className={styles.detailValue}>{profile.name}</span>
                  </div>
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Age:</span>
                    <span className={styles.detailValue}>{profile.age}</span>
                  </div>
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Gender:</span>
                    <span className={styles.detailValue}>
                      {profile.gender === 'prefer-not-to-say' 
                        ? 'Prefer not to say' 
                        : profile.gender.charAt(0).toUpperCase() + profile.gender.slice(1)}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default ProfilePage;