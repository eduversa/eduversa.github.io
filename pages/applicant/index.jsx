import { Fragment, useEffect, useState } from "react";
import { ApplicantLayout } from "@/layout";
import Image from "next/image";
function ApplicantDashboard() {
  const [profileData, setProfileData] = useState({});

  useEffect(() => {
    const profiledata = JSON.parse(localStorage.getItem("applicant_profile"));
    console.log("profileData:", profiledata);
    if (profiledata) {
      setProfileData(profiledata);
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
