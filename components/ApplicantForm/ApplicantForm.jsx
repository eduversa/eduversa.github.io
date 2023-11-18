import React, { useState, useEffect } from "react";
import { PersonalInfo, FamilyInfo, AcademicInfo, CourseInfo, FileUpload } from "./formPages";

const ApplicantForm = () => {

  // if (typeof window !== 'undefined') {
  //   window.onbeforeunload = function() {
  //     return "Data will be lost if you leave the page, are you sure?";
  //   };
  // }

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
      name: "",
      email: "a@g.com",
      contact: "1234567890",
      gender: "",
      dob: "",
      are_adresses_same: true,
      category: "GN",
      blood_group: "B+",
      aadhar_number: "",
      pan_number: ""
    },
    family_info: {
      father: {
        name: "",
        email: "",
        contact: ""
      },
      mother: {
        name: "",
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
        name: "",
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
    },
    image: null
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

  const handleChange = (event, callback) => {
    const { name, value } = event.target;
  
    if (name === 'formData') {
      setFormData(value, callback);
      return;
    }
  
    const nameArray = name.split('.');
    setFormData((prevFormData) => {
      let updatedData = { ...prevFormData };
      let currentLevel = updatedData;
  
      for (let i = 0; i < nameArray.length; i++) {
        if (i === nameArray.length - 1) {
          currentLevel[nameArray[i]] = value;
        } else {
          currentLevel[nameArray[i]] = { ...currentLevel[nameArray[i]] };
          currentLevel = currentLevel[nameArray[i]];
        }
      }
  
      return updatedData;
    }, callback);
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
    alert("Form Submitted")
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
      <FileUpload 
        formData={formData} 
        setFormData={setFormData}
        handleChange={handleChange} 
        handleNextClick={handleNextClick} 
        handlePreviousClick={handlePreviousClick} 
        handleSubmit={handleSubmit}
        handleSave={handleSave}
      />,

  ]
  // const renderStep =[
  //   <PersonalInfo/>,
  //   <FamilyInfo/>,
  //   <AcademicInfo/>,
  //   <CourseInfo/>,
  //   <FileUpload/>,
  // ]

  const progress=currentStep/(renderStep.length)*100

  return (
    <div className="form" style={{background: `hsl(${(currentStep - 1) * 62.5}, 40% , 85%)`}}>
      <h1 className="form--heading">Applicant Form</h1>

      <div className="form--content">
        <div 
          className="progress-bar" 
          style={{ 
            width: currentStep === renderStep.length ? `${progress +2}%` : `${progress}%`, 
            background: `hsl(${(currentStep - 1) * 62.5}, 50% , 60%)`,
            // borderBottomRightRadius: currentStep === renderStep.length ? "0" : "10px"
          }}
        >
        </div>
        {/* displaying the pages from the array according to the page number */}
        {renderStep[currentStep-1]}
        {/* {renderStep[currentStep - 1]({
          formData,
          setFormData,
          handleChange,
          handleNextClick,
          handlePreviousClick,
          handleSubmit,
          handleSave
        })} */}
      </div>

    </div>
  );
};

export default ApplicantForm;
