import { useEffect, useState, useRef } from "react";
import { FacultyLayout } from "@/layout";
import { AllLoader } from "@/components";
import { withLoading, devLog, apiRequest } from "@/utils/apiUtils";
import { useAlert } from "@/contexts/AlertContext";
import { useRouter } from "next/router";

// Utility function to generate class names based on data type and key
const generateClassName = (key, data) => {
  const baseClass = "faculty-data";
  if (data === null || data === undefined) {
    return `${baseClass} ${baseClass}--empty`;
  }
  if (typeof data === "object") {
    if (Array.isArray(data)) {
      return `${baseClass} ${baseClass}--array ${baseClass}--${key}`;
    }
    return `${baseClass} ${baseClass}--object ${baseClass}--${key}`;
  }
  return `${baseClass} ${baseClass}--${typeof data} ${baseClass}--${key}`;
};

// Recursive component to render nested data dynamically with class names
const RenderData = ({ data, parentKey = "" }) => {
  if (data === null || data === undefined) {
    return <span className={generateClassName(parentKey, data)}>N/A</span>;
  }

  if (typeof data !== "object") {
    return (
      <span className={generateClassName(parentKey, data)}>
        {data.toString()}
      </span>
    );
  }

  if (Array.isArray(data)) {
    return (
      <ul className={generateClassName(parentKey, data)}>
        {data.length > 0 ? (
          data.map((item, index) => (
            <li
              key={index}
              className={`${generateClassName(parentKey, item)} item`}
            >
              <RenderData data={item} parentKey={`${parentKey}-${index}`} />
            </li>
          ))
        ) : (
          <span className={`${generateClassName(parentKey, data)} empty-array`}>
            N/A
          </span>
        )}
      </ul>
    );
  }

  return (
    <div className={generateClassName(parentKey, data)}>
      {Object.entries(data).map(([key, value]) => (
        <div key={key} className={`${generateClassName(key, value)} entry`}>
          <h4 className="label">{key.replace(/_/g, " ")}:</h4>
          <RenderData data={value} parentKey={key} />
        </div>
      ))}
    </div>
  );
};

// Main Faculty component
function Faculty() {
  const [loading, setLoading] = useState(false);
  const [facultyData, setFacultyData] = useState(null);
  const { showAlert } = useAlert();
  const router = useRouter();
  const effectRun = useRef(false);

  useEffect(() => {
    const facultyId = localStorage.getItem("userid");
    const authToken = localStorage.getItem("authToken");
    if (effectRun.current) return;
    effectRun.current = true;

    const fetchFacultyData = async () => {
      const wrappedApiRequest = withLoading(
        apiRequest,
        setLoading,
        showAlert,
        "GetSinglefaculty"
      );

      try {
        const response = await wrappedApiRequest(
          `/faculty/?user_id=${facultyId}`,
          "GET",
          null,
          authToken,
          "GetSinglefaculty"
        );

        if (!response.success || !response.status) {
          devLog("Error in fetching faculty data:", response);
          showAlert(response.message || "Failed to fetch faculty data");
          localStorage.clear();
          router.push("/");
          return;
        }

        setFacultyData(response.data); // Save the fetched data
      } catch (error) {
        devLog("Error in fetching faculty data:", error);
        showAlert(error.message || "Failed to fetch faculty data");
        localStorage.clear();
        router.push("/");
      }
    };

    fetchFacultyData();
  }, [router, showAlert]);

  return (
    <FacultyLayout>
      <h1 className="faculty-dashboard-title">Faculty Dashboard</h1>
      {loading ? (
        <AllLoader />
      ) : facultyData ? (
        <section className="faculty-data-section">
          <h2 className="faculty-data-heading">Faculty Information</h2>
          <h3 className="faculty-data-subheading">Data:</h3>
          <RenderData data={facultyData} />
        </section>
      ) : (
        <p className="faculty-loading-text">Loading faculty data...</p>
      )}
    </FacultyLayout>
  );
}

export default Faculty;
