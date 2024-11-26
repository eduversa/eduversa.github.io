import React, { Fragment, useState, useEffect } from "react";
import { AllLoader } from "@/components";
import { useAlert } from "@/contexts/AlertContext";
import { withLoading, devLog, apiRequest } from "@/utils/apiUtils";

const Users = () => {
  const userTypes = ["applicant", "student", "faculty"];
  const [userType, setUserType] = useState(userTypes[0]);
  const [loading, setLoading] = useState(true);
  const year = new Date().getFullYear();
  const { showAlert } = useAlert();
  const handleChange = (e) => {
    setUserType(e.target.value);
  };

  useEffect(() => {
    const fetchData = async () => {
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
        //  make a state here to load the data here
        // setUserData(userResponse.data.data);

        const collegeResponse = await wrappedApiRequest(
          `/college/?college_id=304`,
          "GET",
          null,
          authToken
        );
        if (!collegeResponse.success) {
          devLog("Error fetching college details:", collegeResponse.message);
          showAlert(
            collegeResponse.message || "Error fetching college details."
          );
          return;
        }
        //  make a state here to load the data here
        // setCollegeData(collegeResponse.data.data);
      } catch (error) {
        devLog("Error fetching data:", error.message);
        showAlert(error.message || "Failed to fetch data.");
      }
    };

    fetchData();
  }, [userType, showAlert, year]);
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
    </Fragment>
  );
};

export default Users;
