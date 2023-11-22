// UpdateForm.jsx
import React, { useState } from "react";
import PersonalInfoForm from "./PersonalInfo";
import AcademicInfoForm from "./AcademicInfo";
import FamilyInfoForm from "./FamilyInfo";
import ApplicantCourseForm from "./ApplicantCourse";

const UpdateForm = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    // ! personal form
    personalInfo: {
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
    },
    // ! academic form
    academicInfo: {
      admission: {
        exam_name: "",
        year_of_exam: "",
        roll_number: "",
        rank: "",
      },
      secondary: {
        exam_name: "",
        year_of_exam: "",
        board: "",
        aggregate: "",
        school_name: "",
        subjects: "",
        marks: {},
      },
      higher_secondary: {
        exam_name: "",
        year_of_exam: "",
        board: "",
        aggregate: "",
        school_name: "",
        subjects: "",
        marks: {},
      },
    },
    // ! family form
    familyInfo: {
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
    },
    // ! applicant course form
    applicantCourseInfo: {
      course_name: "",
      duration: "",
      stream: "",
      admission_year: new Date().getFullYear().toString(),
    },
  });

  const nextStep = () => {
    setStep((prevStep) => prevStep + 1);
  };

  const prevStep = () => {
    setStep((prevStep) => prevStep - 1);
  };

  const clearForm = () => {
    setFormData({
      personalInfo: {},
      academicInfo: {},
      familyInfo: {},
      applicantCourseInfo: {},
    });
  };

  const saveForm = () => {
    // Handle saving form data
    console.log("Saved Form Data:", formData);
  };

  const handleFormSubmit = () => {
    // Perform any additional logic here before submitting the form data

    // Call the appropriate form submission function based on the current step
    switch (step) {
      case 1:
        console.log("Personal Info Form Data:", formData.personalInfo);
        // Additional logic if needed
        break;
      case 2:
        console.log("Academic Info Form Data:", formData.academicInfo);
        // Additional logic if needed
        break;
      case 3:
        console.log("Family Info Form Data:", formData.familyInfo);
        // Additional logic if needed
        break;
      case 4:
        console.log(
          "Applicant Course Form Data:",
          formData.applicantCourseInfo
        );
        // Additional logic if needed
        break;
      default:
        break;
    }
  };

  const updateFormData = (updatedData) => {
    setFormData((prevData) => ({
      ...prevData,
      ...updatedData,
    }));
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <PersonalInfoForm
            formData={formData.personalInfo}
            updateFormData={(data) => updateFormData({ personalInfo: data })}
          />
        );
      case 2:
        return (
          <AcademicInfoForm
            formData={formData.academicInfo}
            updateFormData={(data) => updateFormData({ academicInfo: data })}
          />
        );
      case 3:
        return (
          <FamilyInfoForm
            formData={formData.familyInfo}
            updateFormData={(data) => updateFormData({ familyInfo: data })}
          />
        );
      case 4:
        return (
          <ApplicantCourseForm
            formData={formData.applicantCourseInfo}
            updateFormData={(data) =>
              updateFormData({ applicantCourseInfo: data })
            }
          />
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
        <button onClick={handleFormSubmit}>Submit</button>
        <button onClick={clearForm}>Clear</button>
      </div>
    </div>
  );
};

export default UpdateForm;
