import React, { useState, useEffect } from "react";
import styles from "../../pages/TripPage/TripPage.module.css";
import { packingService } from "../../services/api";

function InteractivePackingList({ packingListData, listId, onUpdate, onDelete }) {
  const [packingList, setPackingList] = useState(packingListData);
  const [expandedCategories, setExpandedCategories] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState(null);

  // Initialize with collapsed categories, but keep the component state separate from props
  useEffect(() => {
    setPackingList(packingListData);
    // Important: We don't reset expandedCategories here, allowing them to persist
  }, [packingListData]);

  const toggleCategory = (categoryIndex) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryIndex]: !prev[categoryIndex]
    }));
  };

  const handleCheckItem = (categoryIndex, itemIndex) => {
    const updatedPackingList = { ...packingList };
    const item = updatedPackingList.categories[categoryIndex].items[itemIndex];
    item.packed = !item.packed;
    
    // Update total_items count if needed (depends on your data structure)
    setPackingList(updatedPackingList);

    // Debounced save to avoid too many API calls
    savePackingList(updatedPackingList);
  };

  const handleQuantityChange = (categoryIndex, itemIndex, newQuantity) => {
    // Don't allow negative or non-numeric values
    const validQuantity = Math.max(1, parseInt(newQuantity) || 1);
    
    const updatedPackingList = { ...packingList };
    updatedPackingList.categories[categoryIndex].items[itemIndex].quantity = validQuantity;
    
    setPackingList(updatedPackingList);
    
    // Debounced save
    savePackingList(updatedPackingList);
  };

  const handleRemoveItem = (categoryIndex, itemIndex) => {
    const updatedPackingList = { ...packingList };
    const category = updatedPackingList.categories[categoryIndex];
    
    // Remove the item
    category.items.splice(itemIndex, 1);
    
    // If category is now empty, you might want to remove the category too
    if (category.items.length === 0) {
      updatedPackingList.categories.splice(categoryIndex, 1);
    }
    
    // Update total_items count
    updatedPackingList.total_items = updatedPackingList.categories.reduce(
      (total, cat) => total + cat.items.length, 0
    );
    
    setPackingList(updatedPackingList);
    savePackingList(updatedPackingList);
  };

  const handleUpdateNotes = (categoryIndex, itemIndex, newNotes) => {
    const updatedPackingList = { ...packingList };
    updatedPackingList.categories[categoryIndex].items[itemIndex].notes = newNotes;
    
    setPackingList(updatedPackingList);
    savePackingList(updatedPackingList);
  };

  const savePackingList = async (updatedList) => {
    try {
      setLoading(true);
      setError(null);
      
      // Format the data according to your backend API expectation
      await packingService.updatePackingList(listId, { packing_list: updatedList });
      
      if (onUpdate) {
        onUpdate(updatedList);
      }

      // Show success message briefly
      setSuccessMessage("Packing list updated");
      setTimeout(() => setSuccessMessage(""), 2000);
    } catch (err) {
      console.error("Error updating packing list:", err);
      setError("Failed to update packing list. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteList = async () => {
    try {
      setDeleteLoading(true);
      setDeleteError(null);
      
      await packingService.deletePackingList(listId);
      
      if (onDelete) {
        onDelete(listId);
      }
      
      setSuccessMessage("Packing list deleted");
      // The component will unmount when the parent removes it
    } catch (err) {
      console.error("Error deleting packing list:", err);
      setDeleteError("Failed to delete packing list. Please try again.");
      setDeleteLoading(false);
      setShowDeleteModal(false);
    }
  };

  if (!packingList || !packingList.categories) {
    return <div>No packing list data available</div>;
  }

  // Calculate packing progress
  const totalItems = packingList.total_items || 
    packingList.categories.reduce((total, cat) => total + cat.items.length, 0);
  
  const packedItems = packingList.categories.reduce((total, cat) => 
    total + cat.items.filter(item => item.packed).length, 0);
  
  const progressPercentage = totalItems > 0 ? Math.round((packedItems / totalItems) * 100) : 0;

  return (
    <div className={styles.interactivePackingList}>
      {loading && <div className={styles.loadingIndicator}>Saving...</div>}
      {error && <div className={styles.errorMessage}>{error}</div>}
      {successMessage && <div className={styles.successMessage}>{successMessage}</div>}
      
      <div className={styles.packingProgressContainer}>
        <div className={styles.packingProgress}>
          <div className={styles.progressText}>
            Packing Progress: {packedItems} of {totalItems} items ({progressPercentage}%)
          </div>
          <div className={styles.progressBarContainer}>
            <div 
              className={styles.progressBarFill} 
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>
        <button 
          className={styles.deleteListButton} 
          onClick={() => setShowDeleteModal(true)}
          title="Delete this packing list"
        >
          Delete List
        </button>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h2 className={styles.modalTitle}>Delete Packing List</h2>
            <p className={styles.modalText}>
              Are you sure you want to delete this packing list and all associated activity recommendations and packing tips?
            </p>
            <p className={styles.modalWarning}>
              This action cannot be undone.
            </p>
            {deleteError && <p className={styles.modalError}>{deleteError}</p>}
            <div className={styles.modalButtons}>
              <button
                className={styles.cancelButton}
                onClick={() => setShowDeleteModal(false)}
                disabled={deleteLoading}
              >
                Cancel
              </button>
              <button
                className={styles.confirmDeleteButton}
                onClick={handleDeleteList}
                disabled={deleteLoading}
              >
                {deleteLoading ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {packingList.categories.map((category, categoryIndex) => (
        <div key={categoryIndex} className={styles.packingCategory}>
          <div 
            className={styles.categoryHeader}
            onClick={() => toggleCategory(categoryIndex)}
          >
            <h4>{category.category_name}</h4>
            <span className={styles.itemCount}>
              {category.items.filter(item => item.packed).length}/{category.items.length} items
            </span>
            <span className={styles.toggleIcon}>
              {expandedCategories[categoryIndex] ? "▲" : "▼"}
            </span>
          </div>
          
          {expandedCategories[categoryIndex] && (
            <ul className={styles.itemsList}>
              {category.items.map((item, itemIndex) => (
                <li key={itemIndex} className={`${styles.packingItem} ${item.packed ? styles.packedItem : ''}`}>
                  <div className={styles.itemDetails}>
                    <div className={styles.itemNameSection}>
                      <input
                        type="checkbox"
                        checked={item.packed || false}
                        onChange={() => handleCheckItem(categoryIndex, itemIndex)}
                        className={styles.itemCheckbox}
                        id={`item-${categoryIndex}-${itemIndex}`}
                      />
                      <label 
                        htmlFor={`item-${categoryIndex}-${itemIndex}`}
                        className={`${styles.itemNameText} ${item.packed ? styles.itemNameChecked : ''}`}
                      >
                        {item.name}
                      </label>
                      {item.essential && (
                        <span className={styles.essentialTag}>Essential</span>
                      )}
                    </div>
                    <div className={styles.itemActions}>
                      <div className={styles.quantityControl}>
                        <button 
                          className={styles.quantityButton}
                          onClick={() => handleQuantityChange(categoryIndex, itemIndex, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                        >
                          -
                        </button>
                        <input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => handleQuantityChange(categoryIndex, itemIndex, e.target.value)}
                          className={styles.quantityInput}
                        />
                        <button 
                          className={styles.quantityButton}
                          onClick={() => handleQuantityChange(categoryIndex, itemIndex, item.quantity + 1)}
                        >
                          +
                        </button>
                      </div>
                      <button 
                        className={styles.removeButton}
                        onClick={() => handleRemoveItem(categoryIndex, itemIndex)}
                        title="Remove Item"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                  <div className={styles.itemNotesContainer}>
                    <input
                      type="text"
                      value={item.notes || ''}
                      onChange={(e) => handleUpdateNotes(categoryIndex, itemIndex, e.target.value)}
                      placeholder="Add notes..."
                      className={styles.notesInput}
                    />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </div>
  );
}

export default InteractivePackingList;