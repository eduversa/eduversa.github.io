import { Fragment, useEffect, useState } from "react";
import { StudentLayout } from "@/layout";
import { fetchSingleStudent } from "@/functions";
import { AllLoader } from "@/components";
import Image from "next/image";
function Index() {
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState(null);

  useEffect(() => {
    const userType = localStorage.getItem("userType");

    if (userType === "student") {
      const studentId = localStorage.getItem("userid");

      const fetchData = async () => {
        try {
          setLoading(true);
          const response = await fetchSingleStudent(studentId);

          if (!response || response.error) {
            console.error("Error fetching student data:", response?.error);
            setLoading(false);
            return;
          }

          setProfileData(response);
          setLoading(false);
        } catch (error) {
          console.error("Error fetching student data:", error.message);
          setLoading(false);
        }
      };

      fetchData();
    }
  }, []);

  return (
    <Fragment>
      {loading && <AllLoader />}
      <StudentLayout>
        <div className="right-side">
          {profileData && <IDCard profile={profileData.data} />}
        </div>
      </StudentLayout>
    </Fragment>
  );
}

function IDCard({ profile }) {
  const {
    personal_info: {
      first_name,
      last_name,
      gender,
      dob,
      email,
      contact,
      blood_group,
    },
    course_info: { course_name, section, stream, enrollment_number },
    image,
  } = profile;

  const fullName = [first_name, last_name].join(" ");

  return (
    <div className="id-card">
      <div className="id-card-header">
        <div className="id-card-name">
          <h2>{fullName}</h2>
        </div>
      </div>
      <div className="id-card-details">
        <div className="id-left-side">
          <div className="top">
            <div className="id-card-photo">
              <Image
                src={image}
                alt={fullName}
                width={100}
                height={100}
              ></Image>
            </div>
          </div>
          <div className="bottom">
            <p>
              <strong>Course:</strong> {course_name}
            </p>
            <p>
              <strong>Section:</strong> {section}
            </p>
            <p>
              <strong>Stream:</strong> {stream}
            </p>
            <p>
              <strong>Enrollment Number:</strong> {enrollment_number}
            </p>
          </div>
        </div>
        <div className="id-right-side">
          <p>
            <strong>Gender:</strong> {gender}
          </p>
          <p>
            <strong>Date of Birth:</strong> {new Date(dob).toLocaleDateString()}
          </p>
          <p>
            <strong>Email:</strong> {email}
          </p>
          <p>
            <strong>Contact:</strong> {contact}
          </p>
          <p>
            <strong>Blood Group:</strong> {blood_group}
          </p>
        </div>
      </div>
    </div>
  );
}

export default Index;
