import React, { useState } from "react";
import {
  PersonalInfoForm,
  AcademicInfoForm,
  FamilyInfoForm,
  ApplicantCourseForm,
} from "@/components";

const FormLayout = () => {
  const [activeStep, setActiveStep] = useState(1);
  const [formData, setFormData] = useState({});
  const personalInfoData = {
    first_name: { type: "text" },
    middle_name: { type: "text" },
    last_name: { type: "text" },
    gender: { type: "text" },
    dob: { type: "date" },
    present_address: {
      street: { type: "text" },
      pincode: { type: "text" },
      city: { type: "text" },
      district: { type: "text" },
      state: { type: "text" },
    },
    permanent_address: {
      street: { type: "text" },
      pincode: { type: "text" },
      city: { type: "text" },
      district: { type: "text" },
      state: { type: "text" },
    },
    are_addresses_same: { type: "checkbox", default: false },
    email: { type: "text" },
    contact: { type: "text" },
    category: { type: "text" },
    blood_group: { type: "text" },
    aadhar_number: { type: "text" },
    pan_number: { type: "text" },
  };
  const academicInfoData = {
    admission: {
      exam_name: { type: "text" },
      year_of_exam: { type: "text" },
      roll_number: { type: "text" },
      rank: { type: "text" },
    },
    secondary: {
      exam_name: { type: "text" },
      year_of_exam: { type: "text" },
      board: { type: "text" },
      aggregate: { type: "text" },
      school_name: { type: "text" },
      subjects: "text",
      marks: "object",
    },
    higher_secondary: {
      exam_name: { type: "text" },
      year_of_exam: { type: "text" },
      board: { type: "text" },
      aggregate: { type: "text" },
      school_name: { type: "text" },
      subjects: "text",
      marks: "object",
    },
  };
  const familyInfoData = {
    father: {
      first_name: { type: "text" },
      middle_name: { type: "text" },
      last_name: { type: "text" },
      email: { type: "text" },
      contact: { type: "text" },
    },
    mother: {
      first_name: { type: "text" },
      middle_name: { type: "text" },
      last_name: { type: "text" },
      email: { type: "text" },
      contact: { type: "text" },
    },
    guardian: {
      first_name: { type: "text" },
      middle_name: { type: "text" },
      last_name: { type: "text" },
      relation: { type: "text" },
      office_address: {
        street: { type: "text" },
        pincode: { type: "text" },
        city: { type: "text" },
        district: { type: "text" },
        state: { type: "text" },
      },
      occupation: { type: "text" },
      designation: { type: "text" },
      office_contact: { type: "text" },
      contact: { type: "text" },
      income: { type: "text" },
      email: { type: "text" },
      pan_number: { type: "text" },
      aadhar_number: { type: "text" },
    },
  };
  const applicantCourseData = {
    course_name: { type: "text" },
    duration: { type: "text" },
    stream: { type: "text" },
    admission_year: { type: "text", default: new Date().getFullYear() },
  };

  const handleStepChange = (step, form) => {
    setActiveStep(step);
    setFormData((prevFormData) => ({ ...prevFormData, ...form }));
  };

  const handlePersonalInfoSubmit = (formData) => {
    handleStepChange(2, formData);
  };

  const handleAcademicInfoSubmit = (formData) => {
    handleStepChange(3, formData);
  };

  const handleFamilyInfoSubmit = (formData) => {
    handleStepChange(4, formData);
  };

  const handleApplicantCourseSubmit = (formData) => {
    if (process.env.NODE_ENV === "development") {
      console.log("All Form Data:", { ...formData, ...applicantCourseData });
    }
  };

  return (
    <div>
      <h1>Application Form</h1>

      {activeStep === 1 && (
        <div>
          <h2>Personal Information</h2>
          <PersonalInfoForm
            data={personalInfoData}
            onSubmit={handlePersonalInfoSubmit}
          />
        </div>
      )}

      {activeStep === 2 && (
        <div>
          <h2>Academic Information</h2>
          <AcademicInfoForm
            data={academicInfoData}
            onSubmit={handleAcademicInfoSubmit}
          />
        </div>
      )}

      {activeStep === 3 && (
        <div>
          <h2>Family Information</h2>
          <FamilyInfoForm
            data={familyInfoData}
            onSubmit={handleFamilyInfoSubmit}
          />
        </div>
      )}

      {activeStep === 4 && (
        <div>
          <h2>Applicant Course Information</h2>
          <ApplicantCourseForm
            data={applicantCourseData}
            onSubmit={handleApplicantCourseSubmit}
          />
        </div>
      )}

      <div>
        {activeStep > 1 && (
          <button onClick={() => handleStepChange(activeStep - 1, {})}>
            Previous
          </button>
        )}
        {activeStep < 4 && (
          <button onClick={() => handleStepChange(activeStep + 1, {})}>
            Next
          </button>
        )}
      </div>
    </div>
  );
};

export default FormLayout;
