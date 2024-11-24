import React from "react";
import Image from "next/image";
const placeholderImage = "/user.png";
const getApplicantInfo = (user) => {
  const { email, createdAt } = user?.personal_info || {};
  const { course_name, stream } = user?.course_info || {};
  return {
    email,
    createdAt: new Date(createdAt).toLocaleDateString(),
    courseName: course_name,
    stream: stream,
  };
};

const getStudentInfo = (user) => {
  const { admission_year, course_name, stream } = user?.course_info || {};
  const { user_id } = user || {};
  return {
    admissionYear: admission_year,
    courseName: course_name,
    stream,
    userId: user_id,
  };
};

const UserCard = ({ user, userType }) => {
  const { first_name, last_name } = user?.personal_info || {};
  const image = user.image || null;
  const userInfo =
    userType === "applicant" ? getApplicantInfo(user) : getStudentInfo(user);

  const renderAdditionalInfo = () => {
    if (userType === "applicant") {
      return (
        <div className="user-card__applicant-info">
          <p>
            <strong>Email:</strong> {userInfo.email}
          </p>
          <p>
            <strong>Created At:</strong> {userInfo.createdAt}
          </p>
          <p>
            <strong>Course:</strong> {userInfo.courseName}
          </p>
          <p>
            <strong>Stream:</strong> {userInfo.stream}
          </p>
        </div>
      );
    } else if (userType === "student") {
      return (
        <div className="user-card__student-info">
          <p>
            <strong>Admission Year:</strong> {userInfo.admissionYear}
          </p>
          <p>
            <strong>Course:</strong> {userInfo.courseName}
          </p>
          <p>
            <strong>Stream:</strong> {userInfo.stream}
          </p>
          <p>
            <strong>User ID:</strong> {userInfo.userId}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="user-card">
      <div className="user-card__image">
        <Image
          src={image || placeholderImage}
          alt={`${first_name} ${last_name}`}
          width={100}
          height={100}
        />
      </div>
      <div className="user-card__info">
        <h3>
          {first_name} {last_name}
        </h3>
        {renderAdditionalInfo()}
      </div>
    </div>
  );
};

export default UserCard;
