import React, { Fragment, useState, useEffect } from "react";
import { AllLoader } from "@/components";
import { useAlert } from "@/contexts/AlertContext";
import { withLoading, devLog, apiRequest } from "@/utils/apiUtils";

const Users = () => {
  const userTypes = ["applicant", "student", "faculty"];
  const [userType, setUserType] = useState(userTypes[0]);
  const [userData, setUserData] = useState([]);
  const [collegeData, setCollegeData] = useState(null);
  const [loading, setLoading] = useState(false);
  const year = new Date().getFullYear();
  const { showAlert } = useAlert();

  const handleChange = (e) => {
    setUserType(e.target.value);
  };

  const fetchUserData = async () => {
    const authToken = localStorage.getItem("authToken");
    const wrappedApiRequest = withLoading(
      apiRequest,
      setLoading,
      showAlert,
      "FetchData"
    );

    try {
      let userResponse;

      if (userType === "faculty") {
        userResponse = await wrappedApiRequest(
          `/faculty/all`,
          "GET",
          null,
          authToken
        );
      } else if (userType === "applicant") {
        userResponse = await wrappedApiRequest(
          `/applicant/year?year=${year}`,
          "GET",
          null,
          authToken
        );
      } else if (userType === "student") {
        userResponse = await wrappedApiRequest(
          `/student/find/all`,
          "GET",
          null,
          authToken
        );
      }

      if (!userResponse.success) {
        devLog("Error fetching users:", userResponse.message);
        showAlert(userResponse.message || "Error fetching users.");
        return;
      }

      setUserData(Array.isArray(userResponse.data) ? userResponse.data : []);

      const collegeResponse = await wrappedApiRequest(
        `/college/?college_id=304`,
        "GET",
        null,
        authToken
      );
      if (!collegeResponse.success) {
        devLog("Error fetching college details:", collegeResponse.message);
        showAlert(collegeResponse.message || "Error fetching college details.");
        return;
      }

      setCollegeData(collegeResponse.data);
    } catch (error) {
      devLog("Error fetching data:", error.message);
      showAlert(error.message || "Failed to fetch data.");
    }
  };

  useEffect(() => {
    fetchUserData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userType]);

  const renderUserCards = () => {
    if (!Array.isArray(userData) || userData.length === 0) {
      return <p>No users found for the selected type.</p>;
    }

    return userData.map((user, index) => {
      if (userType === "faculty") {
        return (
          <div key={index} className="user-card">
            <h2>{user.name}</h2>
            <p>Department: {user.department}</p>
            <p>Email: {user.email}</p>
            <p>Status: {user.status}</p>
          </div>
        );
      }

      if (userType === "applicant") {
        return (
          <div key={index} className="user-card">
            <h2>{user.name}</h2>
            <p>Application Status: {user.applicationStatus}</p>
            <p>Year: {user.year}</p>
            <p>Email: {user.email}</p>
          </div>
        );
      }

      if (userType === "student") {
        return (
          <div key={index} className="user-card">
            <h2>{user.name}</h2>
            <p>Enrollment Number: {user.enrollmentNumber}</p>
            <p>Course: {user.course}</p>
            <p>Status: {user.status}</p>
          </div>
        );
      }

      return null;
    });
  };

  return (
    <Fragment>
      {loading && <AllLoader />}

      <h1>
        <select value={userType} onChange={handleChange}>
          {userTypes.map((type, index) => (
            <option key={index} value={type}>
              {`${type} management`}
            </option>
          ))}
        </select>
      </h1>

      <div className="user-cards-container">{renderUserCards()}</div>

      {collegeData && (
        <div>
          <h2>College Data</h2>
        </div>
      )}
    </Fragment>
  );
};

export default Users;
