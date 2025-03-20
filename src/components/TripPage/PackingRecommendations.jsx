import React, { useState, useEffect } from "react";
import { recommendationService } from "../../services/api";
import styles from "../../pages/TripPage/TripPage.module.css";

const PackingRecommendations = ({ packingListId, addItemToPackingList, alreadyPackedItems = [] }) => {
  const [recommendations, setRecommendations] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [expandedCategories, setExpandedCategories] = useState({});

  useEffect(() => {
    const fetchRecommendations = async () => {
      if (!packingListId) return;
      
      try {
        setLoading(true);
        setError(null);
        
        const response = await recommendationService.getRecommendations(packingListId);
        
        if (response.data && response.data.success && response.data.recommendations) {
          setRecommendations(response.data);
          
          // Auto-expand categories with highest percentage items
          const initialExpandedState = {};
          Object.keys(response.data.recommendations).forEach(category => {
            // Expand first 2 categories by default
            initialExpandedState[category] = Object.keys(initialExpandedState).length < 2;
          });
          setExpandedCategories(initialExpandedState);
        } else {
          setError(response.data?.message || "No recommendations available");
        }
      } catch (err) {
        console.error("Error fetching recommendations:", err);
        setError("Failed to load recommendations. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [packingListId, recommendationService]);

  const toggleCategory = (category) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  const handleAddItem = (item) => {
    if (addItemToPackingList) {
      addItemToPackingList({
        name: item.item_name,
        quantity: 1,
        essential: item.percentage > 90, // Mark as essential if over 90% of travelers pack it
        packed: false,
        notes: `${item.percentage}% of travelers with similar trips packed this item`
      });
    }
  };

  // Check if an item is already in the packing list
  const isItemAlreadyPacked = (itemName) => {
    return alreadyPackedItems.some(
      item => item.toLowerCase() === itemName.toLowerCase()
    );
  };

  // Render loading state
  if (loading) {
    return (
      <div className={styles.recommendationsLoading}>
        <p>Loading recommendations...</p>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className={styles.recommendationsError}>
        <p>{error}</p>
      </div>
    );
  }

  // Render empty state
  if (!recommendations || !recommendations.recommendations || Object.keys(recommendations.recommendations).length === 0) {
    return (
      <div className={styles.recommendationsEmpty}>
        <p>No recommendations available. This might be because:</p>
        <ul>
          <li>Your packing list is already comprehensive</li>
          <li>There aren't enough similar trips in our database</li>
          <li>Your trip is unique in some way</li>
        </ul>
      </div>
    );
  }

  return (
    <div className={styles.recommendationsContainer}>
      <div className={styles.recommendationsSummary}>
        <p>
          Based on <strong>{recommendations.similar_trips_count}</strong> similar trips, 
          we found items that other travelers packed that aren't in your list yet.
        </p>
      </div>
      
      {Object.entries(recommendations.recommendations).map(([category, items]) => (
        <div key={category} className={styles.recommendationCategory}>
          <div 
            className={styles.categoryHeader}
            onClick={() => toggleCategory(category)}
          >
            <h4 className={styles.categoryName}>{category}</h4>
            <span className={styles.itemCount}>
              {items.length} items
            </span>
            <span className={styles.toggleIcon}>
              {expandedCategories[category] ? "▲" : "▼"}
            </span>
          </div>
          
          {expandedCategories[category] && (
            <div className={styles.recommendedItems}>
              {items.map((item, index) => {
                const isAlreadyPacked = isItemAlreadyPacked(item.item_name);
                
                return (
                  <div 
                    key={index} 
                    className={`${styles.recommendedItem} ${isAlreadyPacked ? styles.alreadyPacked : ''}`}
                  >
                    <div className={styles.itemDetails}>
                      <span className={styles.itemName}>{item.item_name}</span>
                      <div className={styles.percentageContainer}>
                        <div 
                          className={styles.percentageBar}
                          style={{ width: `${item.percentage}%` }}
                        ></div>
                        <span className={styles.percentageText}>{item.percentage}%</span>
                      </div>
                    </div>
                    <div className={styles.itemActions}>
                      {isAlreadyPacked ? (
                        <span className={styles.alreadyPackedBadge}>Already in list</span>
                      ) : (
                        <button 
                          className={styles.addItemButton}
                          onClick={() => handleAddItem(item)}
                        >
                          + Add to list
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default PackingRecommendations;