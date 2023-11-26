const BASE_URL = "https://eduversa-api.onrender.com";
const logoutApi = async (userId, authToken) => {
  const url = `${BASE_URL}/account/auth?user_id=${userId}`;

  try {
    if (process.env.NODE_ENV === "development") {
      console.log("Logout Function Called");
      console.log("User ID:", userId);
      console.log("Auth Token:", authToken);
    }
    const response = await fetch(url, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        authorization: authToken,
      },
    });

    if (!response.ok) {
      if (process.env.NODE_ENV === "development") {
        console.log(response);
      }
      throw new Error(`Logout request failed with status ${response.status}`);
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
      console.error("Logout request error:", error.message);
    }
    throw error;
  }
};

export default logoutApi;
