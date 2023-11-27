const apiUrl = "https://eduversa-api.onrender.com";

async function registerUser(email) {
  const endpoint = "/account/";

  try {
    if (process.env.NODE_ENV === "development") {
      console.log("Registration Function Called");
      console.log("Email:", email);
    }
    const response = await fetch(apiUrl + endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      if (process.env.NODE_ENV === "development") {
        console.log(response);
      }
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    if (process.env.NODE_ENV === "development") {
      console.log("Response:", response);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("Error registering user:", error.message);
    }
    throw error;
  }
}

export default registerUser;
