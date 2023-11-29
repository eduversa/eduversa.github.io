import React, { useEffect, Fragment, useState } from "react";
import { AllLoader } from "@/components";
import { updateAppplicantData } from "@/functions";
import {
  Text,
  Email,
  Number,
  Select,
  DateInput,
  FormButtons,
  TextArea,
  Year,
} from "../inputComponent/InputComponent";
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
}) => {
  let year = new Date().getFullYear().toString();
  const [loading, setLoading] = useState(false);

  async function onSubmitHandler() {
    setLoading(true);
    localStorage.setItem(
      "applicant_profile",
      JSON.stringify(formData)
    );
    const data = JSON.stringify(formData.academic_info);
    const type = "academic";
    // const userid = localStorage.getItem("userid");
    try {
      const response = await updateAppplicantData(userid, type, data);
      if (process.env.NODE_ENV === "development") {
        const response = await updateAppplicantData(userid, type, data);
        console.log(response);
      }
      alert(response.message);
      setLoading(false);
    } catch (error) {
      if (process.env.NODE_ENV === "development") {
        console.log(error);
      }
    }
  }
  return (
    <Fragment>
      {loading && <AllLoader />}
      <form
        className="page--content"
        onSubmit={async (event) => {
          event.preventDefault();
          await onSubmitHandler();
          handleNextClick();
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
        <Text
          style={{
            marginBottom: "2.25rem",
          }}
          label="Subject Marks"
          details="(write as subject- marks, subject- marks...)"
          name="academic_info.secondary.subjects"
          value={formData.academic_info.secondary.subjects}
          onChange={handleChange}
          required
        ></Text>
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
          <Number
            label="Aggregate"
            name="academic_info.higher_secondary.aggregate"
            value={formData.academic_info.higher_secondary.aggregate}
            onChange={handleChange}
            required
          />
        </div>
        <Text
          style={{
            marginBottom: "1rem",
          }}
          label="Subject Marks"
          details="(write as subject- marks, subject- marks...)"
          name="academic_info.higher_secondary.subjects"
          value={formData.academic_info.higher_secondary.subjects}
          onChange={handleChange}
          required
        ></Text>
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
