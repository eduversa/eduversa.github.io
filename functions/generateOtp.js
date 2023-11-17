const BASE_URL = "https://eduversa-api.onrender.com";

const generateOtpApi = async (userIdOrEmail) => {
  const url = `${BASE_URL}/account/?query=${userIdOrEmail}`;

  try {
    console.log("Generate OTP Function Called");
    console.log("User ID:", userIdOrEmail);

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
    console.log("Data:", data);
    return data;
  } catch (error) {
    console.error("Generate OTP request error:", error.message);
    throw error;
  }
};

export default generateOtpApi;
