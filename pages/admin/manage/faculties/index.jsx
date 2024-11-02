import { Fragment, useEffect, useState } from "react";
import { AdminLayout } from "@/layout";
import { AllLoader } from "@/components";
import { useAlert } from "@/contexts/AlertContext";
import { withLoading, devLog, apiRequest } from "@/utils/apiUtils";

function Faculty() {
  const [faculties, setFaculties] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showAlert } = useAlert();

  const authToken = localStorage.getItem("authToken");

  useEffect(() => {
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
          devLog("Error in getting faculties:", response.message);
          showAlert(
            response.message || "Error getting faculties. Please try again."
          );
          return;
        }
        setFaculties(response.data.data);
      } catch (error) {
        devLog("Error in getting faculties:", error);
        showAlert(error.message || "Failed to fetch faculty data.");
      }
    };

    getAllFaculty();
  }, [authToken, showAlert]);

  return (
    <Fragment>
      <AdminLayout>
        {loading && <AllLoader />}
        <h1 className="title">Faculties of Eduversa:</h1>
        <div className="faculty-list-container">
          {faculties.length > 0 ? (
            faculties.map((faculty) => (
              <div key={faculty._id} className="faculty-card">
                <h2>{faculty.name}</h2>
                <p>
                  <strong>Department:</strong> {faculty.department}
                </p>
                <p>
                  <strong>Email:</strong> {faculty.email}
                </p>
              </div>
            ))
          ) : (
            <p>No faculties found.</p>
          )}
        </div>
      </AdminLayout>
    </Fragment>
  );
}

export default Faculty;
