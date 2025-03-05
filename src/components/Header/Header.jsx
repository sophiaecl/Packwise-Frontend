import React from "react";
import styles from "./Header.module.css";

function Header () {
  return (
    <header className={styles.header}>
      <h1 className={styles.logo}>PackWise</h1>
      <nav className={styles.navRight}>
        <button className={styles.signIn}>Sign In</button>
        <button className={styles.getStartedBtn}>Get Started</button>
      </nav>
    </header>
  );
}

export default Header;
