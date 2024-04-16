import { useEffect, useState, Fragment } from "react";
import {
  getAllStudentsApi,
  getCollegeDetailsApi,
  deleteSinglestudentApi,
} from "@/functions";
import { AllLoader } from "@/components";
import Image from "next/image";
import { AdminLayout } from "@/layout";
import { useRouter } from "next/router";

function Index() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(9);
  const [collegeData, setCollegeData] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedStream, setSelectedStream] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();

  useEffect(() => {
    setLoading(true);
    getAllStudentsApi()
      .then((data) => {
        if (Array.isArray(data.data)) {
          setStudents(data.data);
        } else {
          console.error("students data is not an array:", data.data);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching students:", error);
        setLoading(false);
      });

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
          student.course_info.stream.includes(selectedStream)))
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

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  function handleShowProfile(id) {
    console.log("Show profile for student with id:", id);
    localStorage.setItem("selected-studentId", id);
    console.log(localStorage.getItem("selected-studentId"));
    router.push("/admin/manage/students/profile");
  }

  async function handleDeleteStudent(id) {
    console.log("Delete student with id:", id);
    localStorage.setItem("selected-studentId", id);
    const confirmDelete = confirm(
      "Are you sure you want to delete this student?"
    );

    if (confirmDelete) {
      try {
        setLoading(true);
        await deleteSinglestudentApi(id);
        setLoading(false);
        setStudents(students.filter((student) => student.user_id !== id));
      } catch (error) {
        console.error("Error deleting student:", error);
        setLoading(false);
        alert("Error deleting student. Please try again.");
      }
    }
  }
  useEffect(() => {
    console.log("Selected Course:", selectedCourse);
    console.log("Selected Stream:", selectedStream);
    console.log("Filtered Students:", filteredStudents);
  }, [selectedCourse, selectedStream, filteredStudents]);
  return (
    <Fragment>
      <AdminLayout>
        {loading && <AllLoader />}
        <div className="manage-student-container">
          <h1 className="title">Students of UEM</h1>
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
            </div>
          </div>
          <div className="card-container">
            {currentStudents.length > 0 ? (
              currentStudents.map((student) => (
                <div key={student._id} className="card">
                  <h2 className="card-title">
                    {student.personal_info.first_name}{" "}
                    {student.personal_info.last_name}
                  </h2>
                  {student.image ? (
                    <Image
                      src={student.image}
                      alt={`Image of ${student.personal_info.name}`}
                      height={100}
                      width={100}
                      className="student-image"
                    />
                  ) : (
                    <Image
                      src="/default-image.jpg"
                      alt={`Image not available`}
                      height={100}
                      width={100}
                      className="student-image"
                    />
                  )}
                  <p className="course-applied">
                    <strong>Course Applied:</strong>{" "}
                    {student.course_info.course_name || "N/A"}
                  </p>
                  <p className="streams-applied">
                    <strong>Streams Applied:</strong>{" "}
                    {student.course_info.stream || "N/A"}
                  </p>
                  <div className="button-container">
                    <button
                      onClick={() => handleDeleteStudent(student.user_id)}
                      className="delete-button"
                    >
                      Delete student
                    </button>
                    <button
                      onClick={() => handleShowProfile(student.user_id)}
                      className="profile-button"
                    >
                      Show Profile
                    </button>
                  </div>
                </div>
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

export default Index;
