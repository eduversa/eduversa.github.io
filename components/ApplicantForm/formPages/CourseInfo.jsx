import React, { Fragment } from "react";
import {
  Text,
  Email,
  Number,
  Select,
  DateInput,
} from "../inputComponent/InputComponent";
import { getCollegeDetailsApi } from "@/functions";
const CourseInfo = ({ formData, handleChange }) => {
  let year = new Date().getFullYear().toString();

  async function getCollegeDetails() {
    try {
      const collegeData = await getCollegeDetailsApi(304);
      console.log(collegeData);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <Fragment>
      {/* enrollment no */}
      <Text
        label="Enrollment Number"
        name="course_info.enrollment_number"
        value={formData.course_info.enrollment_number}
        onChange={handleChange}
        required
      />
      <div className="grid-col-2">
        {" "}
        {/* course duration */}
        <Text
          label="Course Name"
          name="course_info.course_name"
          value={formData.course_info.course_name}
          onChange={handleChange}
          required
        />
        <Number
          label="Duration"
          name="course_info.duration"
          value={formData.course_info.duration}
          onChange={handleChange}
          required
          min="1"
          max="10"
        />
      </div>
      <div className="grid-col-2">
        {" "}
        {/* stream admission_year */}
        <Select
          label="Stream"
          name="course_info.stream"
          value={formData.course_info.stream}
          onChange={handleChange}
          required
          options={[
            { key: "Select Stream", value: "" },
            { key: "CSE", value: "CSE" },
            { key: "CSE(AIML)", value: "CSE(AIML)" },
            { key: "CSE(IOT)", value: "CSE(IOT)" },
            { key: "CST(", value: "CST" },
            { key: "CSIT", value: "CSIT" },
            { key: "ECE", value: "ECE" },
            { key: "EE", value: "EE" },
            { key: "ME", value: "ME" },
            { key: "Biotech", value: "Biotech" },
          ]}
        />
        <button onClick={getCollegeDetails}>College Details</button>
        <Number
          label="Admission Year"
          name="course_info.admission_year"
          value={formData.course_info.admission_year}
          onChange={handleChange}
          required
          min={year - 10}
          max={year}
        />
      </div>
    </Fragment>
  );
};

export default CourseInfo;
