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
  const [sortByField, setSortByField] = useState("name"); // Default sorting field
  const [sortOrder, setSortOrder] = useState("asc"); // Default sorting order
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
    let filtered = faculties.filter((faculty) => {
      const firstName = (
        faculty?.personal_info?.first_name || ""
      ).toLowerCase();
      const lastName = (faculty?.personal_info?.last_name || "").toLowerCase();
      const fullName = `${firstName} ${lastName}`;

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
      filtered = filtered.filter((faculty) =>
        bookmarks.includes(faculty?.personal_info?.email)
      );
    }

    // Sorting Logic
    if (sortByField) {
      filtered = filtered.sort((a, b) => {
        let aValue = "";
        let bValue = "";

        // Determine the field to sort by and assign the appropriate values
        if (sortByField === "fullName") {
          aValue = `${a?.personal_info?.first_name || ""} ${
            a?.personal_info?.last_name || ""
          }`;
          bValue = `${b?.personal_info?.first_name || ""} ${
            b?.personal_info?.last_name || ""
          }`;
        } else {
          aValue = a?.personal_info?.[sortByField] || "";
          bValue = b?.personal_info?.[sortByField] || "";
        }

        // Ensure values are compared as strings
        aValue = aValue.toString().toLowerCase();
        bValue = bValue.toString().toLowerCase();

        if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
        if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
        return 0;
      });
    }

    return filtered;
  }, [
    faculties,
    debouncedQuery,
    selectedGender,
    showBookmarkedOnly,
    sortByField,
    sortOrder,
  ]);

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
            {/* Existing Filters */}
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
                <option key={course.code} value={course.code}>
                  {course.name}
                </option>
              ))}
            </select>

            <select
              value={selectedStream}
              onChange={(e) => setSelectedStream(e.target.value)}
              aria-label="Filter by stream"
              disabled={!selectedCourse}
            >
              <option value="">Select Stream</option>
              {streams.map((stream) => (
                <option key={stream} value={stream}>
                  {stream}
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

            <label>
              <input
                type="checkbox"
                checked={showBookmarkedOnly}
                onChange={() => setShowBookmarkedOnly(!showBookmarkedOnly)}
              />
              Show Bookmarked Only
            </label>

            {/* Sort By Fields Dropdown */}
            <select
              value={sortByField}
              onChange={(e) => setSortByField(e.target.value)}
              aria-label="Sort by"
            >
              <option value="fullName">Name</option>
              <option value="email">Email</option>
              <option value="department">Department</option>
              <option value="course">Course</option>
              <option value="stream">Stream</option>
            </select>

            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              aria-label="Sort order"
            >
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>
          </div>

          <div className="faculty-management__list">
            {paginatedFaculties.map((faculty) => (
              <FacultyIdCard
                key={faculty.personal_info.email}
                faculty={faculty}
                placeholderImage={placeholderImage}
              />
            ))}
          </div>

          {/* Pagination Controls */}
          <div className="faculty-management__pagination">
            <select
              value={pageSize}
              onChange={handlePageSizeChange}
              aria-label="Page size"
            >
              <option value="5">5 per page</option>
              <option value="9">9 per page</option>
              <option value="15">15 per page</option>
              <option value="20">20 per page</option>
            </select>

            <div className="faculty-management__pagination-controls">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage <= 1}
              >
                Previous
              </button>
              <span>
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage >= totalPages}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </AdminLayout>
    </Fragment>
  );
}

export default Faculty;
