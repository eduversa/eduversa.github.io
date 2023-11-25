const apiBaseUrl = "https://eduversa-api.onrender.com";

const updateApplicantData = async (user_id, type, data, fileType) => {
  console.log(user_id, type, data, fileType);
  const userEmail = localStorage.getItem("email");
  const authToken = localStorage.getItem("authToken");
  const apiUrl = `${apiBaseUrl}/applicant/?user_id=${user_id}&type=${type}&email=${userEmail}`;
  try {
    console.log("Update Applicant Data Function Called");
    console.log("User ID:", user_id);
    console.log("Type:", type);
    console.log("Data:", data);
    let response;
    if (!fileType) {
      response = await fetch(apiUrl, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          authorization: authToken,
        },
        body: data,
      });
    } else {
      response = await fetch(apiUrl, {
        method: "PUT",
        headers: {
          authorization: authToken,
        },
        body: data,
      });
    }

    if (!response.ok) {
      console.log(response);
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    console.log("Response:", response);

    const responseData = await response.json();
    return responseData;
  } catch (error) {
    console.error("Error during API call:", error);
    throw error;
  }
};

export default updateApplicantData;
