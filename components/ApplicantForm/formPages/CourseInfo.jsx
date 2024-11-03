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
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCollegeDetails = async () => {
      setLoading(true);
      try {
        const collegeData = await getCollegeDetailsApi(304);
        setCourses(collegeData.data.college_courses);

        if (formData.course_info.course_name) {
          const savedCourse = collegeData.data.college_courses.find(
            course => course.name === formData.course_info.course_name
          );
          if (savedCourse) {
            setSelectedCourse(formData.course_info.course_name);
            setStreams(savedCourse.streams || []);
          }
        }
      } catch (error) {
        console.error("Error fetching college details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCollegeDetails();
  }, [formData.course_info.course_name]);

  useEffect(() => {
    if (!formData.course_info.admission_year) {
      setFormData(prevFormData => ({
        ...prevFormData,
        course_info: {
          ...prevFormData.course_info,
          admission_year: currentYear,
        },
      }));
    }
  }, [currentYear, formData.course_info.admission_year, setFormData]);

  const handleCourseChange = (event) => {
    const selectedCourseName = event.target.value;
    const selectedCourseData = courses.find(
      (course) => course.name === selectedCourseName
    );

    setSelectedCourse(selectedCourseName);
    setStreams(selectedCourseData?.streams || []);

    setFormData((prevFormData) => ({
      ...prevFormData,
      course_info: {
        ...prevFormData.course_info,
        course_name: selectedCourseName,
        duration: selectedCourseData?.duration || "",
        stream: "", 
      },
    }));
  };

  const onSubmitHandler = async () => {
    const initialFormData = localStorage.getItem('applicant_profile');
    if (initialFormData === JSON.stringify(formData)) {
      return true;
    }

    setLoading(true);
    try {
      const response = await updateAppplicantData(
        userid,
        "course",
        JSON.stringify(formData.course_info)
      );

      if (!response.status) {
        alert(response.message);
        return false;
      }

      localStorage.setItem("applicant_profile", JSON.stringify(formData));
      alert(response.message);
      return true;
    } catch (error) {
      console.error("Error updating course info:", error);
      return false;
    } finally {
      setLoading(false);
    }
  };

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
        <div className="grid-col-2">
          <Select
            label="Course Name"
            name="course_info.course_name"
            value={formData.course_info.course_name}
            onChange={handleCourseChange}
            required
            options={[
              { key: "Select your course", value: "" },
              ...courses.map((course) => ({
                key: course.name,
                value: course.name,
              })),
            ]}
          />
          <Number
            label="Duration"
            name="course_info.duration"
            value={formData.course_info.duration}
            onChange={handleChange}
            readOnly
            required
          />
        </div>
        <div className="grid-col-2">
          {selectedCourse && (
            <Select
              label="Stream"
              name="course_info.stream"
              value={formData.course_info.stream}
              onChange={handleChange}
              required
              options={[
                { key: "Select your stream", value: "" },
                ...(streams.length > 0
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
            value={formData.course_info.admission_year ? formData.course_info.admission_year : currentYear}
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
