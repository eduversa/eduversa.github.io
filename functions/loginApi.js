const apiBaseUrl = "https://eduversa-api.onrender.com";

const loginUser = async (username, password) => {
  const apiUrl = `${apiBaseUrl}/account/auth`;

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: username,
        password: password,
      }),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    console.log("API Response:", data);

    return data;
  } catch (error) {
    console.error("Error during API call:", error);
    throw error;
  }
};

export default loginUser;
