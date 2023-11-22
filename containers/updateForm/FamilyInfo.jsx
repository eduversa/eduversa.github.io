import React, { useState } from "react";

const FamilyInfoForm = () => {
  const [formData, setFormData] = useState({
    father: {
      first_name: "",
      middle_name: "",
      last_name: "",
      email: "",
      contact: "",
    },
    mother: {
      first_name: "",
      middle_name: "",
      last_name: "",
      email: "",
      contact: "",
    },
    guardian: {
      first_name: "",
      middle_name: "",
      last_name: "",
      relation: "",
      office_address: {
        street: "",
        pincode: "",
        city: "",
        district: "",
        state: "",
      },
      occupation: "",
      designation: "",
      office_contact: "",
      contact: "",
      income: "",
      email: "",
      pan_number: "",
      aadhar_number: "",
    },
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
        office_address: {
          ...prevData[addressType].office_address,
          [name.split("_")[1]]: value,
        },
      },
    }));
  };

  const renderFormFields = () => {
    return Object.keys(formData).map((familyMember) => {
      return (
        <div key={familyMember} className={`${familyMember}-group`}>
          <h3>
            {familyMember.charAt(0).toUpperCase() + familyMember.slice(1)}
          </h3>
          {Object.keys(formData[familyMember]).map((key) => {
            if (key === "office_address") {
              return (
                <div key={key} className={`${familyMember}-${key}`}>
                  <h4>Office Address:</h4>
                  {Object.keys(formData[familyMember][key]).map(
                    (addressKey) => (
                      <label key={addressKey}>
                        {addressKey.charAt(0).toUpperCase() +
                          addressKey.slice(1)}
                        :
                        <input
                          type="text"
                          name={`${familyMember}_office_address_${addressKey}`}
                          value={formData[familyMember][key][addressKey]}
                          onChange={handleAddressChange}
                          placeholder={`Enter ${addressKey}`}
                          className={`${familyMember}-${key}-${addressKey}-input`}
                        />
                      </label>
                    )
                  )}
                </div>
              );
            }

            return (
              <div key={key} className={`${familyMember}-${key}`}>
                <label>
                  {key.charAt(0).toUpperCase() + key.slice(1)}:
                  <input
                    type="text"
                    name={`${familyMember}_${key}`}
                    value={formData[familyMember][key]}
                    onChange={handleChange}
                    placeholder={`Enter ${key}`}
                    className={`${familyMember}-${key}-input`}
                  />
                </label>
              </div>
            );
          })}
        </div>
      );
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Family Form Data:", formData);
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

export default FamilyInfoForm;
