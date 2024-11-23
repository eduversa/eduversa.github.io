import { useEffect, useState, Fragment, useMemo, useCallback } from "react";
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
  const [showBookmarkedOnly, setShowBookmarkedOnly] = useState(false);
  const { showAlert } = useAlert();
  const collegeId = 304;
  const placeholderImage = "/user.png";

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedQuery(searchQuery), 300);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  useEffect(() => {
    setCurrentPage(1);
  }, [
    faculties,
    selectedCourse,
    selectedStream,
    selectedGender,
    debouncedQuery,
    showBookmarkedOnly,
  ]);

  useEffect(() => {
    const fetchData = async () => {
      const authToken = localStorage.getItem("authToken");
      const wrappedApiRequest = withLoading(
        apiRequest,
        setLoading,
        showAlert,
        "FetchData"
      );

      try {
        const facultyResponse = await wrappedApiRequest(
          `/faculty/all`,
          "GET",
          null,
          authToken
        );
        if (!facultyResponse.success) {
          devLog("Error fetching faculties:", facultyResponse.message);
          showAlert(facultyResponse.message || "Error fetching faculties.");
          return;
        }
        setFaculties(facultyResponse.data.data);

        const collegeResponse = await wrappedApiRequest(
          `/college/?college_id=${collegeId}`,
          "GET",
          null,
          authToken
        );
        if (!collegeResponse.success) {
          devLog("Error fetching college details:", collegeResponse.message);
          showAlert(
            collegeResponse.message || "Error fetching college details."
          );
          return;
        }
        setCollegeData(collegeResponse.data.data);
      } catch (error) {
        devLog("Error fetching data:", error.message);
        showAlert(error.message || "Failed to fetch data.");
      }
    };

    fetchData();
  }, [showAlert]);

  const filteredFaculties = useMemo(() => {
    const filtered = faculties.filter((faculty) => {
      const fullName = `${faculty?.personal_info?.first_name || ""} ${
        faculty?.personal_info?.last_name || ""
      }`.toLowerCase();
      const email = (faculty?.personal_info?.email || "").toLowerCase();
      const gender = (faculty?.personal_info?.gender || "").toLowerCase();
      const department = (faculty?.job_info?.department || "").toLowerCase();
      const course = (faculty?.job_info?.course || "").toLowerCase();
      const stream = (faculty?.job_info?.stream || "").toLowerCase();

      const matchesName = fullName.includes(debouncedQuery.toLowerCase());
      const matchesEmail = email.includes(debouncedQuery.toLowerCase());
      const matchesGender = selectedGender
        ? gender === selectedGender.toLowerCase()
        : true;
      const matchesDepartment = department.includes(
        debouncedQuery.toLowerCase()
      );
      const matchesCourse = course.includes(debouncedQuery.toLowerCase());
      const matchesStream = stream.includes(debouncedQuery.toLowerCase());

      return (
        (matchesName ||
          matchesEmail ||
          matchesDepartment ||
          matchesCourse ||
          matchesStream) &&
        matchesGender
      );
    });

    if (showBookmarkedOnly) {
      const bookmarks =
        JSON.parse(localStorage.getItem("bookmarkedFaculty")) || [];
      return filtered.filter((faculty) =>
        bookmarks.includes(faculty?.personal_info?.email)
      );
    }
    return filtered;
  }, [faculties, debouncedQuery, selectedGender, showBookmarkedOnly]);

  const totalPages = Math.ceil(filteredFaculties.length / pageSize);
  const paginatedFaculties = filteredFaculties.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [totalPages, currentPage]);

  const handlePageSizeChange = useCallback((e) => {
    setPageSize(Number(e.target.value));
    setCurrentPage(1);
  }, []);

  const handlePageChange = useCallback((pageNumber) => {
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
      `"${faculty?.personal_info?.first_name || ""}"`,
      `"${faculty?.personal_info?.last_name || ""}"`,
      `"${faculty?.personal_info?.email || ""}"`,
      `"${faculty?.personal_info?.gender || ""}"`,
      `"${faculty?.job_info?.department || ""}"`,
      `"${faculty?.job_info?.course || ""}"`,
      `"${faculty?.job_info?.stream || ""}"`,
    ]);

    const csvContent = [headers, ...rows]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `faculty_data_${new Date().toISOString()}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [filteredFaculties, showAlert]);

  const courses = collegeData?.college_courses || [];
  const streams = selectedCourse
    ? courses.find((course) => course.code === selectedCourse)?.streams || []
    : [];

  return (
    <Fragment>
      <AdminLayout>
        {loading && <AllLoader />}
        <div className="faculty-management">
          <h1 className="faculty-management__title">Faculties</h1>

          <div className="faculty-management__actions">
            <input
              type="text"
              placeholder="Search by name, email, department, course, or stream..."
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
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>

            <label className="faculty-management__show-bookmarked">
              <input
                type="checkbox"
                checked={showBookmarkedOnly}
                onChange={() => setShowBookmarkedOnly(!showBookmarkedOnly)}
              />
              Show Bookmarked Only
            </label>
          </div>

          <div className="faculty-management__list">
            {paginatedFaculties.map((faculty) => (
              <FacultyIdCard
                key={faculty?.personal_info?.email}
                faculty={faculty}
                placeholderImage={placeholderImage}
              />
            ))}
          </div>

          <div className="faculty-management__pagination">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </button>

            <span>
              Page {currentPage} of {totalPages}
            </span>

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>

          <div className="faculty-management__page-size">
            <label>
              Items per page:
              <select
                value={pageSize}
                onChange={handlePageSizeChange}
                aria-label="Select number of items per page"
              >
                {[9, 18, 27].map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>
      </AdminLayout>
    </Fragment>
  );
}

export default Faculty;
