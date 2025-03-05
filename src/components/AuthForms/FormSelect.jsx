import React from "react";
import styles from "./Forms.module.css";

const FormSelect = ({ label, value, onChange, options, required = false }) => {
  return (
    <div className={styles.formGroup}>
      <label className={styles.label}>{label}</label>
      <select
        className={styles.select}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default FormSelect;
