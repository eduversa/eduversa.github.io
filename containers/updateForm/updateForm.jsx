import React, { useState } from "react";
import PersonalInfoForm from "./PersonalInfo";
import AcademicInfoForm from "./AcademicInfo";
import FamilyInfoForm from "./FamilyInfo";
import ApplicantCourseForm from "./ApplicantCourse";

const UpdateForm = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    // Your form data here
  });

  const nextStep = () => {
    setStep((prevStep) => prevStep + 1);
  };

  const prevStep = () => {
    setStep((prevStep) => prevStep - 1);
  };

  const clearForm = () => {
    setFormData({
      // Clear your form data here
    });
  };

  const saveForm = () => {
    // Handle saving form data
    console.log("Saved Form Data:", formData);
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <PersonalInfoForm formData={formData} setFormData={setFormData} />
        );
      case 2:
        return (
          <AcademicInfoForm formData={formData} setFormData={setFormData} />
        );
      case 3:
        return <FamilyInfoForm formData={formData} setFormData={setFormData} />;
      case 4:
        return (
          <ApplicantCourseForm formData={formData} setFormData={setFormData} />
        );
      default:
        return null;
    }
  };

  return (
    <div>
      {renderStep()}

      <div>
        {step > 1 && <button onClick={prevStep}>Previous</button>}
        {step < 4 && <button onClick={nextStep}>Next</button>}
        {step === 4 && <button onClick={saveForm}>Save</button>}
        <button onClick={clearForm}>Clear</button>
      </div>
    </div>
  );
};

export default UpdateForm;
