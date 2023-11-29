import React, { useState, useEffect, Fragment } from "react";
import { AllLoader } from "@/components";
import {
  Text,
  Email,
  Number,
  Select,
  DateInput,
  FormButtons,
  Year,
} from "../inputComponent/InputComponent";
import { getCollegeDetailsApi, updateAppplicantData } from "@/functions";

const CourseInfo = ({
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
  const currentYear = new Date().getFullYear().toString();
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [streams, setStreams] = useState([]);
  const [showStream, setShowStream] = useState(false);
  const [loading, setLoading] = useState(false);
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
      if (process.env.NODE_ENV === "development") {
        const collegeData = await getCollegeDetailsApi(304);
        console.log(collegeData);
      }
      setCourses(collegeData.data.college_courses);
    } catch (error) {
      if (process.env.NODE_ENV === "development") {
        console.log(error);
      }
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

  useEffect(() => {
    // const savedCourseInfo = JSON.parse(localStorage.getItem("course_info"));
    // if (savedCourseInfo){
    //   setFormData((prevFormData) => ({
    //     ...prevFormData,
    //     course_info: savedCourseInfo,
    //   }));
    // }
    setFormData((prevFormData) => ({
      ...prevFormData,
      course_info: {
        ...prevFormData.course_info,
        admission_year: currentYear,
      },
    }));
  }, [setFormData, currentYear]);

  async function onSubmitHandler() {
    setLoading(true);
    localStorage.setItem(
      "applicant_profile",
      JSON.stringify(formData)
    );
    const data = JSON.stringify(formData.course_info);
    const type = "course";
    // const userid = localStorage.getItem("userid");
    try {
      const response = await updateAppplicantData(userid, type, data);
      if (process.env.NODE_ENV === "development") {
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
            readOnly
            required
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
                ...(Array.isArray(streams) && streams.length > 0
                  ? streams.map((stream) => ({
                      key: stream.name,
                      value: stream.name,
                    }))
                  : [{ key: "NA", value: "NA" }]),
              ]}
            />
          )}

          <Year
            label="Admission Year"
            name="course_info.admission_year"
            onChange={handleChange}
            value={currentYear}
            readOnly
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

export default CourseInfo;
