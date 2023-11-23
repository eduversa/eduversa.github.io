import React, { useState } from "react";

const PersonalInfoForm = ({ data, onSubmit }) => {
  const [formData, setFormData] = useState(() => {
    const initialData = {};
    for (const field in data) {
      if (typeof data[field] === "object") {
        initialData[field] = {};
        for (const subfield in data[field]) {
          initialData[field][subfield] = data[field][subfield].default || "";
        }
      } else {
        initialData[field] = data[field].default || "";
      }
    }
    return initialData;
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
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

  return (
    <form>
      {Object.keys(data).map((field) => (
        <div key={field}>
          {typeof data[field] === "object" ? (
            // Nested Object (e.g., present_address, permanent_address)
            Object.keys(data[field]).map((subfield) => (
              <label key={subfield}>
                {subfield.charAt(0).toUpperCase() + subfield.slice(1)}:
                <input
                  type={data[field][subfield].type}
                  name={`${field}.${subfield}`}
                  value={formData[field][subfield]}
                  onChange={(e) => handleNestedChange(field, e)}
                  disabled={
                    field === "permanent_address" && formData.are_addresses_same
                  }
                />
              </label>
            ))
          ) : (
            // Regular Field
            <label>
              {field.charAt(0).toUpperCase() + field.slice(1)}:
              <input
                type={data[field].type}
                name={field}
                value={formData[field]}
                onChange={handleChange}
                checked={data[field].type === "checkbox" && formData[field]}
              />
            </label>
          )}
        </div>
      ))}
    </form>
  );
};

export default PersonalInfoForm;
