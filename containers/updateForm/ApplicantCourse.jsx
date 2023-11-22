import React, { useState } from "react";

const ApplicantCourseForm = () => {
  const [formData, setFormData] = useState({
    course_name: "",
    duration: "",
    stream: "",
    admission_year: new Date().getFullYear().toString(),
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevData) => ({
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

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Applicant Course Form Data:", formData);
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

export default ApplicantCourseForm;
