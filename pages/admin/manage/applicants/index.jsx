import { AdminLayout } from "@/layout";
import React, { Fragment } from "react";
import { useState } from "react";
import { CollegeDropdowns } from "@/components";
const ManageApplicants = () => {
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedStream, setSelectedStream] = useState('');

  const handleCourseChange = (newCourse) => {
    setSelectedCourse(newCourse);
   
  };

  const handleStreamChange = (newStream) => {
    setSelectedStream(newStream);
  }

  return (
    <Fragment>
      <AdminLayout>
        <div className="manage-applicant-container">
    <h1>Manage Applicant</h1>
    <div>
      <CollegeDropdowns
        selectedCourse={selectedCourse}
        selectedStream={selectedStream}
        onCourseChange={handleCourseChange}
        onStreamChange={handleStreamChange}
      />
      {/* <DataComponent
        selectedCourse={selectedCourse}
        selectedStream={selectedStream}
      /> */}
  <p>{selectedCourse}</p>
  <p>{selectedStream}</p>
    </div>
    </div>
      </AdminLayout>
    </Fragment>
  );
};

export default ManageApplicants;
