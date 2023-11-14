const apiUrl = "https://eduversa-api.onrender.com";

async function registerUser(email) {
  const endpoint = "/account/";

  try {
    const response = await fetch(apiUrl + endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    console.log("Registration successful:", data);
    return data;
  } catch (error) {
    console.error("Error registering user:", error.message);
    throw error;
  }
}

export default registerUser;
