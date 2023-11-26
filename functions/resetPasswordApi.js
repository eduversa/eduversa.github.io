const BASE_URL = "https://eduversa-api.onrender.com";

const resetPasswordApi = async (
  userIdOrEmail,
  otp,
  newPassword,
  confirmPassword
) => {
  const url = `${BASE_URL}/account/password?query=${userIdOrEmail}&otp=${otp}`;
  if (process.env.NODE_ENV === "development") {
    console.log("URL:", url);
  }

  try {
    if (process.env.NODE_ENV === "development") {
      console.log("Reset Password Function Called");
      console.log("User ID or Email:", userIdOrEmail);
      console.log("OTP:", otp);
      console.log(newPassword, confirmPassword);
    }

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
      if (process.env.NODE_ENV === "development") {
        console.log(response);
      }
      throw new Error(
        `Reset Password request failed with status ${response.status}`
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
    console.error("Reset Password request error:", error.message);
    throw error;
  }
};

export default resetPasswordApi;
