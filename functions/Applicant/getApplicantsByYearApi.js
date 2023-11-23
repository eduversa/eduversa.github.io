const BASE_URL = "https://eduversa-api.onrender.com";

const getApplicantsByYearApi = async (year) => {
  const url = `${BASE_URL}/applicant/year?year=${year}`;
  console.log("URL:", url);

  try {
    console.log("Get Applicants By Year Function Called");
    console.log("Year:", year);

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      console.log(response);
      throw new Error(
        `Get Applicants By Year request failed with status ${response.status}`
      );
    }

    console.log("Response:", response);
    const data = await response.json();
    console.log("Data:", data);
    return data;
  } catch (error) {
    console.error("Get Applicants By Year request error:", error.message);
    throw error;
  }
};

export default getApplicantsByYearApi;
