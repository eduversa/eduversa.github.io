import { useEffect, useState } from "react";
import { getApplicantsByYearApi, getCollegeDetailsApi } from "@/functions";
import { Fragment } from "react";
import { AllLoader } from "@/components";
import Image from "next/image";

function Index() {
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [collegeData, setCollegeData] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedStream, setSelectedStream] = useState("");

  useEffect(() => {
    setLoading(true);
    const year = 2023;

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
  }, []);

  useEffect(() => {
    getCollegeDetailsApi(304)
      .then((data) => {
        setCollegeData(data.data);
      })
      .catch((error) => {
        console.error("Error fetching college details:", error);
      });
  }, []);

  // Calculate the index of the first and last applicant to display on the current page
  const indexOfLastApplicant = currentPage * pageSize;
  const indexOfFirstApplicant = indexOfLastApplicant - pageSize;

  // Filter applicants based on selected course and stream
  const filteredApplicants = applicants.filter((applicant) => {
    if (selectedCourse && selectedStream) {
      return (
        applicant.course_info.course_name === selectedCourse &&
        applicant.course_info.stream.includes(selectedStream)
      );
    } else if (selectedCourse) {
      return applicant.course_info.course_name === selectedCourse;
    } else {
      return true;
    }
  });

  // Sort applicants based on selected course and stream
  const sortedApplicants = filteredApplicants.sort((a, b) => {
    // Add sorting logic here based on selectedCourse and selectedStream
    // For simplicity, let's assume sorting based on the applicant's name
    if (a.personal_info.name < b.personal_info.name) {
      return -1;
    }
    if (a.personal_info.name > b.personal_info.name) {
      return 1;
    }
    return 0;
  });

  // Get current applicants to display on the current page
  const currentApplicants = sortedApplicants.slice(
    indexOfFirstApplicant,
    indexOfLastApplicant
  );

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Change number of cards per page
  const handleChangePageSize = (event) => {
    setPageSize(Number(event.target.value));
    setCurrentPage(1); // Reset to first page when changing page size
  };

  // Handle course selection change
  const handleCourseChange = (event) => {
    setSelectedCourse(event.target.value);
    setSelectedStream(""); // Reset stream selection when course changes
  };

  // Handle stream selection change
  const handleStreamChange = (event) => {
    setSelectedStream(event.target.value);
  };

  return (
    <Fragment>
      {loading && <AllLoader />}
      <h1>Applicants for 2023:</h1>
      <div>
        <label htmlFor="course">Select Course:</label>
        <select
          id="course"
          value={selectedCourse}
          onChange={handleCourseChange}
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
            <label htmlFor="stream">Select Stream:</label>
            <select
              id="stream"
              value={selectedStream}
              onChange={handleStreamChange}
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
      <div className="card-container">
        {currentApplicants.length > 0 ? (
          currentApplicants.map((applicant) => (
            <div key={applicant._id} className="card">
              <h2>
                {applicant.personal_info.first_name +
                  " " +
                  applicant.personal_info.last_name}
              </h2>
              <p>
                <strong>Enrollment Number:</strong> {applicant.user_id}
              </p>
              <p>
                <strong>Course Applied:</strong>{" "}
                {applicant.course_info.course_name || "N/A"}
              </p>
              <p>
                <strong>Streams Applied:</strong>{" "}
                {Array.isArray(applicant.course_info.stream)
                  ? applicant.course_info.stream.join(", ")
                  : "N/A"}
              </p>
              {applicant.image ? (
                <Image
                  src={applicant.image}
                  alt={`Image of ${applicant.personal_info.name}`}
                  height={100}
                  width={100}
                />
              ) : (
                <Image
                  src="/default-image.jpg"
                  alt={`Image not available`}
                  height={100}
                  width={100}
                />
              )}
            </div>
          ))
        ) : (
          <p>No applicants found.</p>
        )}
      </div>
      <div>
        <select value={pageSize} onChange={handleChangePageSize}>
          <option value={10}>10 cards per page</option>
          <option value={25}>25 cards per page</option>
          <option value={50}>50 cards per page</option>
        </select>
      </div>
      <div>
        <ul className="pagination">
          {Array.from({
            length: Math.ceil(filteredApplicants.length / pageSize),
          }).map((_, index) => (
            <li key={index} className="page-item">
              <button className="page-link" onClick={() => paginate(index + 1)}>
                {index + 1}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </Fragment>
  );
}

export default Index;
