import { Fragment, useEffect, useState } from "react";
import Image from "next/image";
import { AdminLayout } from "@/layout";
import { AllLoader } from "@/components";
import { useAlert } from "@/contexts/AlertContext";
import { withLoading, devLog, apiRequest } from "@/utils/apiUtils";

function Faculty() {
  const [faculties, setFaculties] = useState([]);
  const [loading, setLoading] = useState(true);
  const authToken = localStorage.getItem("authToken");
  const { showAlert } = useAlert();
  const placeholderImage = "/images/placeholder.png";
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
        <div>
          {faculties.length > 0 ? (
            faculties.map((faculty) => (
              <div key={faculty._id} className="faculty-card">
                <Image
                  src={faculty.image || placeholderImage}
                  alt="Faculty"
                  className="faculty-image"
                  width={100}
                  height={100}
                  objectFit="cover"
                />
                <h2>
                  {faculty.personal_info.first_name || "No Name"}{" "}
                  {faculty.personal_info.last_name || ""}
                </h2>
                <p>Email: {faculty.personal_info.email}</p>
                <p>User ID: {faculty.user_id}</p>
                <p>
                  Address:{" "}
                  {faculty.personal_info.present_address.street || "N/A"},{" "}
                  {faculty.personal_info.present_address.city || "N/A"},{" "}
                  {faculty.personal_info.present_address.district || "N/A"},{" "}
                  {faculty.personal_info.present_address.state || "N/A"}
                </p>
                <p>Gender: {faculty.personal_info.gender || "N/A"}</p>
                <p>
                  DOB:{" "}
                  {faculty.personal_info.dob
                    ? new Date(faculty.personal_info.dob).toLocaleDateString()
                    : "N/A"}
                </p>
                <p>Contact: {faculty.personal_info.contact || "N/A"}</p>
                <p>Faculty ID: {faculty.job_info.faculty_id}</p>
                <p>Room: {faculty.job_info.room || "N/A"}</p>
                <p>
                  Department: {faculty.job_info.department || "Not Assigned"}
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
