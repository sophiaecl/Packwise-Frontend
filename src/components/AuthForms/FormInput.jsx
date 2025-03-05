import React from "react";
import styles from "./Forms.module.css";

const FormInput = ({
  label,
  type = "text",
  value,
  onChange,
  required = false,
  min,
  max,
}) => {
  return (
    <div className={styles.formGroup}>
      <label className={styles.label}>{label}</label>
      <input
        type={type}
        className={styles.inputField}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        min={min}
        max={max}
      />
    </div>
  );
};

export default FormInput;
