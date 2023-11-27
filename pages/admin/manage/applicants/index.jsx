import { AdminLayout } from "@/layout";
import React, { Fragment, useEffect, useState } from "react";
import { getCollegeDetailsApi, getApplicantsByYear } from "@/functions";
import { CollegeDropdowns } from "@/components";
import ManageApp from "./ManageApp";

const ManageApplicants = () => {
  const [maincollegeData, setmaincollegeData] = useState(null);
  const [applicantData, setapplicantData] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedStream, setSelectedStream] = useState("");

  useEffect(() => {
    fetchCollegeData();
    getApplicantData();
  }, []);

  const fetchCollegeData = async () => {
    try {
      const response = await getCollegeDetailsApi(304);
      if (process.env.NODE_ENV === "development") {
        console.log(response);
      }
      setmaincollegeData(response);
    } catch (error) {
      console.error("Error fetching college data:", error);
    }
  };

  const getApplicantData = async () => {
    try {
      const response = await getApplicantsByYear(2023);
      if (process.env.NODE_ENV === "development") {
        console.log(response);
      }
      setapplicantData(response.data);
    } catch (error) {
      console.error("Error fetching applicant data:", error);
    }
  };

  const filterData = () => {
    let filteredResult = applicantData.filter(
      (item, i) => Object.keys(item).length > 8
    );

    if (selectedCourse) {
      filteredResult = filteredResult.filter(
        (item) => item.course_info.course_name === selectedCourse
      );
    }

    if (selectedStream) {
      filteredResult = filteredResult.filter(
        (item) => item.course_info.stream === selectedStream
      );
    }
    console.log(filteredResult);
    return filteredResult;
  };

  const handleCourseChange = (newCourse) => {
    setSelectedCourse(newCourse);
  };

  const handleStreamChange = (newStream) => {
    setSelectedStream(newStream);
  };

  if (!maincollegeData || !applicantData) return <p>Loading...</p>;
  return (
    <Fragment>
      <AdminLayout>
        <div className="admin-manage-applicants">
          <div className="manage-applicant-container">
            <h1>Manage Applicant</h1>
            <CollegeDropdowns
              selectedCourse={selectedCourse}
              selectedStream={selectedStream}
              onCourseChange={handleCourseChange}
              onStreamChange={handleStreamChange}
              maincollegeData={maincollegeData}
            />
            <ManageApp data={filterData()}></ManageApp>
          </div>
        </div>
      </AdminLayout>
    </Fragment>
  );
};

export default ManageApplicants;
