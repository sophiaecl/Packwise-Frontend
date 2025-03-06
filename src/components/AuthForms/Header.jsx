import React from "react";
import { Link } from "react-router-dom";
import styles from "../../pages/Auth/AuthPage.module.css";

const Header = () => {
  return (
    <header className={styles.header}>
      <Link to="/" className={styles.logo}>
        PackWise
      </Link>
    </header>
  );
};

export default Header;
