const BASE_URL = "https://eduversa-api.onrender.com";

const deleteApplicantApi = async (userId) => {
  const url = `${BASE_URL}/applicant/?user_id=${userId}`;
  console.log("URL:", url);
  const authToken = localStorage.getItem("authToken");
  try {
    console.log("Delete Applicant Function Called");
    console.log("User ID:", userId);

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
        `Delete Applicant request failed with status ${response.status}`
      );
    }

    console.log("Response:", response);
    const data = await response.json();
    console.log("Data:", data);
    return data;
  } catch (error) {
    console.error("Delete Applicant request error:", error.message);
    throw error;
  }
};

export default deleteApplicantApi;
