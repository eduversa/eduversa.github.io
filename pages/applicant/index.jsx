import React, { Fragment, useEffect, useState } from "react";
import { ApplicantLayout } from "@/layout";
import { getSingleApplicantApi } from "@/functions";

// Helper function to generate a unique class name
function generateClassName(prefix, key) {
  return `${prefix}-${key.toLowerCase().replace(/[^a-z0-9]/g, "-")}`;
}

function renderFields(data, parentKey = "") {
  return Object.entries(data).map(([key, value]) => {
    const currentKey = parentKey ? `${parentKey}-${key}` : key;
    const className = generateClassName("field", currentKey);

    if (typeof value === "object" && value !== null) {
      if (Array.isArray(value)) {
        // Use ul for arrays
        return (
          <Fragment key={currentKey}>
            <p className={className}>{key}:</p>
            <ul className={className}>
              {value.map((item, index) => (
                <li key={index} className={className}>
                  {renderFields(item, currentKey)}
                </li>
              ))}
            </ul>
          </Fragment>
        );
      } else {
        // Use div for other objects
        return (
          <Fragment key={currentKey}>
            <div className={className}>
              <h3 className={generateClassName("heading", currentKey)}>
                {key}
              </h3>
              {renderFields(value, currentKey)}
            </div>
          </Fragment>
        );
      }
    } else {
      if (key.toLowerCase().includes("email")) {
        // Use mailto link for email fields
        return (
          <a
            key={currentKey}
            href={`mailto:${value}`}
            className={className}
            target="_blank"
            rel="noopener noreferrer"
          >
            {key}: {value}
          </a>
        );
      } else {
        // Use p for other non-object values
        return (
          <p key={currentKey} className={className}>
            <strong className={generateClassName("label", currentKey)}>
              {key}:
            </strong>{" "}
            {JSON.stringify(value)}
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
