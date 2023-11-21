import React, { useState, useEffect } from "react";
import {
  PersonalInfo,
  FamilyInfo,
  AcademicInfo,
  CourseInfo,
  FileUpload,
} from "./formPages";
import { FormButtons } from "./inputComponent/InputComponent";

const ApplicantForm = () => {
  //initial Form Data
  const initialFormData = {
    personal_info: {
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
      name: "",
      email: "",
      contact: "",
      gender: "",
      dob: "",
      are_addresses_same: false,
      category: "",
      blood_group: "",
      aadhar_number: "",
      pan_number: "",
    },
    family_info: {
      father: {
        name: "",
        email: "",
        contact: "",
      },
      mother: {
        name: "",
        email: "",
        contact: "",
      },
      guardian: {
        office_address: {
          street: "",
          pincode: "",
          city: "",
          district: "",
          state: "",
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
        aadhar_number: "",
      },
    },
    academic_info: {
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
      },
      higher_secondary: {
        exam_name: "",
        year_of_exam: "",
        board: "",
        aggregate: "",
        school_name: "",
      },
    },
    course_info: {
      enrollment_number: "",
      course_name: "",
      duration: "",
      stream: "",
      admission_year: "",
    },
    image: null,
  };
  const [formData, setFormData] = useState(initialFormData);

  // Load saved form data from local storage on component mount
  useEffect(() => {
    const savedFormData = JSON.parse(localStorage.getItem("formData"));
    const savedCurrentStep = JSON.parse(localStorage.getItem("currentStep"));
    if (savedFormData) {
      setFormData(savedFormData);
    }
    if (savedCurrentStep) {
      setCurrentStep(savedCurrentStep);
    }
  }, []);

  //steps in the form
  const [currentStep, setCurrentStep] = useState(1);

  // fn to handle change in the input fields
  const handleChange = (event, callback) => {
    const { name, value } = event.target;

    if (name === "formData") {
      setFormData((prevFormData) => ({ ...prevFormData, ...value }), callback);
      return;
    }

    const nameArray = name.split(".");
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
    localStorage.setItem("formData", JSON.stringify(formData));
  };

  // // clears all the form data from the state and also localStorage
  // const clearFormData = () => {
  //   setFormData(initialFormData);
  //   localStorage.removeItem('formData');
  // };

  // clears the current page from the state not localStorage
  const clearFormData = (currentStep) => {
    let updatedFormData = { ...formData };

    switch (currentStep) {
      case 1:
        updatedFormData.personal_info = initialFormData.personal_info;
        break;
      case 2:
        updatedFormData.family_info = initialFormData.family_info;
        break;
      case 3:
        updatedFormData.academic_info = initialFormData.academic_info;
        break;
      case 4:
        updatedFormData.course_info = initialFormData.course_info;
        break;
      case 5:
        updatedFormData.image = initialFormData.image;
        break;
      default:
        break;
    }

    setFormData(updatedFormData);
  };

  // function to move to the next page
  const handleNextClick = (event) => {
    event.preventDefault();
    if (presentPincodeError || permanentPincodeError || officePincodeError) {
      alert("Please enter a valid pincode.");
      return;
    }
    const nextStep = currentStep + 1;
    setCurrentStep(nextStep);
    localStorage.setItem("currentStep", JSON.stringify(nextStep));
  };

  // function to move to the previous page
  const handlePreviousClick = (event) => {
    event.preventDefault();
    const previousStep = currentStep - 1;
    setCurrentStep(previousStep);
    localStorage.setItem("currentStep", JSON.stringify(previousStep));
  };

  // function to submit the form
  const handleSubmit = (event) => {
    event.preventDefault();
    alert("Form Submitted");
    console.log("Form submitted:", formData);
  };

  // pincode error states
  const [presentPincodeError, setPresentPincodeError] = useState(false);
  const [permanentPincodeError, setPermanentPincodeError] = useState(false);
  const [officePincodeError, setOfficePincodeError] = useState(false);

  // all the pages

  const formSteps = [
    PersonalInfo,
    FamilyInfo,
    AcademicInfo,
    CourseInfo,
    FileUpload,
  ];
  const totalSteps = formSteps.length;

  const pageTitles = formSteps.map((step) => {
    const stepName = step.name;
    return stepName.replace(/([A-Z])/g, " $1").trim();
  });

  // const pageTitles = ["Personal Information", "Family Information", "Academic Information", "Course Information", "File Upload"];

  const renderStep = formSteps.map((StepComponent, index) => (
    <StepComponent
      key={index + 1}
      formData={formData}
      handleChange={handleChange}
      setFormData={setFormData}
      presentPincodeError={presentPincodeError}
      setPresentPincodeError={setPresentPincodeError}
      permanentPincodeError={permanentPincodeError}
      setPermanentPincodeError={setPermanentPincodeError}
      officePincodeError={officePincodeError}
      setOfficePincodeError={setOfficePincodeError}
    />
  ));

  // const renderStep = [

  //     <PersonalInfo
  //       formData={formData}
  //       handleChange={handleChange}
  //       handleNextClick={handleNextClick}
  //       handlePreviousClick={handlePreviousClick}
  //       handleSubmit={handleSubmit}
  //       handleSave={handleSave}
  //       key={1}
  //     />,
  //     <FamilyInfo
  //       formData={formData}
  //       handleChange={handleChange}
  //       handleNextClick={handleNextClick}
  //       handlePreviousClick={handlePreviousClick}
  //       handleSubmit={handleSubmit}
  //       handleSave={handleSave}
  //       key={2}
  //     />,
  //     <AcademicInfo
  //       formData={formData}
  //       handleChange={handleChange}
  //       handleNextClick={handleNextClick}
  //       handlePreviousClick={handlePreviousClick}
  //       handleSubmit={handleSubmit}
  //       handleSave={handleSave}
  //       key={3}
  //     />,
  //     <CourseInfo
  //       formData={formData}
  //       handleChange={handleChange}
  //       handleNextClick={handleNextClick}
  //       handlePreviousClick={handlePreviousClick}
  //       handleSubmit={handleSubmit}
  //       handleSave={handleSave}
  //       key={4}
  //     />,
  //     <FileUpload
  //       formData={formData}
  //       setFormData={setFormData}
  //       handleChange={handleChange}
  //       handleNextClick={handleNextClick}
  //       handlePreviousClick={handlePreviousClick}
  //       handleSubmit={handleSubmit}
  //       handleSave={handleSave}
  //       key={5}
  //     />,

  // ]
  // const renderStep =[
  //   <PersonalInfo/>,
  //   <FamilyInfo/>,
  //   <AcademicInfo/>,
  //   <CourseInfo/>,
  //   <FileUpload/>,
  // ]

  const progress = (currentStep / formSteps.length) * 100;

  return (
    <div
      className="form"
      style={{ background: `hsl(${(currentStep - 1) * 62.5}, 40% , 85%)` }}
    >
      <h1 className="form--heading">Applicant Form</h1>

      <div className="form--content">
        <div
          className="progress-bar"
          style={{
            width:
              currentStep === renderStep.length
                ? `${progress + 2}%`
                : `${progress}%`,
            background: `hsl(${(currentStep - 1) * 62.5}, 50% , 60%)`,
            // borderBottomRightRadius: currentStep === renderStep.length ? "0" : "10px"
          }}
        ></div>
        <div className="page">
          <h2 className="page--title">{pageTitles[currentStep - 1]}</h2>

          <form
            className="page--content"
            onSubmit={
              currentStep === totalSteps ? handleSubmit : handleNextClick
            }
          >
            {/* displaying the pages from the array according to the page number */}
            {renderStep[currentStep - 1]}

            <FormButtons
              handlePreviousClick={handlePreviousClick}
              clearFormData={() => clearFormData(currentStep)}
              handleSave={handleSave}
              currentStep={currentStep}
              totalSteps={totalSteps}
            />
          </form>
        </div>
      </div>
    </div>
  );
};

export default ApplicantForm;
