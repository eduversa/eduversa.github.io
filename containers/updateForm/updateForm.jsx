import React, { useState } from "react";
import PersonalInfoForm from "./PersonalInfo";
import FamilyInfoForm from "./FamilyInfo";
import AcademicInfoForm from "./AcademicInfo";
import ApplicantCourseForm from "./ApplicantCourse";

const ApplicationFormLayout = () => {
  const [currentPage, setCurrentPage] = useState(1);

  const [personalInfoFormData, setPersonalInfoFormData] = useState({
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

  const [academicInfoFormData, setAcademicInfoFormData] = useState({
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
  });

  const [familyInfoFormData, setFamilyInfoFormData] = useState({
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

  const [applicantCourseFormData, setApplicantCourseFormData] = useState({
    course_name: "",
    duration: "",
    stream: "",
    admission_year: new Date().getFullYear().toString(),
  });

  const handleNextPage = () => {
    // Handle updating form data based on the current page
    if (currentPage === 1) {
      setPersonalInfoFormData(personalInfoFormData);
    } else if (currentPage === 2) {
      setFamilyInfoFormData(familyInfoFormData);
    } else if (currentPage === 3) {
      setAcademicInfoFormData(academicInfoFormData);
    } else if (currentPage === 4) {
      setApplicantCourseFormData(applicantCourseFormData);
    }

    // Move to the next page
    setCurrentPage((prevPage) => Math.min(prevPage + 1, 4));
  };

  const handlePrevPage = () => {
    setCurrentPage((prevPage) => Math.max(1, prevPage - 1));
  };

  const handlePersonalInfoUpdate = (newFormData) => {
    setPersonalInfoFormData(newFormData);
  };

  const handleFamilyInfoUpdate = (newFormData) => {
    setFamilyInfoFormData(newFormData);
  };

  const handleAcademicInfoUpdate = (newFormData) => {
    setAcademicInfoFormData(newFormData);
  };

  const handleApplicantCourseUpdate = (newFormData) => {
    setApplicantCourseFormData(newFormData);
  };

  const handleSubmit = () => {
    console.log("All Form Data:", {
      personalInfo: personalInfoFormData,
      familyInfo: familyInfoFormData,
      academicInfo: academicInfoFormData,
      applicantCourseInfo: applicantCourseFormData,
    });
  };

  return (
    <div>
      <h1>Application Form - Page {currentPage}</h1>

      {currentPage === 1 && (
        <PersonalInfoForm
          formData={personalInfoFormData}
          updateFormData={handlePersonalInfoUpdate}
        />
      )}

      {currentPage === 2 && (
        <FamilyInfoForm
          formData={familyInfoFormData}
          updateFormData={handleFamilyInfoUpdate}
        />
      )}

      {currentPage === 3 && (
        <AcademicInfoForm
          formData={academicInfoFormData}
          updateFormData={handleAcademicInfoUpdate}
        />
      )}

      {currentPage === 4 && (
        <ApplicantCourseForm
          formData={applicantCourseFormData}
          updateFormData={handleApplicantCourseUpdate}
        />
      )}

      <div>
        {currentPage > 1 && (
          <button onClick={handlePrevPage}>Previous Page</button>
        )}
        {currentPage < 4 && <button onClick={handleNextPage}>Next Page</button>}
        {currentPage === 4 && <button onClick={handleSubmit}>Submit</button>}
      </div>
    </div>
  );
};

export default ApplicationFormLayout;
