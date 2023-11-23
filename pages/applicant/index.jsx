import { Fragment, useEffect, useState } from "react";
import { ApplicantLayout } from "@/layout";
import Image from "next/image";
function ApplicantDashboard() {
  const [profileData, setProfileData] = useState({});

  useEffect(() => {
    const profiledata = JSON.parse(localStorage.getItem("applicant_profile"));
    console.log(profiledata);
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
              <p className="applicant__field">course name</p>
              <p className="applicant__value">
                {profileData.course_info.course_name || "Not chosen"}
              </p>
            </div>
            <div className="applicant__data">
              <p className="applicant__field">duration</p>
              <p className="applicant__value">
                {profileData.course_info.duration || "NA"}
              </p>
            </div>
            <div className="applicant__data">
              <p className="applicant__field">stream</p>
              <p className="applicant__value">
                {profileData.course_info.stream || "Not chosen"}
              </p>
            </div>
            <div className="applicant__data">
              <p className="applicant__field">admission year</p>
              <p className="applicant__value">
                {profileData.course_info.admission_year || "NA"}
              </p>
            </div>
          </div>

          <div className="applicant__personal-details">
            <h2 className="applicant__heading">personal details</h2>
            <div className="applicant__data">
              <p className="applicant__field">full name</p>
              <p className="applicant__value">
                {`${profileData.personal_info.first_name} ${
                  profileData.personal_info.middle_name
                    ? profileData.personal_info.middle_name +
                      " " +
                      profileData.personal_info.last_name
                    : profileData.personal_info.last_name
                }` || "Not chosen"}
              </p>
            </div>
            <div className="applicant__data">
              <p className="applicant__field">gender</p>
              <p className="applicant__value">
                {profileData.personal_info.gender || "NA"}
              </p>
            </div>
            <div className="applicant__data">
              <p className="applicant__field">Date of Birth</p>
              <p className="applicant__value">
                {new Date(profileData.personal_info.dob).toLocaleDateString() || "Not chosen"}
              </p>
            </div>
            <div className="applicant__data">
              <p className="applicant__field">admission year</p>
              <p className="applicant__value">
                {profileData.personal_info.admission_year || "NA"}
              </p>
            </div>
          </div>
        </section>
      </ApplicantLayout>
    </Fragment>
  );
}

export default ApplicantDashboard;
