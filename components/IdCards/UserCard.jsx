import React from "react";
import Image from "next/image";

const UserCard = ({ user, userType, placeholderImage }) => {
  const { first_name, last_name, email } = user?.personal_info || {};
  const { image, createdAt, user_id } = user; // Correctly pulling image, createdAt, and user_id from the top level
  const courseName = user?.course_info?.course_name;
  const stream = user?.course_info?.stream;

  // Function to render additional data based on userType
  const renderAdditionalInfo = () => {
    if (userType === "applicant") {
      return (
        <div className="user-card__applicant-info">
          <p>
            <strong>Course:</strong> {courseName}
          </p>
          <p>
            <strong>Stream:</strong> {stream}
          </p>
          <p>
            <strong>Created At:</strong>{" "}
            {new Date(createdAt).toLocaleDateString()}
          </p>
          <p>
            <strong>User ID:</strong> {user_id}
          </p>{" "}
          {/* Displaying User ID */}
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
        <p>
          <strong>Email:</strong> {email}
        </p>
        {renderAdditionalInfo()}
      </div>
    </div>
  );
};

export default UserCard;
