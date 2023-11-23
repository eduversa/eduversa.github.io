import React, { useState } from "react";

const AcademicInfoForm = ({ data, onSubmit }) => {
  const [formData, setFormData] = useState(() => {
    const initialData = {};
    for (const field in data) {
      initialData[field] = {};
      for (const subfield in data[field]) {
        initialData[field][subfield] = "";
      }
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

  const handleNestedChange = (type, e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [type]: {
        ...prevData[type],
        [name]: value,
      },
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      {Object.keys(data).map((field) => (
        <div key={field}>
          {Object.keys(data[field]).map((subfield) => (
            <label key={subfield}>
              {subfield.charAt(0).toUpperCase() + subfield.slice(1)}:
              <input
                type={data[field][subfield].type}
                name={`${field}.${subfield}`}
                value={formData[field][subfield]}
                onChange={(e) => handleNestedChange(field, e)}
              />
            </label>
          ))}
        </div>
      ))}
    </form>
  );
};

export default AcademicInfoForm;
