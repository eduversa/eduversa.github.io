import {
  useEffect,
  useState,
  Fragment,
  useRef,
  useCallback,
  useMemo,
} from "react";
import { AdminLayout } from "@/layout";
import { AllLoader } from "@/components";
import { useAlert } from "@/contexts/AlertContext";
import { withLoading, devLog, apiRequest } from "@/utils/apiUtils";
import { FacultyIdCard } from "@/components";

function Faculty() {
  const [faculties, setFaculties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState(searchQuery);
  const [collegeData, setCollegeData] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedStream, setSelectedStream] = useState("");
  const [selectedGender, setSelectedGender] = useState("");
  const [pageSize, setPageSize] = useState(9);
  const [currentPage, setCurrentPage] = useState(1);
  const { showAlert } = useAlert();
  const effectRun = useRef(false);
  const collegeId = 304;
  const placeholderImage = "/user.png";

  // Debounce search query updates
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedQuery(searchQuery), 300);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Load faculty and college data
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
        devLog("Error in getting faculties:", error.response || error.message);
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
        devLog(
          "Error in fetching college details:",
          error.response || error.message
        );
        showAlert(error.message || "Failed to fetch college details");
      }
    };

    getAllFaculty();
    getCollegeDetails();
  }, [showAlert]);

  const filteredFaculties = useMemo(() => {
    return faculties.filter((faculty) => {
      const fullName = `${faculty?.personal_info?.first_name || ""} ${
        faculty?.personal_info?.last_name || ""
      }`.toLowerCase();
      const email = (faculty?.personal_info?.email || "").toLowerCase();
      const gender = (faculty?.personal_info?.gender || "").toLowerCase();
      const department = (faculty?.job_info?.department || "").toLowerCase();

      const matchesName = fullName.includes(debouncedQuery.toLowerCase());
      const matchesEmail = email.includes(debouncedQuery.toLowerCase());
      const matchesGender =
        selectedGender === "" || gender === selectedGender.toLowerCase();
      const matchesDepartment =
        selectedStream === "" || department === selectedStream.toLowerCase();

      return matchesName || matchesEmail || matchesGender || matchesDepartment;
    });
  }, [faculties, debouncedQuery, selectedGender, selectedStream]);

  const totalPages = Math.ceil(filteredFaculties.length / pageSize);
  const paginatedFaculties = filteredFaculties.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [totalPages, currentPage]);

  const courses = collegeData?.college_courses || [];
  const streams = selectedCourse
    ? courses.find((course) => course.code === selectedCourse)?.streams || []
    : [];

  const handleChangePageSize = (e) => {
    setPageSize(Number(e.target.value));
    setCurrentPage(1);
  };

  const paginate = useCallback((pageNumber) => {
    setCurrentPage(pageNumber);
  }, []);

  const exportFacultyDataAsCSV = useCallback(() => {
    if (filteredFaculties.length === 0) {
      showAlert("No data available for export.");
      return;
    }

    const headers = [
      "First Name",
      "Last Name",
      "Email",
      "Gender",
      "Department",
      "Course",
      "Stream",
    ];
    const rows = filteredFaculties.map((faculty) => [
      faculty?.personal_info?.first_name || "",
      faculty?.personal_info?.last_name || "",
      faculty?.personal_info?.email || "",
      faculty?.personal_info?.gender || "",
      faculty?.job_info?.department || "",
      faculty?.job_info?.course || "",
      faculty?.job_info?.stream || "",
    ]);

    const csvContent = [headers, ...rows].map((e) => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `faculty_data_${new Date().toISOString()}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [filteredFaculties, showAlert]);

  return (
    <Fragment>
      <AdminLayout>
        {loading && <AllLoader />}
        <div className="faculty-management">
          <h1 className="faculty-management__title">Faculties</h1>

          <div className="faculty-management__actions">
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="faculty-management__search-bar"
              aria-label="Search faculties"
            />
            <button
              onClick={exportFacultyDataAsCSV}
              className="faculty-management__export-btn"
            >
              Export Data as CSV
            </button>
          </div>

          <div className="faculty-management__filters">
            <select
              value={selectedCourse}
              onChange={(e) => {
                setSelectedCourse(e.target.value);
                setSelectedStream("");
              }}
              aria-label="Filter by course"
            >
              <option value="">Select Course</option>
              {courses.map((course) => (
                <option key={course.name} value={course.code}>
                  {course.name}
                </option>
              ))}
            </select>

            <select
              value={selectedStream}
              onChange={(e) => setSelectedStream(e.target.value)}
              disabled={!selectedCourse}
              aria-label="Filter by stream"
            >
              <option value="">Select Stream</option>
              {streams.map((stream) => (
                <option key={stream.name} value={stream.name}>
                  {stream.name}
                </option>
              ))}
            </select>

            <select
              value={selectedGender}
              onChange={(e) => setSelectedGender(e.target.value)}
              aria-label="Filter by gender"
            >
              <option value="">All Genders</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="faculty-management__list">
            {paginatedFaculties.length > 0 ? (
              paginatedFaculties.map((faculty) => (
                <FacultyIdCard
                  key={faculty._id}
                  faculty={faculty}
                  placeholderImage={placeholderImage}
                />
              ))
            ) : (
              <p className="faculty-management__list__empty">
                No faculties found.
              </p>
            )}
          </div>

          <div className="faculty-management__pagination">
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              aria-label="Go to previous page"
            >
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => paginate(page)}
                className={currentPage === page ? "active" : ""}
                aria-label={`Go to page ${page}`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
              aria-label="Go to next page"
            >
              Next
            </button>
          </div>

          <div className="faculty-management__page-size">
            <label htmlFor="page-size">Items per page: </label>
            <select
              id="page-size"
              value={pageSize}
              onChange={handleChangePageSize}
            >
              {[5, 9, 15, 25].map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>
        </div>
      </AdminLayout>
    </Fragment>
  );
}

export default Faculty;
