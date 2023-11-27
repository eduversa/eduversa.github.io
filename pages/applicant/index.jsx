import React, { Fragment, useEffect, useState } from "react";
import { ApplicantLayout } from "@/layout";
import { getSingleApplicantApi } from "@/functions";

function renderFields(data) {
  return Object.entries(data).map(([key, value]) => {
    if (typeof value === "object" && value !== null) {
      if (Array.isArray(value)) {
        // Use ul for arrays
        return (
          <Fragment key={key}>
            <p>{key}:</p>
            <ul>
              {value.map((item, index) => (
                <li key={index}>{renderFields(item)}</li>
              ))}
            </ul>
          </Fragment>
        );
      } else {
        // Use div for other objects
        return (
          <Fragment key={key}>
            <div className="field-group">
              <h3>{key}</h3>
              {renderFields(value)}
            </div>
          </Fragment>
        );
      }
    } else {
      if (key.toLowerCase().includes("email")) {
        // Use mailto link for email fields
        return (
          <a key={key} href={`mailto:${value}`}>
            {key}: {value}
          </a>
        );
      } else {
        // Use p for other non-object values
        return (
          <p key={key}>
            <strong>{key}:</strong> {JSON.stringify(value)}
          </p>
        );
      }
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
