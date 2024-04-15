import { Fragment, useEffect, useState } from "react";
import { StudentLayout } from "@/layout";
import { fetchSingleStudent } from "@/functions";
import { AllLoader } from "@/components";

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
        {profileData && <IDCard profile={profileData.data} />}
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
        <div className="id-card-photo">
          <img src={image} alt="Student" />
        </div>
        <div className="id-card-details">
          <div className="id-card-name">
            <h2>{fullName}</h2>
          </div>
          <div className="id-card-info">
            <p>
              <strong>Gender:</strong> {gender}
            </p>
            <p>
              <strong>Date of Birth:</strong>{" "}
              {new Date(dob).toLocaleDateString()}
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
      </div>
    </div>
  );
}

export default Index;
