const BASE_URL = "https://eduversa-api.onrender.com";

const resetUserNameApi = async (userIdOrEmail, otp) => {
  const url = `${BASE_URL}/account/userid?query=${userIdOrEmail}&otp=${otp}`;
  console.log("URL:", url);

  try {
    console.log("Reset User Name Function Called");
    console.log("User ID or Email:", userIdOrEmail);
    console.log("OTP:", otp);

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      console.log(response);
      throw new Error(
        `Reset User Name request failed with status ${response.status}`
      );
    }

    console.log("Response:", response);
    const data = await response.json();
    console.log("Data:", data);
    return data;
  } catch (error) {
    console.error("Reset User Name request error:", error.message);
    throw error;
  }
};

export default resetUserNameApi;
