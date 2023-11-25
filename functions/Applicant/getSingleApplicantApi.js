const BASE_URL = "https://eduversa-api.onrender.com";

const getSingleApplicantApi = async (userId) => {
  const url = `${BASE_URL}/applicant/?user_id=${userId}`;
  console.log("URL:", url);
  const authToken = localStorage.getItem("authToken");
  try {
    console.log("Get Single Applicant Function Called");
    console.log("User ID:", userId);

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: authToken,
      },
    });

    if (!response.ok) {
      console.log(response);
      throw new Error(
        `Get Single Applicant request failed with status ${response.status}`
      );
    }

    console.log("Response:", response);
    const data = await response.json();
    console.log("Data:", data);
    return data;
  } catch (error) {
    console.error("Get Single Applicant request error:", error.message);
    throw error;
  }
};

export default getSingleApplicantApi;
