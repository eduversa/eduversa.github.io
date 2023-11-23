import React, { useState } from "react";

const FamilyInfoForm = ({ data, onSubmit }) => {
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

  const handleAddressChange = (type, e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [type]: {
        ...prevData[type],
        office_address: {
          ...prevData[type].office_address,
          [name]: value,
        },
      },
    }));
  };

  return (
    <form>
      {Object.keys(data).map((field) => (
        <div key={field}>
          {Object.keys(data[field]).map((subfield) => (
            <div key={subfield}>
              {subfield === "office_address" ? (
                // Nested Address Field
                Object.keys(data[field][subfield]).map((addressField) => (
                  <label key={addressField}>
                    {addressField.charAt(0).toUpperCase() +
                      addressField.slice(1)}
                    :
                    <input
                      type={data[field][subfield][addressField].type}
                      name={`${field}.${subfield}.${addressField}`}
                      value={formData[field][subfield][addressField]}
                      onChange={(e) => handleAddressChange(field, e)}
                    />
                  </label>
                ))
              ) : (
                <label>
                  {subfield.charAt(0).toUpperCase() + subfield.slice(1)}:
                  <input
                    type={data[field][subfield].type}
                    name={`${field}.${subfield}`}
                    value={formData[field][subfield]}
                    onChange={(e) =>
                      subfield === "office_address"
                        ? handleAddressChange(field, e)
                        : handleNestedChange(field, e)
                    }
                  />
                </label>
              )}
            </div>
          ))}
        </div>
      ))}
    </form>
  );
};

export default FamilyInfoForm;
