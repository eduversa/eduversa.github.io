import Image from "next/image";

import logoNoBG from "/public/icons/logo-no-bg.png";
import { useEffect, useState } from "react";
import { deleteSingleStudent } from "@/functions";

// import React from 'react'

const IdCard = ({ profile, page }) => {
  //   alert("kc k wlk");
  const [qrCodeData, setQrCodeData] = useState(undefined);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    // alert("profile");
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

  const handleShowProfile = (id) => {
    console.log("Show profile for student with id:", id);
    localStorage.setItem("selected-studentId", id);
    router.push("/admin/manage/students/profile");
  };

  const handleDeleteStudent = async (id) => {
    console.log("Delete student with id:", id);
    localStorage.setItem("selected-studentId", id);
    const confirmDelete = confirm(
      "Are you sure you want to delete this student?"
    );

    if (confirmDelete) {
      try {
        setLoading(true);
        await deleteSingleStudent(id);
        setLoading(false);
        window.location.reload();
      } catch (error) {
        console.error("Error deleting student:", error);
        setLoading(false);
        alert("Error deleting student. Please try again.");
      }
    }
  };

  const showQrCode = () => {
    // alert("zhsa");
    const frontSide = document.getElementById(
      `id-card__front--${profile.user_id}`
    );
    const backSide = document.getElementById(
      `id-card__back--${profile.user_id}`
    );
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
    const frontSide = document.getElementById(
      `id-card__front--${profile.user_id}`
    );
    const backSide = document.getElementById(
      `id-card__back--${profile.user_id}`
    );
    frontSide.style.transform = "rotateY(0deg)";
    frontSide.style.zIndex = "1";
    backSide.style.transform = "rotateY(-180deg)";
    backSide.style.zIndex = "0";
  };

  return (
    <div class="id-card--container" id="container">
      <div
        class="id-card id-card__side id-card__side--front"
        id={`id-card__front--${profile.user_id}`}
      >
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
      <div
        class="id-card id-card__side id-card__side--back"
        id={`id-card__back--${profile.user_id}`}
        onClick={hideQrCode}
      >
        {page === "dashboard" && (
          <div class="id-card__back__qrcode" onClick={hideQrCode}>
            <Image
              src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${qrCodeData}`}
              layout="fill"
              id="id-card__qr-code"
              alt="QR Code"
            ></Image>
          </div>
        )}
        {page === "manage-students" && (
          <div class="id-card__back__btns">
            <button
              onClick={() => handleDeleteStudent(profile.user_id)}
              className="delete-button"
            >
              <Image
                src="\applicant\delete.png"
                alt="delete"
                height={20}
                width={20}
              ></Image>
            </button>
            <button
              onClick={() => handleShowProfile(profile.user_id)}
              className="profile-button"
            >
              <Image
                src="\applicant\search.png"
                alt="profile"
                height={20}
                width={20}
              ></Image>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default IdCard;

// export default IdCard;
