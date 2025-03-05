import React, { useState } from "react";
import FormInput from "../../components/AuthForms/FormInput";
import styles from "../../components/AuthForms/Forms.module.css";

const LoginForm = ({ onSubmit }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ username, password });
  };

  return (
    <form onSubmit={handleSubmit}>
      <FormInput
        label="Username"
        value={username}
        onChange={setUsername}
        required
      />
      <FormInput
        label="Password"
        type="password"
        value={password}
        onChange={setPassword}
        required
      />
      <button type="submit" className={styles.authButton}>
        Login
      </button>
    </form>
  );
};

export default LoginForm;
