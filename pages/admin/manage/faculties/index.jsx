/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState, Fragment, useMemo, useCallback } from "react";
import { AdminLayout } from "@/layout";
import { AllLoader } from "@/components";
import { useAlert } from "@/contexts/AlertContext";
import { withLoading, devLog, apiRequest } from "@/utils/apiUtils";
import { FacultyIdCard } from "@/components";
import jsPDF from "jspdf";

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
  const [sortByField, setSortByField] = useState("fullName");
  const [sortOrder, setSortOrder] = useState("asc");
  const [exportFormat, setExportFormat] = useState("csv");
  const [refetchTrigger, setRefetchTrigger] = useState(0);
  const { showAlert } = useAlert();
  const placeholderImage = "/user.png";

  const triggerRefetch = useCallback(() => {
    setRefetchTrigger((count) => count + 1);
  }, []);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedQuery(searchQuery), 300);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  useEffect(() => {
    setCurrentPage(1);
  }, [
    selectedCourse,
    selectedStream,
    selectedGender,
    debouncedQuery,
    showBookmarkedOnly,
    pageSize,
    sortByField,
    sortOrder,
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
          setFaculties([]);
        } else {
          setFaculties(facultyResponse.data.data || []);
        }

        const collegeResponse = await wrappedApiRequest(
          `/college/?college_id=304`,
          "GET",
          null,
          authToken
        );
        if (!collegeResponse.success) {
          devLog("Error fetching college details:", collegeResponse.message);
          showAlert(
            collegeResponse.message || "Error fetching college details."
          );
          setCollegeData(null);
        } else {
          setCollegeData(collegeResponse.data.data || null);
        }
      } catch (error) {
        devLog("Error fetching data:", error.message);
        showAlert(error.message || "Failed to fetch data.");
        setFaculties([]);
        setCollegeData(null);
      }
    };

    fetchData();
  }, [showAlert, refetchTrigger]);

  const bookmarks = useMemo(() => {
    if (typeof window === "undefined") {
      return [];
    }
    try {
      return JSON.parse(localStorage.getItem("bookmarkedFaculty")) || [];
    } catch (error) {
      console.error(
        "Failed to parse bookmarkedFaculty from localStorage",
        error
      );
      return [];
    }
  }, []);

  const getFacultyValue = useCallback((faculty, field) => {
    if (!faculty) return "";

    if (field === "fullName") {
      return `${faculty.personal_info?.first_name || ""} ${
        faculty.personal_info?.last_name || ""
      }`.trim();
    }
    if (["email", "gender", "first_name", "last_name"].includes(field)) {
      return faculty.personal_info?.[field] || "";
    }
    if (["department", "course", "stream"].includes(field)) {
      return faculty.job_info?.[field] || "";
    }
    return "";
  }, []);

  const filteredFaculties = useMemo(() => {
    const result = faculties
      .filter((faculty) => {
        if (!faculty) return false;

        const firstName = (
          faculty.personal_info?.first_name || ""
        ).toLowerCase();
        const lastName = (faculty.personal_info?.last_name || "").toLowerCase();
        const fullName = `${firstName} ${lastName}`.trim();
        const email = (faculty.personal_info?.email || "").toLowerCase();
        const gender = (faculty.personal_info?.gender || "").toLowerCase();
        const department = (faculty.job_info?.department || "").toLowerCase();
        const course = (faculty.job_info?.course || "").toLowerCase();
        const stream = (faculty.job_info?.stream || "").toLowerCase();

        const lowerDebouncedQuery = debouncedQuery.toLowerCase();

        const matchesSearch =
          fullName.includes(lowerDebouncedQuery) ||
          email.includes(lowerDebouncedQuery) ||
          department.includes(lowerDebouncedQuery) ||
          course.includes(lowerDebouncedQuery) ||
          stream.includes(lowerDebouncedQuery);

        const matchesGender = selectedGender
          ? gender === selectedGender.toLowerCase()
          : true;

        const matchesCourse = selectedCourse
          ? course ===
            (
              collegeData?.college_courses?.find(
                (c) => c.code === selectedCourse
              )?.name || ""
            ).toLowerCase()
          : true;

        const matchesStream = selectedStream
          ? stream === selectedStream.toLowerCase()
          : true;

        const isBookmarked = showBookmarkedOnly
          ? bookmarks.includes(faculty.personal_info?.email)
          : true;

        return (
          matchesSearch &&
          matchesGender &&
          matchesCourse &&
          matchesStream &&
          isBookmarked
        );
      })
      .sort((a, b) => {
        const isBookmarkedA = bookmarks.includes(a?.personal_info?.email);
        const isBookmarkedB = bookmarks.includes(b?.personal_info?.email);

        if (isBookmarkedA && !isBookmarkedB) return -1;
        if (!isBookmarkedA && isBookmarkedB) return 1;

        let aValue = getFacultyValue(a, sortByField);
        let bValue = getFacultyValue(b, sortByField);

        aValue = (
          typeof aValue === "string" ? aValue : String(aValue)
        ).toLowerCase();
        bValue = (
          typeof bValue === "string" ? bValue : String(bValue)
        ).toLowerCase();

        return sortOrder === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      });

    return result;
  }, [
    faculties,
    debouncedQuery,
    selectedGender,
    selectedCourse,
    selectedStream,
    showBookmarkedOnly,
    sortByField,
    sortOrder,
    bookmarks,
    getFacultyValue,
    collegeData,
  ]);

  const totalPages = Math.ceil(filteredFaculties.length / pageSize);
  const paginatedFaculties = useMemo(
    () =>
      filteredFaculties.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize
      ),
    [filteredFaculties, currentPage, pageSize]
  );

  useEffect(() => {
    const newTotalPages = Math.ceil(filteredFaculties.length / pageSize);
    if (currentPage > newTotalPages && newTotalPages > 0) {
      setCurrentPage(newTotalPages);
    } else if (newTotalPages === 0 && currentPage !== 1) {
      setCurrentPage(1);
    }
  }, [filteredFaculties.length, pageSize, currentPage]);

  const handlePageSizeChange = useCallback((e) => {
    setPageSize(Number(e.target.value));
  }, []);

  const handlePageChange = useCallback(
    (pageNumber) => {
      if (pageNumber >= 1 && pageNumber <= totalPages) {
        setCurrentPage(pageNumber);
      }
    },
    [totalPages]
  );

  const getPaginationRange = (currentPage, totalPages, maxPages = 5) => {
    const range = [];
    if (totalPages <= 0) return range;

    if (totalPages <= maxPages + 2) {
      for (let i = 1; i <= totalPages; i++) {
        range.push(i);
      }
    } else {
      range.push(1);
      let start = Math.max(2, currentPage - Math.floor((maxPages - 2) / 2));
      let end = Math.min(
        totalPages - 1,
        currentPage + Math.ceil((maxPages - 2) / 2) - 1
      );

      if (currentPage < maxPages - 1) {
        end = maxPages - 1;
      }
      if (currentPage > totalPages - (maxPages - 2)) {
        start = totalPages - (maxPages - 2);
      }

      if (start > 2) range.push("...");

      for (let i = start; i <= end; i++) {
        range.push(i);
      }

      if (end < totalPages - 1) range.push("...");

      range.push(totalPages);
    }

    return range;
  };

  const paginationRange = useMemo(
    () => getPaginationRange(currentPage, totalPages),
    [currentPage, totalPages]
  );

  const escapeCsvValue = (value) => {
    const stringValue =
      value === null || value === undefined ? "" : String(value);
    if (
      stringValue.includes('"') ||
      stringValue.includes(",") ||
      stringValue.includes("\n")
    ) {
      return `"${stringValue.replace(/"/g, '""')}"`;
    }
    return stringValue;
  };

  const exportFacultyData = useCallback(() => {
    if (filteredFaculties.length === 0) {
      showAlert("No data available for export.");
      return;
    }

    const dataToExport = filteredFaculties;

    try {
      if (exportFormat === "csv") {
        exportFacultyDataAsCSV(dataToExport);
      } else if (exportFormat === "excel") {
        exportFacultyDataAsExcel(dataToExport);
      } else if (exportFormat === "pdf") {
        exportFacultyDataAsPDF(dataToExport);
      } else if (exportFormat === "json") {
        exportFacultyDataAsJSON(dataToExport);
      } else if (exportFormat === "text") {
        exportFacultyDataAsText(dataToExport);
      }
      showAlert(`Exported data as ${exportFormat.toUpperCase()}.`, "success");
    } catch (error) {
      console.error("Export failed:", error);
      showAlert(
        `Failed to export data as ${exportFormat.toUpperCase()}. Error: ${
          error.message
        }`,
        "error"
      );
    }
  }, [filteredFaculties, exportFormat, showAlert]);

  const exportFacultyDataAsCSV = (data) => {
    const headers = [
      "First Name",
      "Last Name",
      "Email",
      "Gender",
      "Department",
      "Course",
      "Stream",
    ];
    const rows = data.map((faculty) => [
      escapeCsvValue(faculty?.personal_info?.first_name),
      escapeCsvValue(faculty?.personal_info?.last_name),
      escapeCsvValue(faculty?.personal_info?.email),
      escapeCsvValue(faculty?.personal_info?.gender),
      escapeCsvValue(faculty?.job_info?.department),
      escapeCsvValue(faculty?.job_info?.course),
      escapeCsvValue(faculty?.job_info?.stream),
    ]);
    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.join(",")),
    ].join("\n");

    const blob = new Blob([`\uFEFF${csvContent}`], {
      type: "text/csv;charset=utf-8;",
    });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "faculty_data.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
  };

  const exportFacultyDataAsExcel = (data) => {
    const headers = [
      "First Name",
      "Last Name",
      "Email",
      "Gender",
      "Department",
      "Course",
      "Stream",
    ];
    const rows = data.map((faculty) => [
      faculty?.personal_info?.first_name || "",
      faculty?.personal_info?.last_name || "",
      faculty?.personal_info?.email || "",
      faculty?.personal_info?.gender || "",
      faculty?.job_info?.department || "",
      faculty?.job_info?.course || "",
      faculty?.job_info?.stream || "",
    ]);

    const escapeHtml = (unsafe) => {
      if (unsafe === null || unsafe === undefined) return "";
      return String(unsafe)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
    };

    let xls = `
      <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
      <head><meta charset="UTF-8"></head>
      <body><table><thead><tr>
    `;
    headers.forEach((header) => (xls += `<th>${escapeHtml(header)}</th>`));
    xls += "</tr></thead><tbody>";

    rows.forEach((row) => {
      xls += "<tr>";
      row.forEach((cell) => {
        xls += `<td>${escapeHtml(cell)}</td>`;
      });
      xls += "</tr>";
    });
    xls += "</tbody></table></body></html>";

    const blob = new Blob([xls], { type: "application/vnd.ms-excel" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "faculty_data.xls";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
  };

  const exportFacultyDataAsPDF = (data) => {
    const doc = new jsPDF();
    doc.setFont("helvetica", "normal");

    const marginTop = 15;
    const marginBottom = 15;
    const marginLeft = 10;
    const marginRight = 10;
    const lineHeight = 7;
    const pageHeight = doc.internal.pageSize.height;
    const pageWidth = doc.internal.pageSize.width;
    const contentWidth = pageWidth - marginLeft - marginRight;

    let yPosition = marginTop;

    doc.setFontSize(14);
    doc.text("Faculty Data", marginLeft, yPosition);
    yPosition += lineHeight * 2;

    doc.setFontSize(10);

    data.forEach((faculty, index) => {
      const blockContent = [
        `Name: ${faculty?.personal_info?.first_name || ""} ${
          faculty?.personal_info?.last_name || ""
        }`,
        `Email: ${faculty?.personal_info?.email || ""}`,
        `Gender: ${faculty?.personal_info?.gender || ""}`,
        `Department: ${faculty?.job_info?.department || ""}`,
        `Course: ${faculty?.job_info?.course || ""}`,
        `Stream: ${faculty?.job_info?.stream || ""}`,
      ];

      const blockHeight = blockContent.length * lineHeight + 5;

      if (yPosition + blockHeight > pageHeight - marginBottom) {
        doc.addPage();
        yPosition = marginTop;
        doc.setFontSize(10);
      }

      blockContent.forEach((line) => {
        const splitText = doc.splitTextToSize(line, contentWidth);
        doc.text(splitText, marginLeft, yPosition);
        yPosition += splitText.length * lineHeight;
      });

      if (index < data.length - 1) {
        yPosition += 3;
        doc.setLineWidth(0.1);
        doc.line(marginLeft, yPosition, pageWidth - marginRight, yPosition);
        yPosition += 5;
      }
    });

    doc.save("faculty_data.pdf");
  };

  const exportFacultyDataAsJSON = (data) => {
    const jsonContent = JSON.stringify(
      data.map((faculty) => ({
        firstName: faculty?.personal_info?.first_name || "",
        lastName: faculty?.personal_info?.last_name || "",
        email: faculty?.personal_info?.email || "",
        gender: faculty?.personal_info?.gender || "",
        department: faculty?.job_info?.department || "",
        course: faculty?.job_info?.course || "",
        stream: faculty?.job_info?.stream || "",
      })),
      null,
      2
    );
    const blob = new Blob([jsonContent], {
      type: "application/json;charset=utf-8;",
    });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "faculty_data.json";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
  };

  const exportFacultyDataAsText = (data) => {
    const textContent = data
      .map(
        (faculty) =>
          `Name: ${faculty?.personal_info?.first_name || ""} ${
            faculty?.personal_info?.last_name || ""
          }\n` +
          `Email: ${faculty?.personal_info?.email || ""}\n` +
          `Gender: ${faculty?.personal_info?.gender || ""}\n` +
          `Department: ${faculty?.job_info?.department || ""}\n` +
          `Course: ${faculty?.job_info?.course || ""}\n` +
          `Stream: ${faculty?.job_info?.stream || ""}\n`
      )
      .join("\n---\n\n");

    const blob = new Blob([textContent], { type: "text/plain;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "faculty_data.txt";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
  };

  const courses = useMemo(
    () => collegeData?.college_courses || [],
    [collegeData]
  );
  const streams = useMemo(
    () =>
      selectedCourse
        ? courses.find((course) => course.code === selectedCourse)?.streams ||
          []
        : [],
    [selectedCourse, courses]
  );

  return (
    <Fragment>
      <AdminLayout>
        {loading && <AllLoader />}
        <div className="faculty-management">
          <div className="faculty-management__header">
            <h1 className="faculty-management__title">Faculties</h1>
            <button
              onClick={triggerRefetch}
              className="faculty-management__refresh-button"
              aria-label="Refresh faculty list"
            >
              Refresh List
            </button>
          </div>

          <div className="faculty-management__actions">
            <input
              type="search"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="faculty-management__search-bar"
              aria-label="Search faculties by name, email, department, course, or stream"
            />
            <div className="faculty-management__export-controls">
              <label htmlFor="export-format-select">Export Format:</label>
              <select
                id="export-format-select"
                value={exportFormat}
                onChange={(e) => setExportFormat(e.target.value)}
              >
                <option value="csv">CSV</option>
                <option value="excel">Excel (XLS)</option>
                <option value="pdf">PDF</option>
                <option value="json">JSON</option>
                <option value="text">Text</option>
              </select>

              <button
                onClick={exportFacultyData}
                disabled={filteredFaculties.length === 0 || loading}
              >
                Export Data
              </button>
            </div>
          </div>

          <div className="faculty-management__filters">
            <label htmlFor="course-filter-select">Course:</label>
            <select
              id="course-filter-select"
              value={selectedCourse}
              onChange={(e) => {
                setSelectedCourse(e.target.value);
                setSelectedStream("");
              }}
              aria-label="Filter by course"
            >
              <option value="">All Courses</option>
              {courses.map((course) => (
                <option key={course.code} value={course.code}>
                  {course.name} ({course.code})
                </option>
              ))}
            </select>
            <label htmlFor="stream-filter-select">Stream:</label>
            <select
              id="stream-filter-select"
              value={selectedStream}
              onChange={(e) => setSelectedStream(e.target.value)}
              aria-label="Filter by stream"
              disabled={!selectedCourse || streams.length === 0}
            >
              <option value="">All Streams</option>
              {streams.map((stream) => (
                <option key={stream} value={stream}>
                  {stream}
                </option>
              ))}
            </select>
            <label htmlFor="gender-filter-select">Gender:</label>
            <select
              id="gender-filter-select"
              value={selectedGender}
              onChange={(e) => setSelectedGender(e.target.value)}
              aria-label="Filter by gender"
            >
              <option value="">All Genders</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>

            <label className="faculty-management__checkbox-label">
              <input
                type="checkbox"
                id="bookmark-filter-checkbox"
                checked={showBookmarkedOnly}
                onChange={() => setShowBookmarkedOnly(!showBookmarkedOnly)}
              />
              Show Bookmarked Only
            </label>
            <label htmlFor="sort-by-select">Sort By:</label>
            <select
              id="sort-by-select"
              value={sortByField}
              onChange={(e) => setSortByField(e.target.value)}
              aria-label="Sort by field"
            >
              <option value="fullName">Name</option>
              <option value="email">Email</option>
              <option value="department">Department</option>
              <option value="course">Course</option>
              <option value="stream">Stream</option>
            </select>
            <label htmlFor="sort-order-select">Order:</label>
            <select
              id="sort-order-select"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              aria-label="Sort order"
            >
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>
          </div>

          <div className="faculty-management__list">
            {!loading && filteredFaculties.length === 0 ? (
              <p className="faculty-management__no-results">
                No faculties found matching your criteria.
              </p>
            ) : (
              paginatedFaculties.map((faculty) =>
                faculty?.personal_info?.email ? (
                  <FacultyIdCard
                    key={faculty.personal_info.email}
                    faculty={faculty}
                    placeholderImage={placeholderImage}
                  />
                ) : null
              )
            )}
          </div>

          {!loading && totalPages > 0 && (
            <div className="faculty-management__pagination">
              <select
                value={pageSize}
                onChange={handlePageSizeChange}
                aria-label="Faculties per page"
              >
                <option value="9">9 per page</option>
                <option value="18">18 per page</option>
                <option value="27">27 per page</option>
                <option value="36">36 per page</option>
              </select>

              <button
                onClick={() => handlePageChange(1)}
                disabled={currentPage === 1}
                aria-label="Go to first page"
              >
                &laquo; First
              </button>
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                aria-label="Go to previous page"
              >
                &lsaquo; Previous
              </button>

              {paginationRange.map((page, index) =>
                page === "..." ? (
                  <span
                    key={`ellipsis-${index}`}
                    className="pagination__ellipsis"
                  >
                    ...
                  </span>
                ) : (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`pagination__page-number ${
                      page === currentPage ? "active" : ""
                    }`}
                    disabled={page === currentPage}
                    aria-label={`Go to Page ${page}`}
                    aria-current={page === currentPage ? "page" : undefined}
                  >
                    {page}
                  </button>
                )
              )}

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                aria-label="Go to next page"
              >
                Next &rsaquo;
              </button>
              <button
                onClick={() => handlePageChange(totalPages)}
                disabled={currentPage === totalPages}
                aria-label="Go to last page"
              >
                Last &raquo;
              </button>
              <span className="pagination__info">
                Page {currentPage} of {totalPages}
              </span>
            </div>
          )}
        </div>
      </AdminLayout>
    </Fragment>
  );
}

export default Faculty;
