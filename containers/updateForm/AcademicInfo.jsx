import React, { useState } from "react";

const AcademicInfoForm = ({ formData, updateFormData }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;

    updateFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleMarksChange = (e, examType, subject) => {
    const { value } = e.target;

    updateFormData((prevData) => ({
      ...prevData,
      [examType]: {
        ...prevData[examType],
        marks: {
          ...prevData[examType].marks,
          [subject]: value,
        },
      },
    }));
  };

  const renderFormFields = () => {
    return Object.keys(formData).map((examType) => {
      return (
        <div key={examType} className={`${examType}-group`}>
          <h3>
            {examType === "admission"
              ? "Admission"
              : examType.replace("_", " ")}
          </h3>
          {Object.keys(formData[examType]).map((key) => {
            if (key === "marks") {
              return (
                <div key={key} className={`${examType}-${key}`}>
                  <h4>Marks:</h4>
                  {Object.keys(formData[examType][key]).map((subject) => (
                    <label key={subject}>
                      {subject.charAt(0).toUpperCase() + subject.slice(1)}:
                      <input
                        type="text"
                        name={`${examType}_marks_${subject}`}
                        value={formData[examType][key][subject]}
                        onChange={(e) =>
                          handleMarksChange(e, examType, subject)
                        }
                        placeholder={`Enter ${subject}`}
                        className={`${examType}-marks-${subject}-input`}
                      />
                    </label>
                  ))}
                </div>
              );
            }

            return (
              <div key={key} className={`${examType}-${key}`}>
                <label>
                  {key.charAt(0).toUpperCase() + key.slice(1)}:
                  <input
                    type="text"
                    name={`${examType}_${key}`}
                    value={formData[examType][key]}
                    onChange={handleChange}
                    placeholder={`Enter ${key}`}
                    className={`${examType}-${key}-input`}
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

export default AcademicInfoForm;
