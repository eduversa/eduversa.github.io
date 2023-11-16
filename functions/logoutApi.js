const BASE_URL = "https://eduversa-api.onrender.com";
const logoutApi = async (userId, authToken) => {
  const url = `${BASE_URL}/account/auth?user_id=${userId}`;

  try {
    console.log("Logout Function Called");
    console.log("User ID:", userId);
    console.log("Auth Token:", authToken);
    const response = await fetch(url, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        authorization: authToken,
      },
    });

    if (response.status === false) {
      console.log(response);
      throw new Error(`Logout request failed with status ${response.status}`);
    }
    console.log("Response:", response);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Logout request error:", error.message);
    throw error;
  }
};

export default logoutApi;
