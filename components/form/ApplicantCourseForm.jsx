import React, { useState } from "react";

const ApplicantCourseForm = ({ data, onSubmit }) => {
  const [formData, setFormData] = useState(() => {
    const initialData = {};
    for (const field in data) {
      initialData[field] = data[field].default || "";
    }
    return initialData;
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      {Object.keys(data).map((field) => (
        <label key={field}>
          {field.charAt(0).toUpperCase() + field.slice(1)}:
          <input
            type={data[field].type}
            name={field}
            value={formData[field]}
            onChange={handleChange}
          />
        </label>
      ))}
    </form>
  );
};

export default ApplicantCourseForm;
