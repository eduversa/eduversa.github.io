const BASE_URL = "https://eduversa-api.onrender.com";

const getSingleApplicantApi = async (userId) => {
  const url = `${BASE_URL}/applicant/?user_id=${userId}`;
  if (process.env.NODE_ENV === "development") {
    console.log("URL:", url);
  }
  const authToken = localStorage.getItem("authToken");
  try {
    if (process.env.NODE_ENV === "development") {
      console.log("Get Single Applicant Function Called");
      console.log("User ID:", userId);
    }

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: authToken,
      },
    });

    if (!response.ok) {
      if (process.env.NODE_ENV === "development") {
        console.log(response);
      }
      throw new Error(
        `Get Single Applicant request failed with status ${response.status}`
      );
    }
    if (process.env.NODE_ENV === "development") {
      console.log("Response:", response);
    }
    const data = await response.json();
    if (process.env.NODE_ENV === "development") {
      console.log("Data:", data);
    }
    return data;
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("Get Single Applicant request error:", error.message);
    }
    throw error;
  }
};

export default getSingleApplicantApi;
