import React, { useState, useEffect, Fragment } from "react";
import {
  Text,
  Email,
  Number,
  Select,
  DateInput,
  FormButtons,
} from "../inputComponent/InputComponent";
import { getCollegeDetailsApi, updateAppplicantData } from "@/functions";

const CourseInfo = ({
  formData,
  setFormData,
  handleChange,
  handlePreviousClick,
  handleNextClick,
  handleSubmit,
  currentStep,
  totalSteps,
}) => {
  let year = new Date().getFullYear().toString();

  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [streams, setStreams] = useState([]);
  const [showStream, setShowStream] = useState(false);

  useEffect(() => {
    getCollegeDetails();
  }, []);

  useEffect(() => {
    if (Array.isArray(courses)) {
      const course = courses.find((course) => course.name === selectedCourse);
      if (course) {
        setStreams(course.streams);
      }
    }
  }, [selectedCourse, courses]);

  async function getCollegeDetails() {
    try {
      const collegeData = await getCollegeDetailsApi(304);
      console.log(collegeData);
      setCourses(collegeData.data.college_courses);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    const savedCourseInfo = JSON.parse(localStorage.getItem("course_info"));
    if (savedCourseInfo) {
      const { course_name, stream, admission_year } = savedCourseInfo;

      setFormData((prevFormData) => ({
        ...prevFormData,
        course_info: savedCourseInfo,
      }));

      setSelectedCourse(course_name);
      setShowStream(true);

      if (Array.isArray(courses)) {
        const selectedCourse = courses.find(
          (course) => course.name === course_name
        );
        if (selectedCourse) {
          setStreams(selectedCourse.streams);

          setFormData((prevFormData) => ({
            ...prevFormData,
            course_info: {
              ...prevFormData.course_info,
              duration: selectedCourse.duration,
            },
          }));
        }
      }
    }
  }, [setFormData, courses]);

  const handleCourseChange = (event) => {
    handleChange(event);
    const selectedCourseName = event.target.value;
    const selectedCourse = courses.find(
      (course) => course.name === selectedCourseName
    );

    setFormData((prevFormData) => ({
      ...prevFormData,
      course_info: {
        ...prevFormData.course_info,
        course_name: selectedCourseName,
        duration: selectedCourse ? selectedCourse.duration : "",
      },
    }));

    setSelectedCourse(selectedCourseName);
    setShowStream(true);

    if (selectedCourse) {
      setStreams(selectedCourse.streams);
    }
  };

  async function onSubmitHandler() {
    localStorage.setItem("course_info", JSON.stringify(formData.course_info));
    const data = formData.course_info;
    const type = "course";
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
      <form
        className="page--content"
        onSubmit={(event) => {
          event.preventDefault();
          onSubmitHandler();
          handleNextClick();
        }}
      >
        <div className="grid-col-2">
          <Select
            label="Course Name"
            name="course_info.course_name"
            value={formData.course_info.course_name}
            onChange={handleCourseChange}
            required
            options={[
              { key: "Select your course", value: "" },
              ...(Array.isArray(courses)
                ? courses.map((course) => ({
                    key: course.name,
                    value: course.name,
                  }))
                : []),
            ]}
          />
          <Number
            label="Duration"
            name="course_info.duration"
            value={formData.course_info.duration}
            onChange={handleCourseChange}
            required
            min="1"
            max="10"
          />
        </div>
        <div className="grid-col-2">
          {!showStream ? (
            ""
          ) : (
            <Select
              label="Stream"
              name="course_info.stream"
              value={formData.course_info.stream}
              onChange={handleChange}
              required
              options={[
                { key: "Select your stream", value: "" },
                ...(Array.isArray(streams)
                  ? streams.map((stream) => ({
                      key: stream.name,
                      value: stream.name,
                    }))
                  : []),
              ]}
            />
          )}
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

export default CourseInfo;
