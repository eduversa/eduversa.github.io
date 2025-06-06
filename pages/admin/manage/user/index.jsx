import { useEffect, useState, Fragment, useMemo, useCallback } from "react";
import { AdminLayout } from "@/layout";
import { AllLoader } from "@/components";
import { useAlert } from "@/contexts/AlertContext";
import { withLoading, devLog, apiRequest } from "@/utils/apiUtils";
import { UserCard } from "@/components";
import jsPDF from "jspdf";

function User() {
  const [users, setUsers] = useState([]);
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
  const { showAlert } = useAlert();
  const year = new Date().getFullYear();
  const [userType, setUserType] = useState("applicant");
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const userTypes = ["applicant", "faculty", "student"];

  const handleUserTypeChange = (type) => {
    setUserType(type);
    setDropdownVisible(false);
  };

  useEffect(() => {
    if (debouncedQuery !== searchQuery) {
      const handler = setTimeout(() => setDebouncedQuery(searchQuery), 300);
      return () => clearTimeout(handler);
    }
  }, [searchQuery, debouncedQuery]);

  useEffect(() => {
    setCurrentPage(1);
  }, [
    users,
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
        let userResponse;

        if (userType === "faculty") {
          userResponse = await wrappedApiRequest(
            `/faculty/all`,
            "GET",
            null,
            authToken
          );
        } else if (userType === "applicant") {
          userResponse = await wrappedApiRequest(
            `/applicant/year?year=${year}`,
            "GET",
            null,
            authToken
          );
        } else if (userType === "student") {
          userResponse = await wrappedApiRequest(
            `/student/find/all`,
            "GET",
            null,
            authToken
          );
        }

        if (!userResponse.success) {
          devLog("Error fetching users:", userResponse.message);
          showAlert(userResponse.message || "Error fetching users.");
          return;
        }
        setUsers(userResponse.data.data);

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
          return;
        }
        setCollegeData(collegeResponse.data.data);
      } catch (error) {
        devLog("Error fetching data:", error.message);
        showAlert(error.message || "Failed to fetch data.");
      }
    };

    fetchData();
  }, [userType, showAlert, year]);

  const filteredUsers = useMemo(() => {
    if (typeof window === "undefined") {
      return users;
    }

    const bookmarks = JSON.parse(localStorage.getItem("bookmarkedUser")) || [];

    const result = users
      .filter((user) => {
        const firstName = (user?.personal_info?.first_name || "").toLowerCase();
        const lastName = (user?.personal_info?.last_name || "").toLowerCase();
        const fullName = `${firstName} ${lastName}`;
        const email = (user?.personal_info?.email || "").toLowerCase();
        const gender = (user?.personal_info?.gender || "").toLowerCase();
        const department = (user?.job_info?.department || "").toLowerCase();
        const course = (user?.job_info?.course || "").toLowerCase();
        const stream = (user?.job_info?.stream || "").toLowerCase();

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
      })
      .filter((user) => {
        if (showBookmarkedOnly) {
          return bookmarks.includes(user?.personal_info?.email);
        }
        return true;
      })
      .sort((a, b) => {
        const isBookmarkedA = bookmarks.includes(a?.personal_info?.email);
        const isBookmarkedB = bookmarks.includes(b?.personal_info?.email);

        if (isBookmarkedA && !isBookmarkedB) return -1;
        if (!isBookmarkedA && isBookmarkedB) return 1;

        let aValue = "";
        let bValue = "";

        if (sortByField === "fullName") {
          aValue = `${a?.personal_info?.first_name || ""} ${
            a?.personal_info?.last_name || ""
          }`;
          bValue = `${b?.personal_info?.first_name || ""} ${
            b?.personal_info?.last_name || ""
          }`;
        } else {
          const getField = (obj, field) =>
            field.split(".").reduce((o, f) => o?.[f], obj);
          aValue = getField(a, `personal_info.${sortByField}`) || "";
          bValue = getField(b, `personal_info.${sortByField}`) || "";
        }

        aValue = aValue.toString().toLowerCase();
        bValue = bValue.toString().toLowerCase();

        return sortOrder === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      });

    return result;
  }, [
    users,
    debouncedQuery,
    selectedGender,
    showBookmarkedOnly,
    sortByField,
    sortOrder,
  ]);

  const totalPages = Math.ceil(filteredUsers.length / pageSize);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  useEffect(() => {
    if (totalPages > 0 && currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [totalPages, currentPage]);

  const handlePageSizeChange = useCallback((e) => {
    setPageSize(Number(e.target.value));
    setCurrentPage(1);
  }, []);

  const handlePageChange = useCallback(
    (pageNumber) => setCurrentPage(pageNumber),
    []
  );

  const getPaginationRange = (currentPage, totalPages, maxPages = 5) => {
    const range = [];
    range.push(1);

    if (currentPage - 2 > 2) range.push("...");

    for (
      let i = Math.max(2, currentPage - 2);
      i <= Math.min(totalPages - 1, currentPage + 2);
      i++
    ) {
      range.push(i);
    }

    if (currentPage + 2 < totalPages - 1) range.push("...");

    if (totalPages > 1) range.push(totalPages);

    return range;
  };
  const paginationRange = getPaginationRange(currentPage, totalPages);

  const exportUserData = () => {
    if (users.length === 0) {
      showAlert("No data available for export.");
      return;
    }

    const dataToExport = filteredUsers.length > 0 ? filteredUsers : users;

    if (exportFormat === "csv") {
      exportUserDataAsCSV(dataToExport);
    } else if (exportFormat === "excel") {
      exportUserDataAsExcel(dataToExport);
    } else if (exportFormat === "pdf") {
      exportUserDataAsPDF(dataToExport);
    } else if (exportFormat === "json") {
      exportUserDataAsJSON(dataToExport);
    } else if (exportFormat === "text") {
      exportUserDataAsText(dataToExport);
    }
  };

  const exportUserDataAsCSV = (data) => {
    const headers = [
      "First Name",
      "Last Name",
      "Email",
      "Gender",
      "Department",
      "Course",
      "Stream",
    ];
    const rows = data.map((user) => [
      `"${user?.personal_info?.first_name || ""}"`,
      `"${user?.personal_info?.last_name || ""}"`,
      `"${user?.personal_info?.email || ""}"`,
      `"${user?.personal_info?.gender || ""}"`,
      `"${user?.job_info?.department || ""}"`,
      `"${user?.job_info?.course || ""}"`,
      `"${user?.job_info?.stream || ""}"`,
    ]);
    const csvContent = [headers, ...rows]
      .map((row) => row.join(","))
      .join("\n");
    const csvBlob = new Blob([csvContent], {
      type: "text/csv;charset=utf-8;",
    });
    const csvUrl = URL.createObjectURL(csvBlob);
    const link = document.createElement("a");
    link.setAttribute("href", csvUrl);
    link.setAttribute("download", `users_${Date.now()}.csv`);
    link.click();
  };

  const exportUserDataAsExcel = (data) => {
    const headers = [
      [
        "First Name",
        "Last Name",
        "Email",
        "Gender",
        "Department",
        "Course",
        "Stream",
      ],
    ];
    const rows = data.map((user) => [
      user?.personal_info?.first_name || "",
      user?.personal_info?.last_name || "",
      user?.personal_info?.email || "",
      user?.personal_info?.gender || "",
      user?.job_info?.department || "",
      user?.job_info?.course || "",
      user?.job_info?.stream || "",
    ]);
    let excelContent = headers.concat(rows);
    let xls = "<table>";

    excelContent.forEach((row) => {
      xls += "<tr>";
      row.forEach((cell) => {
        xls += `<td>${cell}</td>`;
      });
      xls += "</tr>";
    });
    xls += "</table>";

    const blob = new Blob([xls], { type: "application/vnd.ms-excel" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${userType}_${Date.now()}.xlsx`;
    link.click();
  };

  const exportUserDataAsPDF = (data) => {
    const pdf = new jsPDF();

    const headers = [
      [
        "First Name",
        "Last Name",
        "Email",
        "Gender",
        "Department",
        "Course",
        "Stream",
      ],
    ];
    const rows = data.map((user) => [
      user?.personal_info?.first_name || "",
      user?.personal_info?.last_name || "",
      user?.personal_info?.email || "",
      user?.personal_info?.gender || "",
      user?.job_info?.department || "",
      user?.job_info?.course || "",
      user?.job_info?.stream || "",
    ]);

    pdf.text("User Data", 10, 10);
    pdf.autoTable({
      head: headers,
      body: rows,
      startY: 20,
      theme: "striped",
    });

    pdf.save(`users_${Date.now()}.pdf`);
  };

  const exportUserDataAsJSON = (data) => {
    const jsonContent = JSON.stringify(data, null, 2);
    const jsonBlob = new Blob([jsonContent], {
      type: "application/json",
    });
    const jsonUrl = URL.createObjectURL(jsonBlob);

    const link = document.createElement("a");
    link.href = jsonUrl;
    link.download = `users_${Date.now()}.json`;
    link.click();
  };

  const exportUserDataAsText = (data) => {
    const headers =
      "First Name\tLast Name\tEmail\tGender\tDepartment\tCourse\tStream\n";
    const rows = data
      .map((user) =>
        [
          user?.personal_info?.first_name || "",
          user?.personal_info?.last_name || "",
          user?.personal_info?.email || "",
          user?.personal_info?.gender || "",
          user?.job_info?.department || "",
          user?.job_info?.course || "",
          user?.job_info?.stream || "",
        ].join("\t")
      )
      .join("\n");

    const textContent = headers + rows;
    const textBlob = new Blob([textContent], {
      type: "text/plain",
    });
    const textUrl = URL.createObjectURL(textBlob);

    const link = document.createElement("a");
    link.href = textUrl;
    link.download = `users_${Date.now()}.txt`;
    link.click();
  };

  const courses = collegeData?.college_courses || [];
  const streams = selectedCourse
    ? courses.find((course) => course.code === selectedCourse)?.streams || []
    : [];

  return (
    <Fragment>
      <AdminLayout>
        {loading && <AllLoader />}
        <div className="user-management">
          <div
            className="user-management__heading"
            onClick={() => setDropdownVisible(!dropdownVisible)}
            aria-expanded={dropdownVisible}
            role="button"
            tabIndex="0"
          >
            {userType.charAt(0).toUpperCase() + userType.slice(1)} Management
            <span className="user-management__arrow">
              {dropdownVisible ? "▲" : "▼"}
            </span>
          </div>

          {dropdownVisible && (
            <ul className="user-management__dropdown">
              {userTypes.map((type) => (
                <li
                  key={type}
                  className={`user-management__option ${
                    type === userType ? "active" : ""
                  }`}
                  onClick={() => handleUserTypeChange(type)}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </li>
              ))}
            </ul>
          )}
          <div className="user-management__button">
            <button>
              Add {userType.charAt(0).toUpperCase() + userType.slice(1)}
            </button>
          </div>

          <div className="user-management__actions">
            <input
              type="text"
              placeholder={`Search ${userType}s by name or email...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="user-management__search-bar"
            />
            <div>
              <select
                value={exportFormat}
                onChange={(e) => setExportFormat(e.target.value)}
              >
                <option value="csv">CSV</option>
                <option value="excel">Excel</option>
                <option value="pdf">PDF</option>
                <option value="json">JSON</option>
                <option value="text">Text</option>
              </select>

              <button onClick={exportUserData}>
                Export Data as {exportFormat.toUpperCase()}
              </button>
            </div>
          </div>

          <div className="user-management__filters">
            <select
              value={selectedCourse}
              onChange={(e) => {
                setSelectedCourse(e.target.value);
                setSelectedStream("");
              }}
              aria-label={`Filter ${userType}s by course`}
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
              aria-label={`Filter ${userType}s by stream`}
              disabled={!selectedCourse}
            >
              <option value="">Select Stream</option>
              {streams.map((stream) => (
                <option key={stream._id} value={stream._id}>
                  {stream.name}
                </option>
              ))}
            </select>

            <select
              value={selectedGender}
              onChange={(e) => setSelectedGender(e.target.value)}
              aria-label={`Filter ${userType}s by gender`}
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

            <select
              value={sortByField}
              onChange={(e) => setSortByField(e.target.value)}
              aria-label={`Sort ${userType}s by field`}
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
              aria-label={`Sort ${userType}s in order`}
            >
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>
          </div>

          <div className="user-management__user-cards">
            {paginatedUsers.map((user) => (
              <UserCard
                key={user?.personal_info?.email}
                user={user}
                userType={userType}
              />
            ))}
          </div>

          <div className="faculty-management__pagination">
            <select
              value={pageSize}
              onChange={handlePageSizeChange}
              aria-label="Page size"
            >
              <option value="5">5 per page</option>
              <option value="10">10 per page</option>
              <option value="15">15 per page</option>
            </select>

            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </button>

            {paginationRange.map((page, index) => (
              <button
                key={index}
                onClick={() => handlePageChange(page)}
                disabled={page === currentPage || page === "..."}
                aria-label={`Page ${page}`}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        </div>
      </AdminLayout>
    </Fragment>
  );
}

export default User;
