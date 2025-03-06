import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Header.module.css";

function Header () {
  const navigate = useNavigate();

  const handleSignIn = () => {
    navigate("/auth", { state: { isLoginForm: true } });
  };

  const handleGetStarted = () => {
    navigate("/auth", { state: { isLoginForm: false } });
  };

  return (
    <header className={styles.header}>
      <h1 className={styles.logo}>PackWise</h1>
      <nav className={styles.navRight}>
        <button className={styles.signIn} onClick={handleSignIn}>Sign In</button>
        <button className={styles.getStartedBtn} onClick={handleGetStarted}>Get Started</button>
      </nav>
    </header>
  );
}

export default Header;
