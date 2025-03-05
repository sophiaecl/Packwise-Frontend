import React, { useState } from "react";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import styles from "./AuthPage.module.css";

const AuthContainer = () => {
  const [isLoginForm, setIsLoginForm] = useState(true);

  const handleLogin = async (data) => {
    // Add your login API call here
    window.location.href = "/dashboard";
  };

  const handleRegister = async (data) => {
    // Add your registration API call here
    window.location.href = "/dashboard";
  };

  return (
    <main className={styles.content}>
      <section className={styles.loginContainer}>
        <nav className={styles.tabs}>
          <button
            className={styles.tab}
            onClick={() => setIsLoginForm(true)}
            style={{ color: isLoginForm ? "#354935" : "#666" }}
          >
            Login
          </button>
          <button
            className={styles.tab}
            onClick={() => setIsLoginForm(false)}
            style={{ color: !isLoginForm ? "#354935" : "#666" }}
          >
            Register
          </button>
          <div
            className={styles.tabIndicator}
            style={{ left: isLoginForm ? "0" : "178px" }}
          />
        </nav>
        {isLoginForm ? (
          <LoginForm onSubmit={handleLogin} />
        ) : (
          <RegisterForm onSubmit={handleRegister} />
        )}
      </section>
    </main>
  );
};

export default AuthContainer;
