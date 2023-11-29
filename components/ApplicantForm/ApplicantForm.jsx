import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  PersonalInfo,
  FamilyInfo,
  AcademicInfo,
  CourseInfo,
  FileUpload,
} from "./formPages";
import { getSingleApplicantApi } from "@/functions";

const ApplicantForm = ({userid}) => {
  let year = new Date().getFullYear().toString();

  const initialFormData = useMemo(
    () => ({
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
    }),
    [year]
  );
  const [formData, setFormData] = useState(initialFormData);

  // all for getting data from applicant_profile
  const concatenateNames = (first, middle, last) => {
    const nameParts = [first, middle, last];
    return nameParts.filter(Boolean).join(" ");
  };

  const formatSubjects = (marks) => {
    return Object.entries(marks)
      .map(
        ([subject, mark]) => `${subject.trim()} - ${mark.toString().trim()}`
      )
      .join(", ");
  };

  const deepMergeObject = useCallback((obj1, obj2) => {
    let output = { ...obj1 };
    if (isObject(obj1) && isObject(obj2)) {
      Object.keys(obj1).forEach((key) => {
        if (isObject(obj1[key])) {
          if (!(key in obj2)) {
            output[key] = obj1[key];
          } else {
            output[key] = deepMergeObject(obj1[key], obj2[key]);
          }
        } else {
          output[key] =
            key in obj2 && typeof obj2[key] !== "undefined"
              ? obj2[key]
              : obj1[key];
        }
      });
      Object.keys(obj2).forEach((key) => {
        if (!(key in obj1)) {
          output[key] = obj2[key];
        }
      });
    }
    return output;
  }, []);

  const isObject = (item) => {
    return item && typeof item === "object" && !Array.isArray(item);
  };

  const loadSavedFormData = useCallback(() => {
    const savedFormData = JSON.parse(localStorage.getItem("applicant_profile"));
    if (savedFormData) {
      if (!savedFormData.family_info) {
        savedFormData.family_info = initialFormData.family_info;
      } else if (!savedFormData.family_info.guardian) {
        savedFormData.family_info.guardian = initialFormData.family_info.guardian;
      } else if (!savedFormData.family_info.guardian.office_address) {
        savedFormData.family_info.guardian.office_address =
          initialFormData.family_info.guardian.office_address;
      }
      return savedFormData;
    }
    return null;
  }, [initialFormData]);

  const processFormData = useCallback((savedFormData) => {
    const fullName = savedFormData.personal_info
      ? savedFormData.personal_info.name?
      savedFormData.personal_info.name :
      concatenateNames(
          savedFormData.personal_info.first_name,
          savedFormData.personal_info.middle_name,
          savedFormData.personal_info.last_name
        )
      : "";
    const fatherFullName =
      savedFormData.family_info && savedFormData.family_info.father
        ? savedFormData.family_info.father.name?
        savedFormData.family_info.father.name:
        concatenateNames(
            savedFormData.family_info.father.first_name,
            savedFormData.family_info.father.middle_name,
            savedFormData.family_info.father.last_name
          )
        : "";
    const motherFullName =
      savedFormData.family_info && savedFormData.family_info.mother
        ? savedFormData.family_info.mother.name?
        savedFormData.family_info.mother.name:
        concatenateNames(
            savedFormData.family_info.mother.first_name,
            savedFormData.family_info.mother.middle_name,
            savedFormData.family_info.mother.last_name
          )
        : "";
    const guardianFullName =
      savedFormData.family_info && savedFormData.family_info.guardian
        ? savedFormData.family_info.guardian.name?
        savedFormData.family_info.guardian.name:
        concatenateNames(
            savedFormData.family_info.guardian.first_name,
            savedFormData.family_info.guardian.middle_name,
            savedFormData.family_info.guardian.last_name
          )
        : "";

    const dob =
      savedFormData.personal_info && savedFormData.personal_info.dob
        ? new Date(savedFormData.personal_info.dob)
        : null;
    const dobString = dob ? dob.toISOString().split("T")[0] : "";

    const secondarySubjects =
      savedFormData.academic_info &&
      savedFormData.academic_info.secondary &&
      savedFormData.academic_info.secondary.marks
        ? formatSubjects(savedFormData.academic_info.secondary.marks)
        : "";

    const higherSecondarySubjects =
      savedFormData.academic_info &&
      savedFormData.academic_info.higher_secondary &&
      savedFormData.academic_info.higher_secondary.marks
        ? formatSubjects(savedFormData.academic_info.higher_secondary.marks)
        : "";

    return {
      ...savedFormData,
      personal_info: {
        ...savedFormData.personal_info,
        name: fullName,
        dob: dobString,
      },
      family_info: {
        ...savedFormData.family_info,
        father:
          savedFormData.family_info && savedFormData.family_info.father
            ? {
                ...savedFormData.family_info.father,
                name: fatherFullName,
              }
            : {},
        mother:
          savedFormData.family_info && savedFormData.family_info.mother
            ? {
                ...savedFormData.family_info.mother,
                name: motherFullName,
              }
            : {},
        guardian:
          savedFormData.family_info && savedFormData.family_info.guardian
            ? {
                ...savedFormData.family_info.guardian,
                name: guardianFullName,
              }
            : {},
      },
      academic_info: {
        ...savedFormData.academic_info,
        secondary:
          savedFormData.academic_info && savedFormData.academic_info.secondary
            ? {
                ...savedFormData.academic_info.secondary,
                subjects: secondarySubjects,
              }
            : {},
        higher_secondary:
          savedFormData.academic_info &&
          savedFormData.academic_info.higher_secondary
            ? {
                ...savedFormData.academic_info.higher_secondary,
                subjects: higherSecondarySubjects,
              }
            : {},
      },
    };
  }, []);

  useEffect(() => {
    const userType = localStorage.getItem("userType");
    if (userType === "admin") {
      // const applicantId = localStorage.getItem("userid");
      const fetchData = async () => {
        try {
          const response = await getSingleApplicantApi(userid);
          if (response.status === false) {
            alert(response.message);
            return;
          }
          localStorage.setItem(
            "applicant_profile",
            JSON.stringify(response.data)
          );
        } catch (error) {
          if (process.env.NODE_ENV === "development") {
            console.error("Error fetching applicant data:", error.message);
          }
        }
      };
  
      fetchData();
    }
  }, [userid]);

  useEffect(() => {
    const savedFormData = loadSavedFormData();
    if (savedFormData) {
      const processedFormData = processFormData(savedFormData);
      const mergedFormData = deepMergeObject(initialFormData, processedFormData);
      setFormData(mergedFormData);
    }
  
    const savedCurrentStep = JSON.parse(localStorage.getItem("currentStep"));
    if (savedCurrentStep) {
      setCurrentStep(savedCurrentStep);
    }
  }, [initialFormData, deepMergeObject, loadSavedFormData, processFormData]);

  //other functions
  const [currentStep, setCurrentStep] = useState(1);

  const handleChange = (event, callback) => {
    const { name, value } = event.target;

    if (name === "formData") {
      setFormData((prevFormData) => ({ ...prevFormData, ...value }), callback);
      return;
    }

    setFormData((prevFormData) => {
      const nameArray = name.split(".");
      let updatedData = { ...prevFormData };
      let currentLevel = updatedData;

      for (let i = 0; i < nameArray.length; i++) {
        if (i === nameArray.length - 1) {
          currentLevel[nameArray[i]] = value;
        } else {
          currentLevel = currentLevel[nameArray[i]];
        }
      }

      return updatedData;
    }, callback);
  };

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

  const handleNextClick = (event) => {
    if (process.env.NODE_ENV === "development") {
      console.log(formData);
    }

    if (presentPincodeError || permanentPincodeError || officePincodeError) {
      alert("Please enter a valid pincode.");
      return;
    }
    if (currentStep !== totalSteps) {
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      localStorage.setItem("currentStep", JSON.stringify(nextStep));
    } else {
      if (process.env.NODE_ENV === "development") {
        console.log("Form Submitted");
      }
    }
  };

  // function to move to the previous page
  const handlePreviousClick = (event) => {
    event.preventDefault();
    const previousStep = currentStep - 1;
    setCurrentStep(previousStep);
    localStorage.setItem("currentStep", JSON.stringify(previousStep));
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
      currentStep={currentStep}
      totalSteps={totalSteps}
      userid={userid}
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
      // style={{ background: `hsl(${(currentStep - 1) * 62.5}, 40% , 85%)` }}
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
