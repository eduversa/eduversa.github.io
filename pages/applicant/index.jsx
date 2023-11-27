import React, { Fragment, useEffect, useState } from "react";
import { ApplicantLayout } from "@/layout";
import { getSingleApplicantApi } from "@/functions";
import Image from "next/image";

function generateClassName(prefix, key) {
  return `${prefix}-${key.toLowerCase().replace(/[^a-z0-9]/g, "-")}`;
}

function formatDate(dateString) {
  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    timeZoneName: "short",
  };
  return new Date(dateString).toLocaleString(undefined, options);
}

function renderImage(imageUrl) {
  return (
    <div className="profile-image-container">
      <Image
        src={imageUrl}
        alt="Applicant Profile"
        className="profile-image"
        width={300}
        height={200}
      />
    </div>
  );
}

function renderFields(data, parentKey = "") {
  let imageRendered = false;

  return Object.entries(data)
    .filter(([key]) => key !== "__v" && key !== "_id")
    .map(([key, value]) => {
      const currentKey = parentKey ? `${parentKey}-${key}` : key;
      const className = generateClassName("field", currentKey);

      if (!imageRendered && key.toLowerCase() === "image" && value) {
        // Render image at the top
        imageRendered = true;
        return <Fragment key={currentKey}>{renderImage(value)}</Fragment>;
      }

      if (
        key.toLowerCase() === "createdat" ||
        key.toLowerCase() === "updatedat"
      ) {
        // Format createdAt and updatedAt dates
        return (
          <p key={currentKey} className={className}>
            <strong className={generateClassName("label", currentKey)}>
              {key}:
            </strong>{" "}
            {formatDate(value)}
          </p>
        );
      }

      if (
        typeof value === "object" &&
        value !== null &&
        key.toLowerCase() !== "image"
      ) {
        if (Array.isArray(value)) {
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
          if (
            key.toLowerCase() === "marks" &&
            typeof value === "object" &&
            value !== null
          ) {
            return (
              <Fragment key={currentKey}>
                <p className={className}>{key}:</p>
                <ul className={className}>
                  {Object.entries(value).map(([subject, marks], index) => (
                    <li key={index} className={className}>
                      <strong>{subject}:</strong> {marks}
                    </li>
                  ))}
                </ul>
              </Fragment>
            );
          } else {
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
        }
      } else {
        if (key.toLowerCase().includes("email")) {
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
        } else if (key.toLowerCase() === "dob") {
          return (
            <p key={currentKey} className={className}>
              <strong className={generateClassName("label", currentKey)}>
                {key}:
              </strong>{" "}
              {formatDate(value)}
            </p>
          );
        } else {
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
    })
    .filter((element) => element !== null);
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
        <div className="profile-container">
          {profileData.image && renderImage(profileData.image)}
          <div className="profile-fields">{renderFields(profileData)}</div>
        </div>
      </ApplicantLayout>
    </Fragment>
  );
}

export default ApplicantDashboard;
