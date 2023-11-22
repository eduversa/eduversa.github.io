import React, { useState } from "react";

const ApplicantCourseForm = ({ formData, updateFormData }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;

    updateFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const renderFormFields = () => {
    return Object.keys(formData).map((key) => (
      <div key={key} className={`${key}-group`}>
        <label>
          {key.charAt(0).toUpperCase() + key.slice(1)}:
          <input
            type="text"
            name={key}
            value={formData[key]}
            onChange={handleChange}
            placeholder={`Enter ${key}`}
            className={`${key}-input`}
          />
        </label>
      </div>
    ));
  };

  return (
    <div>
      <form>{renderFormFields()}</form>
    </div>
  );
};

export default ApplicantCourseForm;
