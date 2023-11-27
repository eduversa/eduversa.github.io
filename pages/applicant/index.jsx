import React, { Fragment, useEffect, useState } from "react";
import { ApplicantLayout } from "@/layout";
import { getSingleApplicantApi } from "@/functions";

function renderFields(data) {
  return Object.entries(data).map(([key, value]) => {
    if (typeof value === "object" && value !== null) {
      return (
        <Fragment key={key}>
          <div className="field-group">
            <h3>{key}</h3>
            {renderFields(value)}
          </div>
        </Fragment>
      );
    } else {
      return (
        <div key={key} className="field">
          <label>{key}:</label>
          <span>{JSON.stringify(value)}</span>
        </div>
      );
    }
  });
}

function ApplicantDashboard() {
  const [profileData, setProfileData] = useState({});

  useEffect(() => {
    const userType = localStorage.getItem("userType");

    if (userType === "applicant") {
      const applicantId = localStorage.getItem("userid");

      const fetchData = async () => {
        try {
          const response = await getSingleApplicantApi(applicantId);

          if (response.status === false) {
            alert(response.message);
            return;
          }

          setProfileData(response.data);
        } catch (error) {
          console.error("Error fetching applicant data:", error.message);
        }
      };

      fetchData();
    }
  }, []);

  return (
    <Fragment>
      <ApplicantLayout>
        <div className="profile-fields">{renderFields(profileData)}</div>
      </ApplicantLayout>
    </Fragment>
  );
}

export default ApplicantDashboard;
