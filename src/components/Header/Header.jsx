import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/auth-context";
import styles from "./Header.module.css";

function Header() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const { logout } = useAuth();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleProfileClick = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleEditProfile = () => {
    setIsDropdownOpen(false);
    navigate("/profile");
  };

  const handleLogout = () => {
    setIsDropdownOpen(false);
    logout();
  };

  return (
    <header className={styles.header}>
      <h1 className={styles.logo}>PackWise</h1>
      <div className={styles.profileContainer} ref={dropdownRef}>
        <img 
          src="/profile.svg" 
          alt="Profile" 
          className={styles.profileImage}
          onClick={handleProfileClick}
        />
        {isDropdownOpen && (
          <div className={styles.dropdownMenu}>
            <button onClick={handleEditProfile}>Edit Profile</button>
            <button onClick={handleLogout}>Logout</button>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;