import React, { useState } from "react";

const PersonalInfoForm = () => {
  const [formData, setFormData] = useState({
    first_name: "",
    middle_name: "",
    last_name: "",
    gender: "",
    dob: "",
    present_address: {
      street: "",
      pincode: "",
      city: "",
      district: "",
      state: "",
    },
    permanent_address: {
      street: "",
      pincode: "",
      city: "",
      district: "",
      state: "",
    },
    are_addresses_same: false,
    email: "",
    contact: "",
    category: "",
    blood_group: "",
    aadhar_number: "",
    pan_number: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    const addressType = name.split("_")[0];

    setFormData((prevData) => ({
      ...prevData,
      [addressType]: {
        ...prevData[addressType],
        [name.split("_")[1]]: value,
      },
    }));
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: checked,
    }));
  };

  const renderFormFields = () => {
    return Object.keys(formData).map((key) => {
      if (typeof formData[key] === "object") {
        return Object.keys(formData[key]).map((nestedKey) => (
          <div key={nestedKey}>
            <h3>
              {key === "present_address" ? "Present " : "Permanent "}
              {nestedKey.charAt(0).toUpperCase() + nestedKey.slice(1)}
            </h3>
            <label>
              {nestedKey.charAt(0).toUpperCase() + nestedKey.slice(1)}:
              <input
                type="text"
                name={`${key}_${nestedKey}`}
                value={formData[key][nestedKey]}
                onChange={handleAddressChange}
                placeholder={`Enter ${nestedKey}`}
              />
            </label>
          </div>
        ));
      }

      if (key === "are_addresses_same") {
        return (
          <div key={key}>
            <h3>Are Addresses Same?</h3>
            <label>
              <input
                type="checkbox"
                name={key}
                checked={formData[key]}
                onChange={handleCheckboxChange}
              />
            </label>
          </div>
        );
      }

      return (
        <div key={key}>
          <h3>{key.charAt(0).toUpperCase() + key.slice(1)}</h3>
          <label>
            <input
              type="text"
              name={key}
              value={formData[key]}
              onChange={handleChange}
              placeholder={`Enter ${key}`}
            />
          </label>
        </div>
      );
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Data:", formData);
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        {renderFormFields()}
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default PersonalInfoForm;
