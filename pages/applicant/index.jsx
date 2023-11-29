import React, { Fragment, useEffect, useState } from "react";
import { ApplicantLayout } from "@/layout";
import { getSingleApplicantApi } from "@/functions";
import { AllLoader } from "@/components";
import Image from "next/image";

function generateClassName(prefix, key) {
  const formattedKey = key
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  return `${prefix}-${formattedKey.toLowerCase().replace(/[^a-z0-9]/g, "-")}`;
}

function formatDate(dateString, includeTimeZone = true) {
  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    timeZoneName: includeTimeZone ? "short" : undefined,
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
    .filter(
      ([key]) => key !== "__v" && key !== "_id" && key !== "are_addresses_same"
    )
    .map(([key, value]) => {
      const currentKey = parentKey ? `${parentKey}-${key}` : key;
      const formattedKey = key
        .split("_")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
      const className = generateClassName("field", currentKey);

      const iconName = formattedKey.replace(/\s+/g, "-").toLowerCase() + ".png";

      if (!imageRendered && key.toLowerCase() === "image" && value) {
        return <Fragment key={currentKey}>{null}</Fragment>;
      }

      if (key.toLowerCase() === "dob") {
        return (
          <p key={currentKey} className={className}>
            {iconName && (
              <Image
                src={`/icons/${iconName}`}
                alt={`${formattedKey} Icon`}
                width={20}
                height={20}
              />
            )}
            <strong className={generateClassName("label", currentKey)}>
              {formattedKey}:
            </strong>
            {formatDate(value, false)}
          </p>
        );
      }

      if (
        key.toLowerCase() === "createdat" ||
        key.toLowerCase() === "updatedat"
      ) {
        return (
          <p key={currentKey} className={className}>
            <strong className={generateClassName("label", currentKey)}>
              {formattedKey}:
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
              <h3 className={generateClassName("heading", currentKey)}>
                {formattedKey}:
              </h3>
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
                <h3 className={className}>{formattedKey}:</h3>
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
                    {formattedKey}
                  </h3>
                  {renderFields(value, currentKey)}
                </div>
              </Fragment>
            );
          }
        }
      } else {
        const displayValue =
          typeof value === "string" ? value.replace(/"/g, "") : value;

        if (key.toLowerCase().includes("email")) {
          return (
            <a
              key={currentKey}
              href={`mailto:${displayValue}`}
              className={className}
              target="_blank"
              rel="noopener noreferrer"
            >
              {iconName && (
                <Image
                  src={`/icons/${iconName}`}
                  alt={`${formattedKey} Icon`}
                  width={20}
                  height={20}
                />
              )}
              <strong className={generateClassName("label", currentKey)}>
                {formattedKey}:
              </strong>
              {displayValue}
            </a>
          );
        } else {
          return (
            <p key={currentKey} className={className}>
              {iconName && (
                <Image
                  src={`/icons/${iconName}`}
                  alt={`${formattedKey} Icon`}
                  width={20}
                  height={20}
                />
              )}
              <strong className={generateClassName("label", currentKey)}>
                {formattedKey}:
              </strong>
              {displayValue}
            </p>
          );
        }
      }
    })
    .filter((element) => element !== null);
}

function ApplicantDashboard() {
  const [profileData, setProfileData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userType = localStorage.getItem("userType");

    if (userType === "applicant") {
      const applicantId = localStorage.getItem("userid");

      const fetchData = async () => {
        try {
          setLoading(true);
          const response = await getSingleApplicantApi(applicantId);

          if (response.status === false) {
            alert(response.message);
            setLoading(false);
            return;
          }
          setProfileData(response.data);
          setLoading(false);
        } catch (error) {
          console.error("Error fetching applicant data:", error.message);
        }
      };

      fetchData();
    }
  }, []);

  return (
    <Fragment>
      {loading && <AllLoader />}
      <ApplicantLayout>
        <div className="applicant-dashboard">
          {profileData.image && renderImage(profileData.image)}
          {profileData?.personal_info?.first_name &&
          profileData?.personal_info?.last_name ? (
            <h1>
              Welcome{" "}
              {profileData?.personal_info.first_name +
                " " +
                profileData?.personal_info.last_name}
            </h1>
          ) : (
            <h1> Welcome User</h1>
          )}
          <div className="profile-fields">{renderFields(profileData)}</div>
        </div>
      </ApplicantLayout>
    </Fragment>
  );
}

export default ApplicantDashboard;
