import React from "react";
import Header from "./Header";
import AuthContainer from "../../pages/Auth/AuthContainer";
import styles from "../../pages/Auth/AuthPage.module.css";

const InputDesign = () => {
  return (
    <div className={styles.page}>
      <Header />
      <AuthContainer />
    </div>
  );
};

export default InputDesign;
