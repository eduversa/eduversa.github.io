import React, { useState, useEffect, useMemo } from "react";
import {
  PersonalInfo,
  FamilyInfo,
  AcademicInfo,
  CourseInfo,
  FileUpload,
} from "./formPages";
import { FormButtons } from "./inputComponent/InputComponent";

const ApplicantForm = () => {
  let year = new Date().getFullYear().toString();
  //TEST
  //initial Form Data
  const initialFormData = useMemo(() => ({
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
      are_addresses_same: true,
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
        subjects: "",
      },
      higher_secondary: {
        exam_name: "",
        year_of_exam: "",
        board: "",
        aggregate: "",
        school_name: "",
        subjects: "",
      },
    },
    course_info: {
      course_name: "",
      duration: "",
      stream: "",
      admission_year: { year },
    },
    image: null,
  }), [year]);
  const [formData, setFormData] = useState(initialFormData);

  const concatenateNames = (first, middle, last) => {
    const nameParts = [first, middle, last];
    return nameParts.filter(Boolean).join(' ');
  }

  const formatSubjects = (marks) => {
    return Object.entries(marks)
      .map(([subject, mark]) => `${subject.trim()} - ${mark.trim()}`)
      .join(', ');
  }

  const mergeObjects = (defaultObj, savedObj) => {
    if (!savedObj) return defaultObj;
    return { ...defaultObj, ...savedObj };
  }

  // Load saved form data from local storage on component mount
  useEffect(() => {
    const savedFormData = JSON.parse(localStorage.getItem("applicant_profile"));
    const savedCurrentStep = JSON.parse(localStorage.getItem("currentStep"));
    
    if (savedFormData) {
      
      const fullName = savedFormData.personal_info ? concatenateNames(savedFormData.personal_info.first_name, savedFormData.personal_info.middle_name, savedFormData.personal_info.last_name) : '';
      const fatherFullName = savedFormData.family_info && savedFormData.family_info.father ? concatenateNames(savedFormData.family_info.father.first_name, savedFormData.family_info.father.middle_name, savedFormData.family_info.father.last_name) : '';
      const motherFullName = savedFormData.family_info && savedFormData.family_info.mother ? concatenateNames(savedFormData.family_info.mother.first_name, savedFormData.family_info.mother.middle_name, savedFormData.family_info.mother.last_name) : '';
      const guardianFullName = savedFormData.family_info && savedFormData.family_info.guardian ? concatenateNames(savedFormData.family_info.guardian.first_name, savedFormData.family_info.guardian.middle_name, savedFormData.family_info.guardian.last_name) : '';
      
      const dob = savedFormData.personal_info && savedFormData.personal_info.dob ? new Date(savedFormData.personal_info.dob) : null;
      const dobString = dob ? dob.toISOString().split('T')[0] : '';
      
      const secondarySubjects = savedFormData.academic_info && savedFormData.academic_info.secondary && savedFormData.academic_info.secondary.marks ? formatSubjects(savedFormData.academic_info.secondary.marks) : '';
      
      const higherSecondarySubjects = savedFormData.academic_info && savedFormData.academic_info.higher_secondary && savedFormData.academic_info.higher_secondary.marks ? formatSubjects(savedFormData.academic_info.higher_secondary.marks) : '';
  
      const mergedFormData = {
        ...mergeObjects(initialFormData, savedFormData),
        personal_info: {
          ...mergeObjects(initialFormData.personal_info, savedFormData.personal_info),
          name: fullName,
          dob: dobString,
          present_address: mergeObjects(initialFormData.personal_info.present_address, savedFormData.personal_info.present_address),
          permanent_address: mergeObjects(initialFormData.personal_info.permanent_address, savedFormData.personal_info.permanent_address)
        },
        family_info: {
          ...mergeObjects(initialFormData.family_info, savedFormData.family_info),
          father: savedFormData.family_info && savedFormData.family_info.father ? {
            ...mergeObjects(initialFormData.family_info.father, savedFormData.family_info.father),
            name: fatherFullName
          } : {},
          mother: savedFormData.family_info && savedFormData.family_info.mother ? {
            ...mergeObjects(initialFormData.family_info.mother, savedFormData.family_info.mother),
            name: motherFullName
          } : {},
          guardian: savedFormData.family_info && savedFormData.family_info.guardian ? {
            ...mergeObjects(initialFormData.family_info.guardian, savedFormData.family_info.guardian),
            name: guardianFullName
          } : {}
        },
        academic_info: {
          ...mergeObjects(initialFormData.academic_info, savedFormData.academic_info),
          secondary: savedFormData.academic_info && savedFormData.academic_info.secondary ? {
            ...mergeObjects(initialFormData.academic_info.secondary, savedFormData.academic_info.secondary),
            subjects: secondarySubjects
          } : {},
          higher_secondary: savedFormData.academic_info && savedFormData.academic_info.higher_secondary ? {
            ...mergeObjects(initialFormData.academic_info.higher_secondary, savedFormData.academic_info.higher_secondary),
            subjects: higherSecondarySubjects
          } : {}
        }
      };
  
      setFormData(mergedFormData);
    }
    // ! important shit
    if (savedCurrentStep) {
      setCurrentStep(savedCurrentStep);
    }
  }, [initialFormData]);

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

  //testing

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
    console.log(formData);
    // event.preventDefault();
    if (presentPincodeError || permanentPincodeError || officePincodeError) {
      alert("Please enter a valid pincode.");
      return;
    }
    if (currentStep !== totalSteps){
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      localStorage.setItem("currentStep", JSON.stringify(nextStep));
    }
    else{
      console.log("Form Submitted")
    }

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

  // const pageTitles = formSteps.map(step => {
  //   const stepName = step.name;
  //   return stepName.replace(/([A-Z])/g, ' $1').trim();
  // });

  const pageTitles = [
    "Personal Information",
    "Family Information",
    "Academic Information",
    "Course Information",
    "File Upload",
  ];

  const renderStep = formSteps.map((StepComponent, index) => (
    <StepComponent
      key={index + 1}
      formData={formData}
      handleChange={handleChange}
      setFormData={setFormData}
      clearFormData={clearFormData}
      handlePreviousClick={handlePreviousClick}
      handleNextClick={handleNextClick}
      handleSubmit={handleSubmit}
      currentStep={currentStep}
      totalSteps={totalSteps}
      presentPincodeError={presentPincodeError}
      setPresentPincodeError={setPresentPincodeError}
      permanentPincodeError={permanentPincodeError}
      setPermanentPincodeError={setPermanentPincodeError}
      officePincodeError={officePincodeError}
      setOfficePincodeError={setOfficePincodeError}
    />
  ));

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

          {/* displaying the pages from the array according to the page number */}
          {renderStep[currentStep - 1]}
        </div>
      </div>
    </div>
  );
};

export default ApplicantForm;
