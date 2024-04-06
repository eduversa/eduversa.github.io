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
        setApplicants(data);
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
      <p>{JSON.stringify(applicants)}</p>
    </Fragment>
  );
}

export default Index;
