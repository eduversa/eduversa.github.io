const BASE_URL = "https://eduversa-api.onrender.com";

const resetUserNameApi = async (userIdOrEmail, otp) => {
  const url = `${BASE_URL}/account/userid?query=${userIdOrEmail}&otp=${otp}`;
  if (process.env.NODE_ENV === "development") {
    console.log("URL:", url);
  }

  try {
    if (process.env.NODE_ENV === "development") {
      console.log("Reset User Name Function Called");
      console.log("User ID or Email:", userIdOrEmail);
      console.log("OTP:", otp);
    }
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      if (process.env.NODE_ENV === "development") {
        console.log(response);
      }
      throw new Error(
        `Reset User Name request failed with status ${response.status}`
      );
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
      console.error("Reset User Name request error:", error.message);
    }
    throw error;
  }
};

export default resetUserNameApi;
