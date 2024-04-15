const BASE_URL = "https://eduversa-api.onrender.com";

const approveApplicantApi = async (userId) => {
  const url = `${BASE_URL}/student/approve?user_id=${userId}`;
  if (process.env.NODE_ENV === "development") {
    console.log("URL:", url);
  }
  const authToken = localStorage.getItem("authToken");
  try {
    console.log("Approve Applicant Function Called");
    console.log("User ID:", userId);

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: authToken,
      },
    });

    if (response.ok === false) {
      console.log(response);
      alert("Error approving applicant");
      return;
    }
    console.log("Response:", response);
    const data = await response.json();
    console.log("Data:", data);
    if (data.status != true) {
      alert(JSON.stringify(data.message));
      return;
    }
    return data;
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("Approve Applicant request error:", error.message);
    }
    throw error;
  }
};

export default approveApplicantApi;
