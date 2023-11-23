import { Fragment, useEffect, useState } from "react";
import { ApplicantLayout } from "@/layout";
import Image from "next/image";
function ApplicantDashboard() {
  const [profileData, setProfileData] = useState({})

  useEffect(()=>{
    const profiledata = JSON.parse(localStorage.getItem("applicant_profile"))
    if(profiledata){
      setProfileData(profiledata)
    }
  },[])
  return (
    <Fragment>
      <ApplicantLayout>
        <section className="wrapper applicant-profile">
          <div className="applicant__image-container">
            {/* <Image src></Image> */}
            {JSON.stringify(profileData)}
          </div>
        </section>
      </ApplicantLayout>
    </Fragment>
  );
}

export default ApplicantDashboard;
