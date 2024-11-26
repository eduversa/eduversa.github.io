import React, { useState } from "react";

const Users = () => {
  const userTypes = ["Applicant", "Student", "Faculty"];
  const [userType, setUserType] = useState(userTypes[0]);

  const handleChange = (e) => {
    setUserType(e.target.value);
  };

  return (
    <div>
      <h1>
        <select value={userType} onChange={handleChange}>
          {userTypes.map((type, index) => (
            <option key={index} value={type}>
              {`${type} management`}
            </option>
          ))}
        </select>
      </h1>
    </div>
  );
};

export default Users;
