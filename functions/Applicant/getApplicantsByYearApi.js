const BASE_URL = "https://eduversa-api.onrender.com";

const getApplicantsByYearApi = async (year) => {
  const url = `${BASE_URL}/applicant/year?year=${year}`;
  if (process.env.NODE_ENV === "development") {
    console.log("URL:", url);
  }
  const authToken = localStorage.getItem("authToken");
  try {
    if (process.env.NODE_ENV === "development") {
      console.log("Get Applicants By Year Function Called");
      console.log("Year:", year);
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
        `Get Applicants By Year request failed with status ${response.status}`
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
      console.error("Get Applicants By Year request error:", error.message);
    }
    throw error;
  }
};

export default getApplicantsByYearApi;
