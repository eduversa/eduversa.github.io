import React, { Fragment, useState } from "react";
import PersonalInfoForm from "./PersonalInfo";
import AcademicInfoForm from "./AcademicInfo";
function UpdateFormLayout({ children }) {
  const [currentStep, setCurrentStep] = useState(0);

  const handlePrevious = () => {
    setCurrentStep((prevStep) => Math.max(0, prevStep - 1));
  };

  const handleNext = () => {
    setCurrentStep((prevStep) => prevStep + 1);
  };

  const handleSave = () => {
    console.log("Form saved!");
  };

  const handleClear = () => {
    console.log("Form cleared!");
  };

  return (
    <Fragment>
      {React.Children.map(children, (child, index) =>
        index === currentStep ? child : null
      )}

      <button onClick={handlePrevious} disabled={currentStep === 0}>
        Previous
      </button>
      <button
        onClick={handleNext}
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
    <PersonalInfoForm></PersonalInfoForm>
    <AcademicInfoForm></AcademicInfoForm>
  </UpdateFormLayout>
);

export default UpdateForm;
