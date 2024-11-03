import { useEffect, useState, Fragment, useRef } from "react";
import { AdminLayout } from "@/layout";
import { AllLoader } from "@/components";
import { useAlert } from "@/contexts/AlertContext";
import { withLoading, devLog, apiRequest } from "@/utils/apiUtils";
import { FacultyIdCard } from "@/components";

function Faculty() {
  const [faculties, setFaculties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [collegeData, setCollegeData] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedStream, setSelectedStream] = useState("");
  const [selectedGender, setSelectedGender] = useState("");
  const [pageSize, setPageSize] = useState(9);
  const [currentPage, setCurrentPage] = useState(1);
  const [favorites, setFavorites] = useState([]);
  const [cache, setCache] = useState({});
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
        setCache((prevCache) => ({
          ...prevCache,
          faculties: response.data.data,
        }));
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
      if (cache.faculties) {
        setFaculties(cache.faculties);
      } else {
        await getAllFaculty();
        await getCollegeDetails();
      }
    };
    onLoadHandler();
  }, [showAlert, cache]);

  const filteredFaculties = faculties.filter((faculty) => {
    const fullName = `${faculty.personal_info.first_name || ""} ${
      faculty.personal_info.last_name || ""
    }`.toLowerCase();

    const email = (
      (faculty.contact_info && faculty.contact_info.email) ||
      ""
    ).toLowerCase();
    const gender = (faculty.personal_info.gender || "").toLowerCase();
    const department = (faculty.job_info.department || "").toLowerCase();

    const matchesName = fullName.includes(searchQuery.toLowerCase());
    const matchesEmail = email.includes(searchQuery.toLowerCase());
    const matchesGender =
      selectedGender === "" || gender === selectedGender.toLowerCase();
    const matchesDepartment =
      selectedStream === "" || department === selectedStream.toLowerCase();

    return (matchesName || matchesEmail) && matchesGender && matchesDepartment;
  });

  const totalPages = Math.ceil(filteredFaculties.length / pageSize);
  const paginatedFaculties = filteredFaculties.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const courses = collegeData?.college_courses || [];
  const streams = selectedCourse
    ? courses.find((course) => course.code === selectedCourse)?.streams || []
    : [];

  const handleChangePageSize = (e) => {
    setPageSize(Number(e.target.value));
    setCurrentPage(1);
  };

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const toggleFavorite = (facultyId) => {
    setFavorites((prevFavorites) =>
      prevFavorites.includes(facultyId)
        ? prevFavorites.filter((id) => id !== facultyId)
        : [...prevFavorites, facultyId]
    );
  };

  const exportFacultyDataAsCSV = () => {
    const headers = [
      "First Name",
      "Last Name",
      "Email",
      "Gender",
      "Department",
      "Course",
      "Stream",
    ];

    const rows = filteredFaculties.map((faculty) => {
      return [
        faculty.personal_info.first_name || "",
        faculty.personal_info.last_name || "",
        (faculty.contact_info && faculty.contact_info.email) || "",
        faculty.personal_info.gender || "",
        faculty.job_info.department || "",
        faculty.job_info.course || "",
        faculty.job_info.stream || "",
      ];
    });

    const csvContent = [headers, ...rows].map((e) => e.join(",")).join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "faculty_data.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Fragment>
      <AdminLayout>
        {loading && <AllLoader />}
        <div className="manage-faculty">
          <h1 className="manage-faculty__title">Faculties of Eduversa:</h1>

          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="manage-faculty__search-bar"
          />

          <select
            value={selectedCourse}
            onChange={(e) => {
              setSelectedCourse(e.target.value);
              setSelectedStream("");
            }}
            className="manage-faculty__course-dropdown"
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
            className="manage-faculty__stream-dropdown"
            disabled={!selectedCourse}
          >
            <option value="">Select Stream</option>
            {streams.map((stream) => (
              <option key={stream._id} value={stream.name}>
                {stream.name}
              </option>
            ))}
          </select>

          <select
            value={selectedGender}
            onChange={(e) => setSelectedGender(e.target.value)}
            className="manage-faculty__gender-dropdown"
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>

          <button
            onClick={exportFacultyDataAsCSV}
            className="manage-faculty__export-button"
          >
            Export Data as CSV
          </button>

          <div className="manage-faculty__list">
            {paginatedFaculties.length > 0 ? (
              paginatedFaculties.map((faculty) => (
                <FacultyIdCard
                  key={faculty._id}
                  faculty={faculty}
                  placeholderImage={placeholderImage}
                  toggleFavorite={toggleFavorite}
                  isFavorite={favorites.includes(faculty._id)}
                  className="manage-faculty__faculty-card"
                />
              ))
            ) : (
              <p className="manage-faculty__no-results">No faculties found.</p>
            )}
          </div>

          <div className="manage-faculty__pagination-container">
            <div className="manage-faculty__page-size-select">
              <select
                value={pageSize}
                onChange={handleChangePageSize}
                className="manage-faculty__select-pagesize"
              >
                <option value={9}>9 cards per page</option>
                <option value={24}>24 cards per page</option>
                <option value={50}>50 cards per page</option>
              </select>
            </div>
            <div className="manage-faculty__pagination">
              <ul className="manage-faculty__pagination-list">
                {Array.from({ length: totalPages }).map((_, index) => (
                  <li
                    key={index}
                    className={`manage-faculty__pagination-item ${
                      currentPage === index + 1 ? "active" : ""
                    }`}
                  >
                    <button
                      className="manage-faculty__pagination-link"
                      onClick={() => paginate(index + 1)}
                    >
                      {index + 1}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </AdminLayout>
    </Fragment>
  );
}

export default Faculty;
