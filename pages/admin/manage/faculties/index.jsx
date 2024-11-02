import React, { useEffect, useState } from "react";
import { AdminLayout } from "@/layout";
import { AllLoader } from "@/components";
import { useAlert } from "@/contexts/AlertContext";
import { withLoading, devLog, apiRequest } from "@/utils/apiUtils";

function Faculty() {
  const [faculties, setFaculties] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showAlert } = useAlert();

  useEffect(() => {
    const authToken = localStorage.getItem("authToken");

    const getAllFaculty = async () => {
      const wrappedApiRequest = withLoading(
        apiRequest,
        setLoading,
        showAlert,
        "GetAllFaculties"
      );
      try {
        const response = await wrappedApiRequest(
          `/faculty/all`,
          "GET",
          null,
          authToken,
          "GetAllFaculties"
        );
        if (!response.success || !response.status) {
          throw new Error(
            response.message || "Error getting faculties. Please try again."
          );
        }
        setFaculties(response.data.data);
      } catch (error) {
        devLog("Error in getting faculties:", error);
        showAlert(error.message || "Failed to fetch faculty data.");
      }
    };

    getAllFaculty();
  }, [showAlert]);

  const renderData = (data, level = 0) => {
    if (data === null)
      return <span className={`value-text level-${level}`}>N/A</span>;

    if (typeof data === "object") {
      if (Array.isArray(data)) {
        return (
          <ul className={`list-level-${level}`}>
            {data.map((item, index) => (
              <li key={item._id || index} className={`item-level-${level}`}>
                {renderData(item, level + 1)}
              </li>
            ))}
          </ul>
        );
      }

      return (
        <div className={`nested-object level-${level}`}>
          {Object.entries(data).map(([key, value]) => (
            <div key={key} className={`key-value-pair level-${level}`}>
              {level === 0 ? (
                <h3 className={`heading-level-${level}`}>
                  {key.replace(/_/g, " ")}
                </h3>
              ) : (
                <h4 className={`subheading-level-${level}`}>
                  {key.replace(/_/g, " ")}
                </h4>
              )}
              <div className={`value-container level-${level}`}>
                {renderData(value, level + 1)}
              </div>
            </div>
          ))}
        </div>
      );
    }

    return (
      <span className={`value-text level-${level}`}>{data.toString()}</span>
    );
  };

  const renderFacultyDetails = (faculty) => {
    const facultyData = [
      {
        tag: "h2",
        className: "faculty-title",
        content: `${faculty.personal_info.first_name || "Unknown"} ${
          faculty.personal_info.last_name || ""
        }`,
      },
      {
        tag: "p",
        className: "",
        content: [
          { tag: "strong", content: "Email:" },
          { tag: "span", content: faculty.personal_info.email || "N/A" },
        ],
      },
      {
        tag: "div",
        className: "faculty-details",
        content: renderData(faculty),
      },
    ];

    return facultyData.map((element, index) =>
      React.createElement(
        element.tag,
        { className: element.className, key: index },
        Array.isArray(element.content)
          ? element.content.map((subElement, subIndex) =>
              React.createElement(
                subElement.tag,
                { key: subIndex },
                subElement.content
              )
            )
          : element.content
      )
    );
  };

  return (
    <AdminLayout>
      {loading ? (
        <AllLoader />
      ) : (
        <div className="faculty-list">
          <h1 className="title">Faculties of Eduversa:</h1>
          {faculties.length > 0 ? (
            faculties.map((faculty) => (
              <div className="faculty-card" key={faculty._id}>
                {renderFacultyDetails(faculty)}
              </div>
            ))
          ) : (
            <p>No faculty members found.</p>
          )}
        </div>
      )}
    </AdminLayout>
  );
}

export default Faculty;
