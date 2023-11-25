const BASE_URL = "https://eduversa-api.onrender.com";

const deleteApplicantsByYearApi = async (year) => {
  const url = `${BASE_URL}/applicant/year?year=${year}`;
  console.log("URL:", url);
  const authToken = localStorage.getItem("authToken");
  try {
    console.log("Delete Applicants By Year Function Called");
    console.log("Year:", year);

    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        authorization: authToken,
      },
    });

    if (!response.ok) {
      console.log(response);
      throw new Error(
        `Delete Applicants By Year request failed with status ${response.status}`
      );
    }

    console.log("Response:", response);
    const data = await response.json();
    console.log("Data:", data);
    return data;
  } catch (error) {
    console.error("Delete Applicants By Year request error:", error.message);
    throw error;
  }
};

export default deleteApplicantsByYearApi;
