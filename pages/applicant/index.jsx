import { Fragment, useEffect, useState } from "react";
import { ApplicantLayout } from "@/layout";
import Image from "next/image";
function ApplicantDashboard() {
  const [profileData, setProfileData] = useState({});

  useEffect(() => {
    const profiledata = JSON.parse(localStorage.getItem("applicant_profile"));
    console.log(profiledata)
    if (profiledata) {
      setProfileData(profiledata);
    }
  }, []);
  return (
    <Fragment>
      <ApplicantLayout>
        <section className="wrapper applicant-profile">
          <div className="applicant__image-container">
            <Image
              src={
                profileData.image
                  ? profileData.image
                  : "https://i.stack.imgur.com/l60Hf.png"
              }
              alt={"profile image"}
              // layout="fill"
              width={100}
              height={100}
              className="applicant__image-tag"
            ></Image>
            {/* {JSON.stringify(profileData)} */}
          </div>

          <div className="applicant__course-details">
            <h2 className="applicant__heading">Course details</h2>
            <div className="applicant__data">
              <p className="applicant__field"></p>
              <p className="applicant__value"></p>
            </div>
          </div>
        </section>
      </ApplicantLayout>
    </Fragment>
  );
}

export default ApplicantDashboard;
