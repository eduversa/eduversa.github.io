const BASE_URL = "https://eduversa-api.onrender.com";

const fetchSingleStudent = async (userId) => {
  const url = `${BASE_URL}/student/?user_id=${userId}`;
  if (process.env.NODE_ENV === "development") {
    console.log("URL:", url);
    console.log("Fetching Single Student...");
  }
  const authToken = localStorage.getItem("authToken");
  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: authToken,
      },
    });

    if (!response.ok) {
      if (process.env.NODE_ENV === "development") {
        console.log("Error:", response);
      }
      throw new Error("Failed to fetch single student");
    }

    const data = await response.json();
    if (process.env.NODE_ENV === "development") {
      console.log("Data:", data);
    }
    return data;
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("Fetch Single Student request error:", error.message);
    }
    throw error;
  }
};

export default fetchSingleStudent;
