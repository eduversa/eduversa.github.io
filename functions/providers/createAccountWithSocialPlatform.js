const apiBaseUrl = "https://eduversa-api.onrender.com";

const createAccountWithSocialPlatform = async (platformName, sessionObject) => {
  const route = `/account/auth/platform?platform=${platformName}`;
  const apiUrl = `${apiBaseUrl}${route}`;

  try {
    if (process.env.NODE_ENV === "development") {
      console.log("Create Account Function Called");
      console.log("Platform Name:", platformName);
      console.log("Session Object:", sessionObject);
    }

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(sessionObject),
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
      console.error("Error during API call:", error);
    }
    throw error;
  }
};

export default createAccountWithSocialPlatform;
