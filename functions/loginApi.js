const apiBaseUrl = "https://eduversa-api.onrender.com";

const loginUser = async (username, password) => {
  const apiUrl = `${apiBaseUrl}/account/auth`;
  // const tempUserId = localStorage.getItem("registeredUserId");
  // const tempUserPassword = "Test@1234";
  try {
    console.log("Login Function Called");
    console.log("Username:", username);
    console.log("Password:", password);
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
      console.log(response);
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    console.log("Response:", response);

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error during API call:", error);
    throw error;
  }
};

export default loginUser;
