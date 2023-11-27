import { Fragment, useEffect, useState } from "react";
import { ApplicantLayout } from "@/layout";
import { getSingleApplicantApi } from "@/functions";

function ApplicantDashboard() {
  const [profileData, setProfileData] = useState({});

  useEffect(() => {
    const userType = localStorage.getItem("userType");
    const profiledata = JSON.parse(localStorage.getItem("applicant_profile"));

    if (process.env.NODE_ENV === "development") {
      // console.log("profileData:", profiledata);
    }

    if (userType === "applicant") {
      const applicantId = localStorage.getItem("userid");

      const fetchData = async () => {
        try {
          const response = await getSingleApplicantApi(applicantId);

          if (response.status === false) {
            alert(response.message);
            return;
          }

          if (process.env.NODE_ENV === "development") {
            console.log("Applicant Data:", response);
          }

          setProfileData(response.data);
        } catch (error) {
          if (process.env.NODE_ENV === "development") {
            console.error("Error fetching applicant data:", error.message);
          }
        }
      };

      fetchData();
    }
  }, []);

  return (
    <Fragment>
      <ApplicantLayout>
        <div>{JSON.stringify(profileData)}</div>
      </ApplicantLayout>
    </Fragment>
  );
}

export default ApplicantDashboard;
