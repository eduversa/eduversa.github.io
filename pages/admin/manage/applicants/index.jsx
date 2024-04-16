import { useEffect, useState, Fragment } from "react";
import {
  getApplicantsByYearApi,
  getCollegeDetailsApi,
  deleteSingleApplicantApi,
} from "@/functions";
import { AllLoader } from "@/components";
import Image from "next/image";
import { AdminLayout } from "@/layout";
import { useRouter } from "next/router";

function Index() {
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(9);
  const [collegeData, setCollegeData] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedStream, setSelectedStream] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const year = new Date().getFullYear();
  const router = useRouter();
  useEffect(() => {
    setLoading(true);
    getApplicantsByYearApi(year)
      .then((data) => {
        if (Array.isArray(data.data)) {
          setApplicants(data.data);
        } else {
          console.error("Applicants data is not an array:", data.data);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching applicants:", error);
        setLoading(false);
      });
  }, [year]);

  useEffect(() => {
    getCollegeDetailsApi(304)
      .then((data) => {
        setCollegeData(data.data);
      })
      .catch((error) => {
        console.error("Error fetching college details:", error);
      });
  }, []);

  const indexOfLastApplicant = currentPage * pageSize;
  const indexOfFirstApplicant = indexOfLastApplicant - pageSize;

  const filteredApplicants = applicants.filter((applicant) => {
    const fullName = `${applicant.personal_info.first_name} ${applicant.personal_info.last_name}`;
    return (
      (!searchTerm ||
        fullName.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (!selectedCourse ||
        applicant.course_info.course_name === selectedCourse) &&
      (!selectedStream ||
        (applicant.course_info.stream &&
          applicant.course_info.stream.includes(selectedStream))) &&
      (!submitted || applicant.personal_info.are_addresses_same === true)
    );
  });

  const sortedApplicants = filteredApplicants.sort((a, b) => {
    const fullNameA = `${a.personal_info.first_name} ${a.personal_info.last_name}`;
    const fullNameB = `${b.personal_info.first_name} ${b.personal_info.last_name}`;
    return fullNameA.localeCompare(fullNameB);
  });

  const currentApplicants = sortedApplicants.slice(
    indexOfFirstApplicant,
    indexOfLastApplicant
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

  const handleCheckboxChange = (event) => {
    setSubmitted(event.target.checked);
    if (event.target.checked) {
      const filteredApplicants = applicants.filter(
        (applicant) => applicant.is_completely_filled === true
      );
      setApplicants(filteredApplicants);
    } else {
      getApplicantsByYearApi()
        .then((data) => {
          if (Array.isArray(data.data)) {
            setApplicants(data.data);
          } else {
            console.error("Applicants data is not an array:", data.data);
          }
        })
        .catch((error) => {
          console.error("Error fetching applicants:", error);
        });
    }
  };
  function handleShowProfile(id) {
    console.log("Show profile for applicant with id:", id);
    localStorage.setItem("selected-applicantId", id);
    console.log(localStorage.getItem("selected-applicantId"));
    router.push("/admin/manage/applicants/profile");
  }
  async function handleDeleteApplicant(id) {
    console.log("Delete applicant with id:", id);
    localStorage.setItem("selected-applicantId", id);
    const confirmDelete = confirm(
      "Are you sure you want to delete this applicant?"
    );

    if (confirmDelete) {
      try {
        setLoading(true);
        await deleteSingleApplicantApi(id);
        setLoading(false);
        window.location.reload();
      } catch (error) {
        console.error("Error deleting applicant:", error);
        setLoading(false);
        alert("Error deleting applicant. Please try again.");
      }
    }
  }

  return (
    <Fragment>
      <AdminLayout>
        {loading && <AllLoader />}
        <div className="manage-applicant-container">
          <h1 className="title">Applicants for {year}:</h1>
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
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={submitted}
                onChange={handleCheckboxChange}
                className="checkbox-input"
              />
              Submitted
            </label>
          </div>
          <div className="card-container">
            {currentApplicants.length > 0 ? (
              currentApplicants.map((applicant) => (
                <div key={applicant._id} className="card">
                  <h2 className="card-title">
                    {applicant.personal_info.first_name}{" "}
                    {applicant.personal_info.last_name}
                  </h2>
                  {applicant.image ? (
                    <Image
                      src={applicant.image}
                      alt={`Image of ${applicant.personal_info.name}`}
                      height={100}
                      width={100}
                      className="applicant-image"
                    />
                  ) : (
                    <Image
                      src="/user.png"
                      alt={`Image not available`}
                      height={100}
                      width={100}
                      className="applicant-image default-image"
                    />
                  )}
                  <p className="course-applied">
                    <strong>Course Applied:</strong>
                    {applicant.course_info.course_name || "N/A"}
                  </p>
                  <p className="streams-applied">
                    <strong>Streams Applied:</strong>
                    {applicant.course_info.stream || "N/A"}
                  </p>

                  <div className="button-container">
                    <button
                      onClick={() => handleDeleteApplicant(applicant.user_id)}
                      className="delete-button"
                    >
                      <Image
                        src="/applicant/delete.png"
                        alt="delete"
                        height={20}
                        width={20}
                      ></Image>
                    </button>
                    <button
                      onClick={() => handleShowProfile(applicant.user_id)}
                      className="profile-button"
                    >
                      <Image
                        src="/applicant/search.png"
                        alt="profile"
                        height={20}
                        width={20}
                      ></Image>
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="no-applicants">No applicants found.</p>
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
                  length: Math.ceil(filteredApplicants.length / pageSize),
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
