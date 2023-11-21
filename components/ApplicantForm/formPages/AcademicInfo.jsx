import React, { Fragment } from "react";
import {
  Text,
  Email,
  Number,
  Select,
  DateInput,
} from "../inputComponent/InputComponent";

const AcademicInfo = ({ formData, handleChange }) => {
  let year = new Date().getFullYear().toString();

  return (
    <Fragment>
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
    </Fragment>
  );
};

export default AcademicInfo;
