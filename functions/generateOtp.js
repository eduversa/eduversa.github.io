const BASE_URL = "https://eduversa-api.onrender.com";

const generateOtpApi = async (userId) => {
  const url = `${BASE_URL}/account/otp?user_id=${userId}`;

  try {
    console.log("Generate OTP Function Called");
    console.log("User ID:", userId);

    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.status === false) {
      console.log(response);
      throw new Error(
        `Generate OTP request failed with status ${response.status}`
      );
    }
    console.log("Response:", response);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Generate OTP request error:", error.message);
    throw error;
  }
};

export default generateOtpApi;
