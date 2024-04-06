import { useEffect, useState } from "react";
import { getApplicantsByYearApi } from "@/functions";
import { Fragment } from "react";
import { AllLoader } from "@/components";

function Index() {
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <Fragment>
      {loading && <AllLoader />}
      <h1>Applicants for 2023:</h1>
      <div className="card-container">
        {Array.isArray(applicants) && applicants.length > 0 ? (
          applicants.map((applicant) => (
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
                {applicant.course_info.stream || "N/A"}
              </p>
            </div>
          ))
        ) : (
          <p>No applicants found.</p>
        )}
      </div>
    </Fragment>
  );
}

export default Index;
