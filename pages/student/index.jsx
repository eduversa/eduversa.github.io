import { Fragment, useEffect, useState } from "react";
import { StudentLayout } from "@/layout";
import { fetchSingleStudent } from "@/functions";
import { AllLoader } from "@/components";
import Image from "next/image";

import logoNoBG from "/public/icons/logo-no-bg.png";
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
          localStorage.setItem(
            "eduversa_studentdata",
            JSON.stringify(response)
          );
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
        <section className="dashboard">
          <div className="dashboard__left dashboard__column"></div>
          <div className="dashboard__right dashboard__column">
            {profileData && <IDCard profile={profileData.data} />}
          </div>
        </section>
        {/* <div className="right-side"></div> */}
      </StudentLayout>
      <div>{JSON.stringify(profileData)}</div>
    </Fragment>
  );
}

function IDCard({ profile }) {
  const [qrCodeData, setQrCodeData] = useState(undefined);
  useEffect(() => {
    const image = document.getElementById("id-card-body-image");
    image.style.backgroundImage = `url(${profile.image})`;

    setQrCodeData(
      JSON.stringify({
        type: "security_token",
        data: { security_token: localStorage.getItem("security_token") },
      })
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const showQrCode = () => {
    // alert("zhsa");
    const frontSide = document.getElementById("id-card__front");
    const backSide = document.getElementById("id-card__back");
    // frontSide.style.transform = "rotateY(0deg)";
    // frontSide.style.zIndex = "1";
    // backSide.style.transform = "rotateY(-180deg)";
    // backSide.style.zIndex = "0";
    frontSide.style.transform = "rotateY(-180deg)";
    frontSide.style.zIndex = "0";
    backSide.style.transform = "rotateY(-360deg)";
    backSide.style.zIndex = "1";
  };
  const hideQrCode = () => {
    // alert("zhsa");
    const frontSide = document.getElementById("id-card__front");
    const backSide = document.getElementById("id-card__back");
    frontSide.style.transform = "rotateY(0deg)";
    frontSide.style.zIndex = "1";
    backSide.style.transform = "rotateY(-180deg)";
    backSide.style.zIndex = "0";
  };

  // const fullName = [first_name, last_name].join(" ");

  return (
    <div class="id-card--container" id="container">
      <div class="id-card id-card__side" id="id-card__front">
        <div class="id-card__college bg--blue">
          <div class="id-card__college__logo">
            <Image src={logoNoBG} layout="fill" alt=" Logo"></Image>
          </div>
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
              <div class="id-card__body__qr-code" onClick={showQrCode}>
                <Image
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${qrCodeData}`}
                  layout="fill"
                  id="id-card__qr-code"
                  alt="QR Code"
                ></Image>
              </div>
            </div>
          </div>
          <div class="id-card__body__right">
            <div class="id-card__body__info">
              <p class="content">{`${profile.personal_info.first_name} ${
                profile.personal_info.middle_name
                  ? profile.personal_info.middle_name + " "
                  : ""
              }${profile.personal_info.last_name}`}</p>
              <p class="title">name</p>
            </div>
            <div class="id-card__body__info">
              <p class="content">
                {profile.course_info.stream} Year
                {" " + profile.course_info.current_year}
              </p>
              <p class="title">student</p>
            </div>
            <div class="id-card__body__info">
              <p class="content">
                {new Date(profile.personal_info.dob).toDateString()}
              </p>
              <p class="title">Date of Birth</p>
            </div>
            <div class="id-card__body__info">
              <p class="content">{profile.personal_info.blood_group}</p>
              <p class="title">blood group</p>
            </div>
            {/* <div class="id-card__body__blood-group">
              <p class="content" id="registration_number"></p>
              <p class="title">Reistration No</p>
            </div> */}
            <div class="id-card__body__info">
              <p class="content">{profile.personal_info.contact}</p>
              <p class="title">contact</p>
            </div>
            <div class="id-card__body__info">
              <p class="content">{profile.course_info.enrollment_number}</p>
              <p class="title">enrollment number</p>
            </div>
            <div class="id-card__body__address">
              <p class="content" id="permanent_address">
                {`${
                  profile.personal_info.present_address.street.split(",")[0]
                }, ${profile.personal_info.present_address.city}-${
                  profile.personal_info.present_address.pincode
                }`}
              </p>
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
        <div class="id-card__back__qrcode" onClick={hideQrCode}>
          <Image
            src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${qrCodeData}`}
            layout="fill"
            id="id-card__qr-code"
            alt="QR Code"
          ></Image>
        </div>
        {/* <img class="" id="id-card__qr-code--back" /> */}
      </div>
    </div>
  );
}

export default Index;

// const showBackSide = () => {
// 	const frontSide = document.getElementById("id-card__front");
// 	const backSide = document.getElementById("id-card__back");
// 	// console.log("back");
// 	frontSide.style.transform = "rotateY(-180deg)";
// 	frontSide.style.zIndex = "0";
// 	backSide.style.transform = "rotateY(-360deg)";
// 	backSide.style.zIndex = "1";
// };

// const showFrontSide = () => {
// 	const frontSide = document.getElementById("id-card__front");
// 	const backSide = document.getElementById("id-card__back");
// 	// console.log("front");
// 	frontSide.style.transform = "rotateY(0deg)";
// 	frontSide.style.zIndex = "1";
// 	backSide.style.transform = "rotateY(-180deg)";
// 	backSide.style.zIndex = "0";
// };
// const qrCode = document.getElementById("id-card__qr-code");
// const qrCodeBack = document.getElementById("id-card__qr-code--back");
// console.log(qrCode);
// console.log(qrCodeBack);
// qrCode.addEventListener("click", showBackSide);
// qrCodeBack.addEventListener("click", showFrontSide);
