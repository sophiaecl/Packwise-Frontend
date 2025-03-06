import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import styles from "./AuthPage.module.css";
import { useAuth } from "../../context/auth-context";

const AuthContainer = () => {
  const location = useLocation();
  const [isLoginForm, setIsLoginForm] = useState(location.state?.isLoginForm ?? true);
  const { login, register, error } = useAuth();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (location.state?.isLoginForm !== undefined) {
      setIsLoginForm(location.state.isLoginForm);
    }
  }, [location.state]);

  const handleLogin = async (credentials) => {
    setLoading(true);
    try {
      await login(credentials);
    }
    catch (error) {
      console.error("Login error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (userData) => {
    setLoading(true);
    try {
      await register(userData);
    }
    catch (error) {
      console.error("Registration error:", error);
    } finally {
      setLoading(false);
    }
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
        
        {error && <div className={styles.errorMessage}>{error}</div>}
        
        {isLoginForm ? (
          <LoginForm onSubmit={handleLogin} />
        ) : (
          <RegisterForm onSubmit={handleRegister} />
        )}

        {loading && <div className={styles.loadingSpinner}>Loading...</div>}
      </section>
    </main>
  );
};

export default AuthContainer;