import React, { useState, useEffect, Fragment } from "react";
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

  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [streams, setStreams] = useState([]);

  useEffect(() => {
    getCollegeDetails();
  }, []);

  useEffect(() => {
    if (Array.isArray(courses)) {
      const course = courses.find(course => course.name === selectedCourse);
      if (course) {
        setStreams(course.streams);
      }
    }
  }, [selectedCourse, courses]);

  async function getCollegeDetails() {
    try {
      const collegeData = await getCollegeDetailsApi(304);
      console.log(collegeData);
      setCourses(collegeData.data.college_courses); // set the state
    } catch (error) {
      console.log(error);
    }
  }

  const handleCourseChange = (event) => {
    handleChange(event);
    setSelectedCourse(event.target.value);
  };

  return (
    <Fragment>
      {/* enrollment no */}
      <div className="grid-col-2">
        {" "}
        {/* course duration */}
        <Select
          label="Course Name"
          name="course_info.course_name"
          value={formData.course_info.course_name}
          onChange={handleCourseChange}
          required
          options={[
            { key: "Select your course", value: "" },
            ...(Array.isArray(courses) ? courses.map(course => ({ key: course.name, value: course.name })) : [])
          ]}
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
          // options={Array.isArray(streams) ? streams.map(stream => ({ key: stream.name, value: stream.name })) : []}
          options= {[
            { key: "Select your stream", value: "" },
            ...(Array.isArray(streams) ? streams.map(stream => ({ key: stream.name, value: stream.name })) : [])
          ]}
        />
        {/* <button onClick={getCollegeDetails}>College Details</button> */}
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
