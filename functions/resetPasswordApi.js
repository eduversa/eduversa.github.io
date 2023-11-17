const BASE_URL = "https://eduversa-api.onrender.com";

const resetPasswordApi = async (
  userIdOrEmail,
  otp,
  newPassword,
  confirmPassword
) => {
  const url = `${BASE_URL}/account/password?query=${userIdOrEmail}&otp=${otp}`;
  console.log("URL:", url);

  try {
    console.log("Reset Password Function Called");
    console.log("User ID or Email:", userIdOrEmail);
    console.log("OTP:", otp);
    console.log(newPassword, confirmPassword);

    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        password: newPassword,
        confirm_password: confirmPassword,
      }),
    });

    if (!response.ok) {
      console.log(response);
      throw new Error(
        `Reset Password request failed with status ${response.status}`
      );
    }

    console.log("Response:", response);
    const data = await response.json();
    console.log("Data:", data);
    return data;
  } catch (error) {
    console.error("Reset Password request error:", error.message);
    throw error;
  }
};

export default resetPasswordApi;
