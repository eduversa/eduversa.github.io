const apiBaseUrl = "https://eduversa-api.onrender.com";

const updateApplicantData = async (user_id, type, data, fileType) => {
  console.log(user_id, type, data, fileType);
  const tempUserId = "2023005266";
  const userEmail = localStorage.getItem("email");
  const apiUrl = `${apiBaseUrl}/applicant/?user_id=${tempUserId}&type=${type}&email=${userEmail}`;
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
        },
        body: data,
      });
    } else {
      response = await fetch(apiUrl, {
        method: "PUT",
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
