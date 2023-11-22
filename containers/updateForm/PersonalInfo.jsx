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

  const renderAddressFields = (addressType) => {
    return Object.keys(formData[addressType]).map((key) => (
      <div key={key} className={`${addressType}-${key}`}>
        <label>
          {key.charAt(0).toUpperCase() + key.slice(1)}:
          <input
            type="text"
            name={`${addressType}_${key}`}
            value={formData[addressType][key]}
            onChange={handleAddressChange}
            placeholder={`Enter ${key}`}
            className={`${addressType}-${key}-input`}
          />
        </label>
      </div>
    ));
  };

  const renderFormFields = () => {
    return Object.keys(formData).map((key) => {
      const className = key.toLowerCase();

      if (typeof formData[key] === "object") {
        return (
          <div key={key} className={`${className}-group`}>
            <h3>
              {key === "present_address"
                ? "Present Address"
                : "Permanent Address"}
            </h3>
            {renderAddressFields(key)}
          </div>
        );
      }

      if (key === "dob") {
        return (
          <div key={key} className={className}>
            <h3>Date of Birth:</h3>
            <label>
              <input
                type="date"
                name={key}
                value={formData[key]}
                onChange={handleChange}
                className={`${className}-input`}
              />
            </label>
          </div>
        );
      }

      if (key === "are_addresses_same") {
        return (
          <div key={key} className={className}>
            <h3>Are Addresses Same?</h3>
            <label>
              <input
                type="checkbox"
                name={key}
                checked={formData[key]}
                onChange={handleCheckboxChange}
                className={`${className}-checkbox`}
              />
            </label>
          </div>
        );
      }

      return (
        <div key={key} className={className}>
          <h3>{key.charAt(0).toUpperCase() + key.slice(1)}</h3>
          <label>
            <input
              type="text"
              name={key}
              value={formData[key]}
              onChange={handleChange}
              placeholder={`Enter ${key}`}
              className={`${className}-input`}
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
