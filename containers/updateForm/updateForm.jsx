import React, { Fragment, useState } from "react";
import PersonalInfoForm from "./PersonalInfo";
import AcademicInfoForm from "./AcademicInfo";
import FamilyInfoForm from "./FamilyInfo";
import ApplicantCourseForm from "./ApplicantCourse";

function UpdateFormLayout({ children }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({});

  const handlePrevious = () => {
    setCurrentStep((prevStep) => Math.max(0, prevStep - 1));
  };

  const handleNext = (stepData) => {
    setFormData((prevFormData) => ({ ...prevFormData, ...stepData }));
    setCurrentStep((prevStep) => prevStep + 1);
  };

  const handleSave = () => {
    console.log("Form saved!");
    console.log("All Form Data:", formData);
  };

  const handleClear = () => {
    console.log("Form cleared!");
    setFormData({});
    setCurrentStep(0);
  };

  return (
    <Fragment>
      {React.Children.map(children, (child, index) =>
        index === currentStep
          ? React.cloneElement(child, {
              onNext: handleNext,
              formData: formData,
            })
          : null
      )}

      <button onClick={handlePrevious} disabled={currentStep === 0}>
        Previous
      </button>
      <button
        onClick={() => handleNext(formData)} // Pass current form data to the next step
        disabled={currentStep === React.Children.count(children) - 1}
      >
        Next
      </button>
      <button onClick={handleSave}>Save</button>
      <button onClick={handleClear}>Clear</button>
    </Fragment>
  );
}

const UpdateForm = () => (
  <UpdateFormLayout>
    <PersonalInfoForm />
    <AcademicInfoForm />
    <FamilyInfoForm />
    <ApplicantCourseForm />
  </UpdateFormLayout>
);

export default UpdateForm;
