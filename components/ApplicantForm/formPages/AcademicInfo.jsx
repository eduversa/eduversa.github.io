import React, { useEffect, Fragment, useState } from "react";
import { AllLoader } from "@/components";
import {
  Text,
  Email,
  Number,
  Select,
  DateInput,
  FormButtons,
  TextArea,
  Year,
  SubjectMarks,
  TextNoNumber,
} from "../inputComponent/InputComponent";
import { withLoading, apiRequest } from "@/utils/apiUtils";
import { useAlert } from "@/contexts/AlertContext";

const AcademicInfo = ({
  formData,
  setFormData,
  clearFormData,
  handleChange,
  handlePreviousClick,
  handleNextClick,
  currentStep,
  totalSteps,
  userid,
  selected_user_type,
}) => {
  let year = new Date().getFullYear().toString();
  const [loading, setLoading] = useState(false);
  const {showAlert} = useAlert();

  async function onSubmitHandler() {
    const type = "academic";
    const authToken = localStorage.getItem("authToken");
    let initialFormData;
    let apiUrl;
    let routeName;

    if (selected_user_type === "applicant") {
      initialFormData = localStorage.getItem('applicant_profile');
      apiUrl = `/applicant/?user_id=${userid}&type=${type}`
      routeName = "UpdateApplicantData"
    } else if (selected_user_type === "student") {
      initialFormData = localStorage.getItem('student_profile');
      apiUrl = `/student/?user_id=${userid}&type=${type}`
      routeName = "UpdateStudentData"
    } 
  
    if (initialFormData === JSON.stringify(formData)) {
      return true;
    }
  
    const data = JSON.stringify(formData.academic_info);

    const secondaryMarksObject = formData.academic_info?.secondary?.marks;
    if (Object.keys(secondaryMarksObject || {}).length === 0) {
      showAlert("Please enter subject marks for Secondary Education");
      setLoading(false);
      return false;
    }
  
    const higherSecondaryMarksObject = formData.academic_info?.higher_secondary?.marks;
    if (Object.keys(higherSecondaryMarksObject || {}).length === 0) {
      showAlert("Please enter subject marks for Higher Secondary Education");
      setLoading(false);
      return false;
    }
  
    // setLoading(true);
  
    const wrappedApiRequest = withLoading(
      apiRequest, 
      setLoading, 
      showAlert, 
      routeName
    );
  
    try {
      const response = await wrappedApiRequest(
        apiUrl, 
        "PUT",
        data, 
        authToken, 
        routeName
      );
  
      if (!response.success || !response.status) {
        showAlert(response.message || `Failed to update ${selected_user_type} data`);
        setLoading(false);
        return false;
      }

      if (selected_user_type === "student") {
        localStorage.setItem("student_profile", JSON.stringify(formData));
      } else if (selected_user_type === "applicant") {
        localStorage.setItem("applicant_profile", JSON.stringify(formData));
      }
      showAlert(response.message);
      setLoading(false);
      return true;
  
    } catch (error) {
      console.error(`Error in updating ${selected_user_type} data:`, error);
      showAlert(error.message || `Failed to update ${selected_user_type} data`);
      setLoading(false);
      return false;
    }
  }

  return (
    <Fragment>
      {loading && <AllLoader />}
      <form
        className="page--content"
        onSubmit={async (event) => {
            event.preventDefault();
            const success = await onSubmitHandler();
            if (success) {
              handleNextClick();
            }
        }}
      >
        <h3 className="sub-heading">Admission Details</h3>
        <div className="grid-col-2">
          <Text
            label="Exam Name"
            name="academic_info.admission.exam_name"
            value={formData.academic_info.admission.exam_name}
            onChange={handleChange}
            required
          />
          <Year
            label="Year of Exam"
            name="academic_info.admission.year_of_exam"
            value={formData.academic_info.admission.year_of_exam}
            onChange={handleChange}
            required
            min={year - 10}
            max={year}
          />
        </div>
        <div className="grid-col-2">
          <Text
            label="Roll Number"
            name="academic_info.admission.roll_number"
            value={formData.academic_info.admission.roll_number}
            onChange={handleChange}
            required
          />
          <Number
            label="Rank"
            name="academic_info.admission.rank"
            value={formData.academic_info.admission.rank}
            onChange={handleChange}
            required
          />
        </div>
        <hr />
        <h3 className="sub-heading">Secondary Education</h3>
        <Text
          label="School Name"
          name="academic_info.secondary.school_name"
          value={formData.academic_info.secondary.school_name}
          onChange={handleChange}
          required
        />
        <div className="grid-col-2">
          <Text
            label="Exam Name"
            name="academic_info.secondary.exam_name"
            value={formData.academic_info.secondary.exam_name}
            onChange={handleChange}
            required
          />
          <Year
            label="Year of Exam"
            name="academic_info.secondary.year_of_exam"
            value={formData.academic_info.secondary.year_of_exam}
            onChange={handleChange}
            required
            min={year - 20}
            max={year}
          />
        </div>
        <div className="grid-col-2">
          <TextNoNumber
            label="Board"
            name="academic_info.secondary.board"
            value={formData.academic_info.secondary.board}
            onChange={handleChange}
            required
          />
          {/* <Number
            label="Aggregate"
            name="academic_info.secondary.aggregate"
            value={formData.academic_info.secondary.aggregate}
            onChange={handleChange}
            required
          /> */}
        </div>
        <SubjectMarks
          name="academic_info.secondary.marks"
          marks={formData.academic_info.secondary.marks}
          handleChange={handleChange}
          required
        />
        <hr />
        <h3 className="sub-heading">Higher Secondary Education</h3>{" "}
        <Text
          label="School Name"
          name="academic_info.higher_secondary.school_name"
          value={formData.academic_info.higher_secondary.school_name}
          onChange={handleChange}
          required
        />
        <div className="grid-col-2">
          <Text
            label="Exam Name"
            name="academic_info.higher_secondary.exam_name"
            value={formData.academic_info.higher_secondary.exam_name}
            onChange={handleChange}
            required
          />
          <Year
            label="Year of Exam"
            name="academic_info.higher_secondary.year_of_exam"
            value={formData.academic_info.higher_secondary.year_of_exam}
            onChange={handleChange}
            required
            min={year - 15}
            max={year}
          />
        </div>
        <div className="grid-col-2">
          <Text
            label="Board"
            name="academic_info.higher_secondary.board"
            value={formData.academic_info.higher_secondary.board}
            onChange={handleChange}
            required
          />
          {/* <Number
            label="Aggregate"
            name="academic_info.higher_secondary.aggregate"
            value={formData.academic_info.higher_secondary.aggregate}
            onChange={handleChange}
            required
          /> */}
        </div>
        <SubjectMarks
          name="academic_info.higher_secondary.marks"
          marks={formData.academic_info.higher_secondary.marks}
          handleChange={handleChange}
          required
        />
        <FormButtons
          handlePreviousClick={handlePreviousClick}
          clearFormData={() => clearFormData(currentStep)}
          onSubmitHandler={onSubmitHandler}
          currentStep={currentStep}
          totalSteps={totalSteps}
        />
      </form>
    </Fragment>
  );
};

export default AcademicInfo;
