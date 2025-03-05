import React, { useState } from "react";
import FormInput from "../../components/AuthForms/FormInput";
import FormSelect from "../../components/AuthForms/FormSelect";
import styles from "../../components/AuthForms/Forms.module.css";

const genderOptions = [
  { value: "female", label: "Female" },
  { value: "male", label: "Male" },
  { value: "non-binary", label: "Non-binary" },
  { value: "prefer-not-to-say", label: "Prefer not to say" },
];

const RegisterForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    password: "",
    age: "",
    gender: "prefer-not-to-say",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const updateField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <form onSubmit={handleSubmit}>
      <FormInput
        label="Name"
        value={formData.name}
        onChange={(value) => updateField("name", value)}
        required
      />
      <FormInput
        label="Username"
        value={formData.username}
        onChange={(value) => updateField("username", value)}
        required
      />
      <FormInput
        label="Password"
        type="password"
        value={formData.password}
        onChange={(value) => updateField("password", value)}
        required
      />
      <FormInput
        label="Age"
        type="number"
        value={formData.age}
        onChange={(value) => updateField("age", value)}
        min="13"
        max="120"
        required
      />
      <FormSelect
        label="Gender"
        value={formData.gender}
        onChange={(value) => updateField("gender", value)}
        options={genderOptions}
        required
      />
      <button type="submit" className={styles.authButton}>
        Register
      </button>
    </form>
  );
};

export default RegisterForm;
