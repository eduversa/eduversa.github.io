import React, { useState, useEffect } from "react";
import { PersonalInfo, FamilyInfo, AcademicInfo, CourseInfo } from "./formPages";

const ApplicantForm = () => {

  // window.onbeforeunload = function() {
  //   return "Data will be lost if you leave the page, are you sure?";
  // };

  //initial Form Data
  const initialFormData = {
    personal_info: {
      present_address: {
        street: "",
        pincode: "",
        city: "",
        district: "",
        state: ""
      },
      permanent_address: {
        street: "",
        pincode: "",
        city: "",
        district: "",
        state: ""
      },
      first_name: "Ankur",
      middle_name: "",
      last_name: "H",
      email: "a@g.com",
      contact: "1234567890",
      gender: "",
      dob: "",
      are_adresses_same: false,
      category: "GN",
      blood_group: "B+",
      aadhar_number: "",
      pan_number: ""
    },
    family_info: {
      father: {
        first_name: "",
        middle_name: "",
        last_name: "",
        email: "",
        contact: ""
      },
      mother: {
        first_name: "",
        middle_name: "",
        last_name: "",
        email: "",
        contact: ""
      },
      guardian: {
        office_address: {
          street: "",
          pincode: "",
          city: "",
          district: "",
          state: ""
        },
        first_name: "",
        middle_name: "",
        last_name: "",
        relation: "",
        occupation: "",
        designation: "",
        office_contact: "",
        contact: "",
        income: "",
        email: "",
        pan_number: "",
        aadhar_number: ""
      }
    },
    academic_info: {
      admission: {
        exam_name: "",
        year_of_exam: "",
        roll_number: "",
        rank: ""
      },
      secondary: {
        exam_name: "",
        year_of_exam: "",
        board: "",
        aggregate: "",
        school_name: ""
      },
      higher_secondary: {
        exam_name: "",
        year_of_exam: "",
        board: "",
        aggregate: "",
        school_name: ""
      }
    },
    course_info: {
      enrollment_number: "",
      course_name: "",
      duration: "",
      stream: "",
      admission_year: ""
    }
  }
  const [formData, setFormData] = useState(initialFormData);

  // Load saved form data from local storage on component mount
  useEffect(() => {
    const savedFormData = JSON.parse(localStorage.getItem('formData'));
    if (savedFormData) {
      setFormData(savedFormData);
    }
  }, []);

  //steps in the form
  const [currentStep, setCurrentStep] = useState(1);


  // handles the change in the form input fields
  const handleChange = (event) => {
    const { name, value } = event.target;
  
    // Split the name into an array using dot notation to access nested properties
    const nameArray = name.split('.');
  
    // Use reduce to traverse the nested structure and update the state
    setFormData((prevFormData) => {
      let updatedData = { ...prevFormData };
      let currentLevel = updatedData;
  
      for (let i = 0; i < nameArray.length; i++) {
        if (i === nameArray.length - 1) {
          // Update the value at the last level
          currentLevel[nameArray[i]] = value;
        } else {
          // Create nested structures if they don't exist
          currentLevel[nameArray[i]] = { ...currentLevel[nameArray[i]] };
          // Move to the next level
          currentLevel = currentLevel[nameArray[i]];
        }
      }
  
      return updatedData;
    });
  };

  // Save form data to local storage when the SAVE button is pressed
  const handleSave = () => {
    localStorage.setItem('formData', JSON.stringify(formData));
  };
  
  // function to move to the next page
  const handleNextClick = (event) => {
    event.preventDefault(); 
    setCurrentStep((prevStep) => prevStep + 1);
  };

  // function to move to the previous page
  const handlePreviousClick = (event) => {
    event.preventDefault(); 
    setCurrentStep((prevStep) => prevStep - 1);
  };

  // function to submit the form
  const handleSubmit = (event) => {
    event.preventDefault(); 
    console.log("Form submitted:", formData);
  };


  // all the pages with all the prop functions
  const renderStep = [

      <PersonalInfo 
        formData={formData} 
        handleChange={handleChange} 
        handleNextClick={handleNextClick} 
        handlePreviousClick={handlePreviousClick} 
        handleSubmit={handleSubmit}
        handleSave={handleSave}
      />,
      <FamilyInfo 
        formData={formData} 
        handleChange={handleChange} 
        handleNextClick={handleNextClick} 
        handlePreviousClick={handlePreviousClick} 
        handleSubmit={handleSubmit}
        handleSave={handleSave}
      />,
      <AcademicInfo 
        formData={formData} 
        handleChange={handleChange} 
        handleNextClick={handleNextClick} 
        handlePreviousClick={handlePreviousClick} 
        handleSubmit={handleSubmit}
        handleSave={handleSave}
      />,
      <CourseInfo 
        formData={formData} 
        handleChange={handleChange} 
        handleNextClick={handleNextClick} 
        handlePreviousClick={handlePreviousClick} 
        handleSubmit={handleSubmit}
        handleSave={handleSave}
      />,

  ]


  return (
    <div className="form">
      <h1 className="form--heading">Applicant Form</h1>

      <div className="form--content">
        {/* displaying the pages from the array according to the page number */}
        {renderStep[currentStep-1]}
      </div>

    </div>
  );
};

export default ApplicantForm;
