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
    <div class="id-card--container" id="container">
      <div class="id-card id-card__side" id="id-card__front">
        <div class="id-card__college bg--blue">
          <div class="id-card__college__logo"></div>
          <div class="id-card__college__details">
            <div class="id-card__college__name">
              university of engineering & management
            </div>
            <div class="id-card__college__address">
              Plot No - III-B/5, New Town <br />
              Action Area - III, Newtown, Kolkata - 700160
            </div>
            <div class="id-card__college__contact">
              Ph: 033 2357 2059 | Email: admissions@iemcal.com
            </div>
          </div>
        </div>
        <div class="id-card__body bg--white">
          <div class="id-card__body__left">
            <div class="id-card__body__image" id="id-card-body-image">
              <img class="id-card__body__qr-code" id="id-card__qr-code" />
            </div>
          </div>
          <div class="id-card__body__right">
            <div class="id-card__body__course">
              <p class="content" id="stream"></p>
              <p class="title">student</p>
            </div>
            <div class="id-card__body__dob">
              <p class="content" id="dob"></p>
              <p class="title" id="blood_group">
                A+
              </p>
            </div>
            <div class="id-card__body__name">
              <p class="content" id="full_name"></p>
              <p class="title">name</p>
            </div>
            <div class="id-card__body__blood-group">
              <p class="content" id="registration_number"></p>
              <p class="title">Reistration No</p>
            </div>
            <div class="id-card__body__contact">
              <p class="content" id="contact_no"></p>
              <p class="title">contact</p>
            </div>
            <div class="id-card__body__enroll">
              <p class="content" id="enrollment_number"></p>
              <p class="title">enrollment no</p>
            </div>
            <div class="id-card__body__address">
              <p class="content" id="permanent_address"></p>
              <p class="title">address</p>
            </div>
          </div>
        </div>
        <div class="id-card__sign bg--blue">
          <div class="id-card__sign__image"></div>
        </div>
        <div class="id-card__footer bg--blue"></div>
      </div>

      <div class="id-card id-card__side" id="id-card__back">
        <img class="id-card__back__qrcode" id="id-card__qr-code--back" />
      </div>
    </div>
  );
}

export default Index;
