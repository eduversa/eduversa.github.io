import React, { useEffect, Fragment } from "react";
import { updateAppplicantData } from "@/functions";
import {
  Text,
  Email,
  Number,
  Select,
  DateInput,
  FormButtons,
} from "../inputComponent/InputComponent";

const AcademicInfo = ({
  formData,
  setFormData,
  clearFormData,
  handleChange,
  handlePreviousClick,
  handleNextClick,
  handleSubmit,
  currentStep,
  totalSteps
}) => {

  let year = new Date().getFullYear().toString();

  //fetches data from local storfage
  useEffect(() => {
    const savedFamilyInfo = JSON.parse(localStorage.getItem('academic_info'));
    if (savedFamilyInfo) {
      setFormData(prevFormData => ({
        ...prevFormData,
        academic_info: savedFamilyInfo
      }));
    }
  }, [setFormData]);

  // set data to local storfage and sends data to database
  async function onSubmitHandler() {
    localStorage.setItem(
      "academic_info",
      JSON.stringify(formData.academic_info)
    );
    const data = formData.academic_info;
    const type = "academic";
    const user_id = localStorage.getItem("userid");
    try {
      const response = await updateAppplicantData(user_id, type, data);
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <Fragment>
      <form className="page--content" onSubmit={(event) => {
        event.preventDefault();
        onSubmitHandler();
        handleNextClick();
      }}>
        <h3 className="sub-heading">Admission Details</h3> {/* Admission */}
        <div className="grid-col-2">
          {" "}
          {/*exam_name year_of_exam */}
          <Text
            label="Exam Name"
            name="academic_info.admission.exam_name"
            value={formData.academic_info.admission.exam_name}
            onChange={handleChange}
            required
          />
          <Number
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
          {" "}
          {/*roll rank */}
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
        <h3 className="sub-heading">Secondary Education</h3> {/* Secondary */}
        {/* school_name */}
        <Text
          label="School Name"
          name="academic_info.secondary.school_name"
          value={formData.academic_info.secondary.school_name}
          onChange={handleChange}
          required
        />
        <div className="grid-col-2">
          {" "}
          {/* exam_name year_of_exam*/}
          <Text
            label="Exam Name"
            name="academic_info.secondary.exam_name"
            value={formData.academic_info.secondary.exam_name}
            onChange={handleChange}
            required
          />
          <Number
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
          {" "}
          {/* board aggregate */}
          <Text
            label="Board"
            name="academic_info.secondary.board"
            value={formData.academic_info.secondary.board}
            onChange={handleChange}
            required
          />
          <Number
            label="Aggregate"
            name="academic_info.secondary.aggregate"
            value={formData.academic_info.secondary.aggregate}
            onChange={handleChange}
            required
          />
        </div>
        <hr />
        <h3 className="sub-heading">Higher Secondary Education</h3>{" "}
        {/* Higher Secondary */}
        {/* school_name */}
        <Text
          label="School Name"
          name="academic_info.higher_secondary.school_name"
          value={formData.academic_info.higher_secondary.school_name}
          onChange={handleChange}
          required
        />
        <div className="grid-col-2">
          {" "}
          {/* exam_name year_of_exam */}
          <Text
            label="Exam Name"
            name="academic_info.higher_secondary.exam_name"
            value={formData.academic_info.higher_secondary.exam_name}
            onChange={handleChange}
            required
          />
          <Number
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
          {" "}
          {/* board aggregate */}
          <Text
            label="Board"
            name="academic_info.higher_secondary.board"
            value={formData.academic_info.higher_secondary.board}
            onChange={handleChange}
            required
          />
          <Number
            label="Aggregate"
            name="academic_info.higher_secondary.aggregate"
            value={formData.academic_info.higher_secondary.aggregate}
            onChange={handleChange}
            required
          />
        </div>
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
