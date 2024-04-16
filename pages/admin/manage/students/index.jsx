import { useEffect, useState, Fragment } from "react";
import {
  getAllStudentsApi,
  getCollegeDetailsApi,
  deleteSingleStudent,
} from "@/functions";
import { AllLoader, IdCard } from "@/components";
import Image from "next/image";
import { AdminLayout } from "@/layout";
import { useRouter } from "next/router";

function ManageStudents() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(9);
  const [collegeData, setCollegeData] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedStream, setSelectedStream] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const currentYear = new Date().getFullYear();
  const router = useRouter();

  useEffect(() => {
    setLoading(true);
    getAllStudentsApi()
      .then((data) => {
        if (Array.isArray(data.data)) {
          setStudents(data.data);
        } else {
          console.error("Students data is not an array:", data.data);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching students:", error);
        setLoading(false);
      });
  }, [currentYear]);

  useEffect(() => {
    getCollegeDetailsApi(304)
      .then((data) => {
        setCollegeData(data.data);
      })
      .catch((error) => {
        console.error("Error fetching college details:", error);
      });
  }, []);

  const indexOfLastStudent = currentPage * pageSize;
  const indexOfFirstStudent = indexOfLastStudent - pageSize;

  const filteredStudents = students.filter((student) => {
    const fullName = `${student.personal_info.first_name} ${student.personal_info.last_name}`;
    return (
      (!searchTerm ||
        fullName.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (!selectedCourse || student.course_info.course_name === selectedCourse) &&
      (!selectedStream ||
        (student.course_info.stream &&
          student.course_info.stream.includes(selectedStream))) &&
      (!selectedYear || student.course_info.current_year === selectedYear)
    );
  });

  const sortedStudents = filteredStudents.sort((a, b) => {
    const fullNameA = `${a.personal_info.first_name} ${a.personal_info.last_name}`;
    const fullNameB = `${b.personal_info.first_name} ${b.personal_info.last_name}`;
    return fullNameA.localeCompare(fullNameB);
  });

  const currentStudents = sortedStudents.slice(
    indexOfFirstStudent,
    indexOfLastStudent
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleChangePageSize = (event) => {
    setPageSize(Number(event.target.value));
    setCurrentPage(1);
  };

  const handleCourseChange = (event) => {
    setSelectedCourse(event.target.value);
    setSelectedStream("");
  };

  const handleStreamChange = (event) => {
    setSelectedStream(event.target.value);
  };

  const handleYearChange = (event) => {
    setSelectedYear(event.target.value);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  return (
    <Fragment>
      <AdminLayout>
        {loading && <AllLoader />}
        <div className="manage-student-container">
          <h1 className="title">Students of Eduversa:</h1>
          <div className="filters">
            <input
              type="text"
              placeholder="Search by name"
              value={searchTerm}
              onChange={handleSearchChange}
              className="search-input"
            />
            <div className="dropdown-container">
              <label htmlFor="course" className="filter-label">
                Select Course:
              </label>
              <select
                id="course"
                value={selectedCourse}
                onChange={handleCourseChange}
                className="filter-select"
              >
                <option value="">All Courses</option>
                {collegeData &&
                  collegeData.college_courses.map((course) => (
                    <option key={course.code} value={course.name}>
                      {course.name}
                    </option>
                  ))}
              </select>
              {selectedCourse && (
                <Fragment>
                  <label htmlFor="stream" className="filter-label">
                    Select Stream:
                  </label>
                  <select
                    id="stream"
                    value={selectedStream}
                    onChange={handleStreamChange}
                    className="filter-select"
                  >
                    <option value="">All Streams</option>
                    {collegeData &&
                      collegeData.college_courses
                        .find((course) => course.name === selectedCourse)
                        ?.streams.map((stream) => (
                          <option key={stream._id} value={stream.name}>
                            {stream.name}
                          </option>
                        ))}
                  </select>
                </Fragment>
              )}
              <label htmlFor="year" className="filter-label">
                Select Year:
              </label>
              <select
                id="year"
                value={selectedYear}
                onChange={handleYearChange}
                className="filter-select"
              >
                <option value="">All Years</option>
                <option value="1">First Year</option>
                <option value="2">Second Year</option>
                <option value="3">Third Year</option>
                <option value="4">Fourth Year</option>
              </select>
            </div>
          </div>
          <div className="card-container">
            {currentStudents.length > 0 ? (
              currentStudents.map((student) => (
                <IdCard
                  key={JSON.stringify(student)}
                  profile={student}
                  page={"manage-students"}
                ></IdCard>
              ))
            ) : (
              <p className="no-students">No students found.</p>
            )}
          </div>
          <div className="page-management">
            <div className="page-size-select">
              <select
                value={pageSize}
                onChange={handleChangePageSize}
                className="select-pagesize"
              >
                <option value={9}>9 cards per page</option>
                <option value={24}>24 cards per page</option>
                <option value={50}>50 cards per page</option>
              </select>
            </div>
            <div className="pagination">
              <ul className="pagination-list">
                {Array.from({
                  length: Math.ceil(filteredStudents.length / pageSize),
                }).map((_, index) => (
                  <li
                    key={index}
                    className={`pagination-item ${
                      currentPage === index + 1 ? "active" : ""
                    }`}
                  >
                    <button
                      className="pagination-link"
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

export default ManageStudents;
