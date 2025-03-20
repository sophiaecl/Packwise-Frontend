import React, { useState } from "react";
import styles from "../../pages/TripPage/TripPage.module.css";
import { packingService } from "../../services/api";
import HistoricalWeatherVisualization from "./WeatherVisualization";

function ContentPanel({ activeTab, tripData, weatherData, packingLists, historicalData = [] }) {
  const [isEditing, setIsEditing] = useState(false);
  const [expandedLists, setExpandedLists] = useState({});
  const [expandedCategories, setExpandedCategories] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Toggle a packing list expansion
  const toggleList = (listId) => {
    setExpandedLists(prev => ({
      ...prev,
      [listId]: !prev[listId]
    }));
  };
  
  // Toggle a category expansion within a packing list
  const toggleCategory = (listId, categoryName) => {
    const key = `${listId}-${categoryName}`;
    setExpandedCategories(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

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

  // Handle creating a new packing list
  const handleCreateList = async () => {
    if (!tripData?.trip_id) return;
    
    try {
      setLoading(true);
      setError(null);
      await packingService.createPackingList(tripData.trip_id);
      // Reload the page to fetch the new list
      window.location.reload();
    } catch (err) {
      console.error("Error creating packing list:", err);
      setError("Failed to create packing list. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Extract all packing tips from all packing lists
  const getAllPackingTips = () => {
    const allTips = [];
    packingLists.forEach(list => {
      if (list && list.packing_tips && Array.isArray(list.packing_tips)) {
        list.packing_tips.forEach(tip => {
          if (!allTips.includes(tip)) {
            allTips.push(tip);
          }
        });
      }
    });
    return allTips;
  };

  // Extract all recommended activities from all packing lists
  const getAllRecommendedActivities = () => {
    const allActivities = [];
    packingLists.forEach(list => {
      if (list && list.recommended_activities && Array.isArray(list.recommended_activities)) {
        list.recommended_activities.forEach(activity => {
          if (!allActivities.includes(activity)) {
            allActivities.push(activity);
          }
        });
      }
    });
    return allActivities;
  };

  // Render packing lists UI
  const renderPackingLists = () => {
    if (!packingLists || packingLists.length === 0) {
      return (
        <div className={styles.emptyState}>
          <p>No packing lists found for this trip.</p>
          <button 
            className={styles.createListButton}
            onClick={handleCreateList}
            disabled={loading}
          >
            {loading ? "Creating..." : "Create Your First Packing List"}
          </button>
        </div>
      );
    }

    return (
      <div className={styles.packingLists}>
        {packingLists.map((packingList, listIndex) => {
          // Check if packingList has the expected structure
          const categories = packingList?.categories || [];
          
          return (
            <div key={listIndex} className={styles.packingListCard}>
              <div 
                className={styles.packingListTitle} 
                onClick={() => toggleList(listIndex)}
              >
                <h3>Packing List {listIndex + 1}</h3>
                <span className={styles.dropdownArrow}>
                  {expandedLists[listIndex] ? "▲" : "▼"}
                </span>
              </div>
              
              {expandedLists[listIndex] && (
                <div className={styles.packingListContent}>
                  {categories.map((category, catIndex) => (
                    <div key={catIndex} className={styles.packingCategory}>
                      <div 
                        className={styles.categoryHeader}
                        onClick={() => toggleCategory(listIndex, category.category_name)}
                      >
                        <h4>{category.category_name}</h4>
                        <span className={styles.itemCount}>{category.items?.length || 0} items</span>
                        <span className={styles.toggleIcon}>
                          {expandedCategories[`${listIndex}-${category.category_name}`] ? "▲" : "▼"}
                        </span>
                      </div>
                      
                      {expandedCategories[`${listIndex}-${category.category_name}`] && (
                        <ul className={styles.itemsList}>
                          {category.items?.map((item, itemIndex) => (
                            <li key={itemIndex} className={styles.packingItem}>
                              <div className={styles.itemDetails}>
                                <div className={styles.itemName}>
                                  <span className={styles.itemNameText}>{item.name}</span>
                                  {item.essential && (
                                    <span className={styles.essentialTag}>Essential</span>
                                  )}
                                </div>
                                <div className={styles.itemQuantity}>
                                  <span>Qty: {item.quantity}</span>
                                </div>
                              </div>
                              {item.notes && (
                                <div className={styles.itemNotes}>{item.notes}</div>
                              )}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  // Render content based on active tab
  const renderContent = () => {
    switch (activeTab) {
      case "Trip Info":
        return (
          <div className={styles.detailsCard}>
            <dl className={styles.detailsList}>
              <div className={styles.detailItem}>
                <dt>City:</dt>
                <dd>{tripData?.city || "Not specified"}</dd>
              </div>
              <div className={styles.detailItem}>
                <dt>Country:</dt>
                <dd>{tripData?.country || "Not specified"}</dd>
              </div>
              <div className={styles.detailItem}>
                <dt>Start date:</dt>
                <dd>{formatDate(tripData?.start_date) || "Not specified"}</dd>
              </div>
              <div className={styles.detailItem}>
                <dt>End date:</dt>
                <dd>{formatDate(tripData?.end_date) || "Not specified"}</dd>
              </div>
              <div className={styles.detailItem}>
                <dt>Luggage type:</dt>
                <dd>{tripData?.luggage_type || "Not specified"}</dd>
              </div>
              <div className={styles.detailItem}>
                <dt>Trip purpose:</dt>
                <dd>{tripData?.trip_purpose || "Not specified"}</dd>
              </div>
            </dl>
          </div>
        );
      case "Trip Weather":
        return (
          <>
            <section className={styles.weatherDetails}>
              <div className={styles.metricsGrid}>
                <article className={styles.metric}>
                  <h3 className={styles.metricTitle}>Max Temp</h3>
                  <p className={styles.metricValue}>{weatherData?.max_temp || "N/A"}°C</p>
                </article>
                <article className={styles.metric}>
                  <h3 className={styles.metricTitle}>Min Temp</h3>
                  <p className={styles.metricValue}>{weatherData?.min_temp || "N/A"}°C</p>
                </article>
                <article className={styles.metric}>
                  <h3 className={styles.metricTitle}>UV</h3>
                  <p className={styles.metricValue}>{weatherData?.uv || "N/A"}</p>
                </article>
                <article className={styles.metric}>
                  <h3 className={styles.metricTitle}>Description</h3>
                  <p className={styles.metricValue}>{weatherData?.description || "N/A"}</p>
                </article>
                <article className={styles.metric}>
                  <h3 className={styles.metricTitle}>Confidence</h3>
                  <p className={styles.metricValue}>{weatherData?.confidence ? Math.round(weatherData.confidence * 100) : "N/A"}%</p>
                </article>
              </div>
            </section>
            <div className={styles.detailsCard}>
              {historicalData ? (
              < HistoricalWeatherVisualization historicalData={historicalData} />
              ) : (
                <p>Loading historical weather data...</p>
              )}
            </div>
          </>
        );
      case "Packing Lists":
        return (
          <div className={styles.packingListContainer}>
            {error && <div className={styles.errorMessage}>{error}</div>}
            {renderPackingLists()}
          </div>
        );
      case "Activities":
        const activities = getAllRecommendedActivities();
        return (
          <div className={styles.detailsCard}>
            <h3 className={styles.detailsTitle}>Recommended Activities</h3>
            {activities.length > 0 ? (
              <ul className={styles.tipsList}>
                {activities.map((activity, index) => (
                  <li key={index} className={styles.tipsItem}>{activity}</li>
                ))}
              </ul>
            ) : (
              <p>No recommended activities available for this trip.</p>
            )}
          </div>
        );
      case "Tips":
        const tips = getAllPackingTips();
        return (
          <div className={styles.detailsCard}>
            <h3 className={styles.detailsTitle}>Packing Tips</h3>
            {tips.length > 0 ? (
              <ul className={styles.tipsList}>
                {tips.map((tip, index) => (
                  <li key={index} className={styles.tipsItem}>{tip}</li>
                ))}
              </ul>
            ) : (
              <p>No packing tips available for this trip.</p>
            )}
          </div>
        );
      default:
        return <div>Select a tab to view content</div>;
    }
  };

  return (
    <section className={styles.contentPanel} role="tabpanel">
      <div className={styles.panelHeader}>
        <h2 className={styles.panelTitle}>{activeTab}</h2>
        {activeTab === "Trip Info" && (
          <button 
            className={styles.updateButton}
            onClick={() => setIsEditing(!isEditing)}
          >
            {isEditing ? "Save" : "Update"}
          </button>
        )}
        {activeTab === "Packing Lists" && (
          <button 
            className={styles.updateButton}
            onClick={handleCreateList}
            disabled={loading}
          >
            {loading ? "Creating..." : "Create List"}
          </button>
        )}
      </div>
      {renderContent()}
    </section>
  );
}

export default ContentPanel;
