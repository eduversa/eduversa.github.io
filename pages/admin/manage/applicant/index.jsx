import { useEffect, useState } from "react";
import { getApplicantsByYearApi } from "@/functions";
import { Fragment } from "react";
import { AllLoader } from "@/components";
import Image from "next/image";

function Index() {
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

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

  // Calculate the index of the first and last applicant to display on the current page
  const indexOfLastApplicant = currentPage * pageSize;
  const indexOfFirstApplicant = indexOfLastApplicant - pageSize;
  const currentApplicants = applicants.slice(
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

  return (
    <Fragment>
      {loading && <AllLoader />}
      <h1>Applicants for 2023:</h1>
      <div className="card-container">
        {currentApplicants.length > 0 ? (
          currentApplicants.map((applicant) => (
            <div key={applicant._id} className="card">
              <h2>{applicant.personal_info.name}</h2>
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
      <div className="pagination">
        <select value={pageSize} onChange={handleChangePageSize}>
          <option value={10}>10 per page</option>
          <option value={25}>25 per page</option>
          <option value={50}>50 per page</option>
        </select>
        <div>
          {currentPage !== 1 && (
            <button onClick={() => paginate(currentPage - 1)}>Previous</button>
          )}
          {indexOfLastApplicant < applicants.length && (
            <button onClick={() => paginate(currentPage + 1)}>Next</button>
          )}
        </div>
      </div>
    </Fragment>
  );
}

export default Index;
