import React, { useState } from 'react';
import styles from './SearchAndFilters.module.css';

const SearchAndFilters = ({ onSearch, onFilter }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    city: '',
    country: ''
  });

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearch(value);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    const updatedFilters = { ...filters, [name]: value };
    setFilters(updatedFilters);
    onFilter(updatedFilters);
  };

  const handleClearFilters = () => {
    const clearedFilters = {
      startDate: '',
      endDate: '',
      city: '',
      country: ''
    };
    setFilters(clearedFilters);
    setSearchTerm('');
    onFilter(clearedFilters);
    onSearch('');
  };

  const hasActiveFilters = () => {
    return searchTerm || Object.values(filters).some(value => value !== '');
  };

  return (
    <div className={styles.searchAndFilters}>
      <div className={styles.searchContainer}>
        <input
          type="text"
          placeholder="Search trips..."
          value={searchTerm}
          onChange={handleSearchChange}
          className={styles.searchInput}
        />
        <button 
          className={styles.filterButton}
          onClick={() => setShowFilters(!showFilters)}
        >
          Filters
        </button>
      </div>
      
      {showFilters && (
        <div className={styles.filtersContainer}>
          <div className={styles.filterGroup}>
            <label>Start Date:</label>
            <input
              type="date"
              name="startDate"
              value={filters.startDate}
              onChange={handleFilterChange}
              className={styles.filterInput}
            />
          </div>
          <div className={styles.filterGroup}>
            <label>End Date:</label>
            <input
              type="date"
              name="endDate"
              value={filters.endDate}
              onChange={handleFilterChange}
              className={styles.filterInput}
            />
          </div>
          <div className={styles.filterGroup}>
            <label>City:</label>
            <input
              type="text"
              name="city"
              value={filters.city}
              onChange={handleFilterChange}
              placeholder="Filter by city"
              className={styles.filterInput}
            />
          </div>
          <div className={styles.filterGroup}>
            <label>Country:</label>
            <input
              type="text"
              name="country"
              value={filters.country}
              onChange={handleFilterChange}
              placeholder="Filter by country"
              className={styles.filterInput}
            />
          </div>
          <div className={styles.filterHeader}>
            {hasActiveFilters() && (
              <button 
                className={styles.clearButton}
                onClick={handleClearFilters}
              >
                Clear All
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchAndFilters; 