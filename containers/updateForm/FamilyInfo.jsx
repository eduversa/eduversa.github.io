import React, { useState } from "react";

const FamilyInfoForm = ({ formData, updateFormData }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;

    updateFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    const addressType = name.split("_")[0];

    updateFormData((prevData) => ({
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

  return (
    <div>
      <form>{renderFormFields()}</form>
    </div>
  );
};

export default FamilyInfoForm;
