import { useEffect, useState, Fragment, useRef } from "react";
import Image from "next/image";
import { AdminLayout } from "@/layout";
import { AllLoader } from "@/components";
import { useAlert } from "@/contexts/AlertContext";
import { withLoading, devLog, apiRequest } from "@/utils/apiUtils";

function Faculty() {
  const [faculties, setFaculties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [collegeData, setCollegeData] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedStream, setSelectedStream] = useState("");
  const { showAlert } = useAlert();
  const effectRun = useRef(false);
  const collegeId = 304;
  const placeholderImage = "/images/placeholder.png";

  useEffect(() => {
    const authToken = localStorage.getItem("authToken");
    if (effectRun.current) return;
    effectRun.current = true;

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

    const getCollegeDetails = async () => {
      const wrappedApiRequest = withLoading(
        apiRequest,
        setLoading,
        showAlert,
        "GetCollegeDetails"
      );
      try {
        const response = await wrappedApiRequest(
          `/college/?college_id=${collegeId}`,
          "GET",
          null,
          authToken,
          "GetCollegeDetails"
        );
        if (!response.success || !response.status) {
          devLog("Error in fetching college details:", response.message);
          showAlert(response.message || "Failed to fetch college details");
          return;
        }
        setCollegeData(response.data.data);
      } catch (error) {
        devLog("Error in fetching college details:", error);
        showAlert(error.message || "Failed to fetch college details");
      }
    };

    const onLoadHandler = async () => {
      await getAllFaculty();
      await getCollegeDetails();
    };
    onLoadHandler();
  }, [showAlert]);

  const filteredFaculties = faculties.filter((faculty) => {
    const fullName = `${faculty.personal_info.first_name || ""} ${
      faculty.personal_info.last_name || ""
    }`.toLowerCase();
    const matchesName = fullName.includes(searchQuery.toLowerCase());

    const department = faculty.job_info.department || "";
    const matchesDepartment =
      selectedStream === "" ||
      department.toLowerCase() === selectedStream.toLowerCase();

    return matchesName && matchesDepartment;
  });

  const courses = collegeData?.college_courses || [];
  const streams = selectedCourse
    ? courses.find((course) => course.code === selectedCourse)?.streams || []
    : [];

  return (
    <Fragment>
      <AdminLayout>
        {loading && <AllLoader />}
        <div className="manage-faculty-container">
          <h1 className="title">Faculties of Eduversa:</h1>

          <input
            type="text"
            placeholder="Search by name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-bar"
          />

          <select
            value={selectedCourse}
            onChange={(e) => {
              setSelectedCourse(e.target.value);
              setSelectedStream("");
            }}
            className="course-dropdown"
          >
            <option value="">Select Course</option>
            {courses.map((course) => (
              <option key={course._id} value={course.code}>
                {course.name}
              </option>
            ))}
          </select>

          <select
            value={selectedStream}
            onChange={(e) => setSelectedStream(e.target.value)}
            className="stream-dropdown"
            disabled={!selectedCourse}
          >
            <option value="">Select Stream</option>
            {streams.map((stream) => (
              <option key={stream._id} value={stream.name}>
                {stream.name}
              </option>
            ))}
          </select>

          <div>
            {filteredFaculties.length > 0 ? (
              filteredFaculties.map((faculty) => (
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
        </div>
      </AdminLayout>
    </Fragment>
  );
}

export default Faculty;
