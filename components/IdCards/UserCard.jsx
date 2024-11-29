import React from "react";
import Image from "next/image";
const placeholderImage = "/user.png";
const getApplicantInfo = (user) => {
  const { email } = user?.personal_info || {};
  const { createdAt } = user || {};
  const { course_name, stream } = user?.course_info || {};
  const { user_id } = user || {};
  return {
    email,
    createdAt: new Date(createdAt).toLocaleDateString(),
    courseName: course_name,
    stream: stream,
    userId: user_id,
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

const getfacultyInfo = (user) => {
  const { email } = user?.personal_info || {};
  const { room, department } = user?.job_info || {};
  const { user_id } = user || {};
  return {
    email: email,
    room: room,
    department: department,
    userId: user_id,
  };
};

const UserCard = ({ user, userType }) => {
  const { first_name, last_name } = user?.personal_info || {};
  const { image } = user || {};
  const userInfo = (() => {
    if (userType === "applicant") {
      return getApplicantInfo(user);
    } else if (userType === "student") {
      return getStudentInfo(user);
    } else if (userType === "faculty") {
      return getfacultyInfo(user);
    }
    return {};
  })();

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
    } else if (userType === "faculty") {
      return (
        <div className="user-card__student-info">
          <p>
            <strong>Email:</strong> {userInfo.email}
          </p>
          <p>
            <strong>Department</strong>:{userInfo.department}
          </p>
          <p>
            <strong>Room</strong> :{userInfo.room}
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
