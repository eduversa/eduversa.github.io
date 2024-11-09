import React, { Fragment, useEffect, useState, useRef } from "react";
import { ApplicantLayout } from "@/layout";
import { AllLoader } from "@/components";
import Image from "next/image";
import { withLoading, devLog, apiRequest } from "@/utils/apiUtils";
import { useAlert } from "@/contexts/AlertContext";
import { useRouter } from "next/router";

function generateClassName(prefix, key) {
  const formattedKey = key
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  return `${prefix}-${formattedKey.toLowerCase().replace(/[^a-z0-9]/g, "-")}`;
}

function formatDate(
  dateString,
  includeTimeZone = true,
  includeHours = true,
  includeMinutes = true,
  includeSeconds = true
) {
  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
    // hour: "2-digit",
    // minute: "2-digit",
    // second: "2-digit",
    hour: includeHours ? "2-digit" : undefined,
    minute: includeMinutes ? "2-digit" : undefined,
    second: includeSeconds ? "2-digit" : undefined,
    timeZoneName: includeTimeZone ? "short" : undefined,
  };
  return new Date(dateString).toLocaleString(undefined, options);
}
function formatDatev2(dateString, includeTimeZone = true) {
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
  let fullNameRendered = false;

  return Object.entries(data)
    .filter(
      ([key]) =>
        key !== "__v" &&
        key !== "_id" &&
        key !== "are_addresses_same" &&
        key !== "subjectString" &&
        key !== "subjects" &&
        key !== "is_completely_filled"
    )
    .sort(([keyA], [keyB]) => {
      const priorityOrder = [
        "user_id",
        //@ H2
        "personal_info",
        "first_name",
        "middle_name",
        "last_name",
        "gender",
        "dob",
        "email",
        "contact",
        "category",
        "blood_group",
        "pan_number",
        "aadhar_number",
        //    % H3
        "present_address",
        "street",
        "pincode",
        "city",
        "district",
        "state",
        //    % H3
        "permanent_address",
        // ! permanent address fields are indenting along with present address
        "street",
        "pincode",
        "city",
        "district",
        "state",
        //@ H2
        "course_info",
        "course_name",
        "duration",
        "stream",
        "admission_year",
        //@ H2
        "academic_info",
        // % H3
        "admission",
        "exam_name",
        "year_of_exam",
        "roll_number",
        "rank",
        // % H3
        "secondary",
        "exam_name",
        "year_of_exam",
        "board",
        "aggregate",
        "school_name",
        "marks",
        // % H3
        "higher_secondary",
        "exam_name",
        "year_of_exam",
        "board",
        "aggregate",
        "school_name",
        //@ H2
        "family_info",
        //! In here complete family info is indenting with personal info data
        // % H3
        "father",
        "first_name",
        "middle_name",
        "last_name",
        "email",
        "contact",
        // % H3
        "mother",
        "first_name",
        "middle_name",
        "last_name",
        "email",
        "contact",
        // % H3
        "guardian",
        // * H4
        "office_address",
        "first_name",
        "middle_name",
        "last_name",
        "createdat",
        "updatedat",
      ];
      return (
        priorityOrder.indexOf(keyA.toLowerCase()) -
        priorityOrder.indexOf(keyB.toLowerCase())
      );
    })
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
            {formatDate(value, false, false, false, false)}
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
            {formatDatev2(value, false)}
          </p>
        );
      }

      if (
        key.toLowerCase() === "first_name" ||
        key.toLowerCase() === "middle_name" ||
        key.toLowerCase() === "last_name"
      ) {
        if (!fullNameRendered) {
          fullNameRendered = true;
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
                Full Name:
              </strong>
              {`${data["first_name"] || ""} ${data["middle_name"] || ""} ${
                data["last_name"] || ""
              }`}
            </p>
          );
        } else {
          return null;
        }
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
                <h4 className={className}>{formattedKey}:</h4>
                <ul className={className}>
                  {Object.entries(value).map(([subject, marks], index) => (
                    <li key={index} className={className}>
                      <strong>{subject}:</strong> {marks}
                    </li>
                  ))}
                </ul>
              </Fragment>
            );
          } else if (
            key.toLowerCase() === "office_address" &&
            typeof value === "object" &&
            value !== null
          ) {
            return (
              <Fragment key={currentKey}>
                <h4 className={className}>{formattedKey}:</h4>
                {renderFields(value, currentKey)}
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
  const { showAlert } = useAlert();
  const router = useRouter();
  const effectRun = useRef(false);

  useEffect(() => {
    const applicantId = localStorage.getItem("userid");
    const authToken = localStorage.getItem("authToken");
    if (effectRun.current) return;
    effectRun.current = true;

    const fetchSingleApplicantData = async () => {
      const wrappedApiRequest = withLoading(
        apiRequest,
        setLoading,
        showAlert,
        "GetSingleApplicant"
      );
      try {
        const response = await wrappedApiRequest(
          `/applicant/?user_id=${applicantId}`,
          "GET",
          null,
          authToken,
          "GetSingleApplicant"
        );
        if (!response.success || !response.status) {
          devLog("Error in fetching single applicant data:", response);
          showAlert(response.message || "Failed to fetch applicant data");
          localStorage.clear();
          router.push("/");
          return;
        }
        setProfileData(response.data.data);
      } catch (error) {
        devLog("Error in fetching single applicant data:", error);
        showAlert(error.message || "Failed to fetch applicant data");
        localStorage.clear();
        router.push("/");
      }
    };

    fetchSingleApplicantData();
  }, [router, showAlert]);

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
