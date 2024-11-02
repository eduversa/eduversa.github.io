import { Fragment, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import { AllLoader } from "@/components";
import { LandingLayout } from "@/layout";
import { resetPasswordApi } from "@/functions";
import Head from "next/head";
import { useAlert } from "@/contexts/AlertContext";
import { withLoading, devLog, apiRequest } from "@/utils/apiUtils";
function ForgetPassword() {
  const [inputValue, setInputValue] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [otpResponse, setOtpResponse] = useState(null);
  const [passwordStatus, setPasswordStatus] = useState({
    isLengthValid: false,
    hasUpperCase: false,
    hasLowerCase: false,
    hasDigit: false,
    hasSpecialChar: false,
  });
  const [passwordMatch, setPasswordMatch] = useState(false);
  const [newPasswordFocused, setNewPasswordFocused] = useState(false);
  const [confirmPasswordFocused, setConfirmPasswordFocused] = useState(false);
  const router = useRouter();
  const { showAlert } = useAlert();
  const authToken = localStorage.getItem("authToken");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const wrappedApiRequest = withLoading(
      apiRequest,
      setLoading,
      showAlert,
      "GenerateOTP"
    );
    try {
      const userIdOrEmail = inputValue.trim();

      if (!userIdOrEmail) {
        alert("Please enter your userId or Email address.");
        return;
      }
      const response = await wrappedApiRequest(
        `/account/OTP/?query=${userIdOrEmail}`,
        "PUT",
        null,
        authToken,
        "GenerateOTP"
      );
      if (!response.success || !response.status) {
        devLog("Error in generating OTP:", response.message);
        showAlert(
          response.message || "Error generating OTP. Please try again."
        );
        return;
      }
      setOtpResponse(response);
      showAlert(response.message);
    } catch (error) {
      devLog("Error generating OTP:", error.message);
      showAlert(error.message || "An error occurred while generating OTP.");
    }
  };

  const handleNewPasswordChange = (e) => {
    const newPasswordValue = e.target.value;
    setNewPassword(newPasswordValue);

    const isLengthValid = newPasswordValue.length >= 8;
    const hasUpperCase = /[A-Z]/.test(newPasswordValue);
    const hasLowerCase = /[a-z]/.test(newPasswordValue);
    const hasDigit = /\d/.test(newPasswordValue);
    const hasSpecialChar = /[!@#$%^]/.test(newPasswordValue);

    setPasswordStatus({
      isLengthValid,
      hasUpperCase,
      hasLowerCase,
      hasDigit,
      hasSpecialChar,
    });
  };

  const handleConfirmPasswordChange = (e) => {
    const confirmPasswordValue = e.target.value;
    setConfirmPassword(confirmPasswordValue);

    setPasswordMatch(newPassword === confirmPasswordValue);
  };

  const handleNewPasswordFocus = () => {
    setNewPasswordFocused(true);
  };

  const handleConfirmPasswordFocus = () => {
    setConfirmPasswordFocused(true);
  };

  const handleNewPasswordBlur = () => {
    setNewPasswordFocused(false);
  };

  const handleConfirmPasswordBlur = () => {
    setConfirmPasswordFocused(false);
  };

  const handleNewPasswordSubmit = async (e) => {
    e.preventDefault();

    if (!passwordMatch) {
      showAlert(
        "Passwords do not match. Please make sure the passwords match."
      );
      return;
    }

    if (!isStrongPassword(newPassword)) {
      showAlert(
        "Please enter a password that is at least 8 characters long, contains at least one uppercase letter, one lowercase letter, one digit, and one special character."
      );
      return;
    }

    if (!otp) {
      showAlert("Please enter the OTP sent to your email address.");
      return;
    }

    try {
      setLoading(true);
      const resetPasswordResponse = await resetPasswordApi(
        inputValue.trim(),
        otp,
        newPassword,
        confirmPassword
      );
      if (process.env.NODE_ENV === "development") {
        console.log(resetPasswordResponse);
      }

      if (resetPasswordResponse.status) {
        setNewPassword("");
        setConfirmPassword("");
        setOtp("");
        setOtpResponse(null);
        alert(resetPasswordResponse.message);
        setLoading(false);
        router.push("/");
      } else {
        alert(resetPasswordResponse.message);
      }
    } catch (error) {
      if (process.env.NODE_ENV === "development") {
        console.error("Error updating password:", error.message);
      }
      alert("An error occurred while updating the password.");
    } finally {
      setLoading(false);
    }
  };

  const isStrongPassword = (password) => {
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  };

  return (
    <Fragment>
      <LandingLayout>
        <Head>
          <title>Forget Password - Eduversa</title>
          <meta
            name="description"
            content="Recover your password by generating OTP on Eduversa."
          />
          <meta
            name="keywords"
            content="forget password, recover password, OTP, Eduversa"
          />
        </Head>
        {loading && <AllLoader />}
        <div className="forget-password-container">
          <h1 className="forget-password-heading">Forgot Password</h1>
          {otpResponse && otpResponse.status ? (
            <Fragment>
              <h3 className="forget-password-subheading">
                Verify OTP and enter your new password 😊
              </h3>
              <form
                className="new-password-form"
                onSubmit={handleNewPasswordSubmit}
              >
                <div className="otp-input-container">
                  <Image
                    src="/forget/otp.png"
                    alt="otp"
                    height={20}
                    width={20}
                    className="otp-icon"
                  ></Image>

                  <input
                    type="text"
                    className="otp-input"
                    placeholder="Enter OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                  />
                </div>
                <div className="new-password-input-container">
                  <Image
                    src="/login/password.png"
                    alt="password"
                    height={20}
                    width={20}
                    className="password-icon"
                  ></Image>
                  <input
                    type="password"
                    className="new-password-input"
                    placeholder="New Password"
                    value={newPassword}
                    onChange={handleNewPasswordChange}
                    onFocus={handleNewPasswordFocus}
                    onBlur={handleNewPasswordBlur}
                    style={{
                      border:
                        // ! important
                        // newPasswordFocused &&
                        passwordStatus.isLengthValid &&
                        passwordStatus.hasUpperCase &&
                        passwordStatus.hasLowerCase &&
                        passwordStatus.hasDigit &&
                        passwordStatus.hasSpecialChar
                          ? "2px solid green"
                          : "2px solid red",
                      color:
                        // ! important
                        // newPasswordFocused &&
                        passwordStatus.isLengthValid &&
                        passwordStatus.hasUpperCase &&
                        passwordStatus.hasLowerCase &&
                        passwordStatus.hasDigit &&
                        passwordStatus.hasSpecialChar
                          ? "green"
                          : "red",
                    }}
                  />
                  {newPasswordFocused && (
                    <div className="password-requirements">
                      <p>Password Requirements:</p>
                      <ul>
                        <li>
                          {passwordStatus.isLengthValid
                            ? "✅ Minimum 8 characters"
                            : "❌ Minimum 8 characters"}
                        </li>
                        <li>
                          {passwordStatus.hasUpperCase
                            ? "✅ At least one uppercase letter"
                            : "❌ At least one uppercase letter"}
                        </li>
                        <li>
                          {passwordStatus.hasLowerCase
                            ? "✅ At least one lowercase letter"
                            : "❌ At least one lowercase letter"}
                        </li>
                        <li>
                          {passwordStatus.hasDigit
                            ? "✅ At least one digit"
                            : "❌ At least one digit"}
                        </li>
                        <li>
                          {passwordStatus.hasSpecialChar
                            ? "✅ At least one special character (!@#$%^)"
                            : "❌ At least one special character (!@#$%^)"}
                        </li>
                      </ul>
                    </div>
                  )}
                </div>
                <div className="confirm-password-input-container">
                  <Image
                    src="/login/password.png"
                    alt="password"
                    height={20}
                    width={20}
                    className="password-icon"
                  ></Image>
                  <input
                    type="password"
                    className="confirm-password-input"
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={handleConfirmPasswordChange}
                    onFocus={handleConfirmPasswordFocus}
                    onBlur={handleConfirmPasswordBlur}
                    style={{
                      border: confirmPasswordFocused
                        ? passwordMatch
                          ? "2px solid green"
                          : "2px solid red"
                        : "none",
                      color: confirmPasswordFocused
                        ? passwordMatch
                          ? "green"
                          : "red"
                        : "inherit",
                    }}
                  />
                  {confirmPasswordFocused && (
                    <div className="confirm-password">
                      {passwordMatch
                        ? "✅ Passwords match"
                        : "❌ Passwords do not match"}
                    </div>
                  )}
                </div>
                <div className="new-password-button-container">
                  <button type="submit" className="new-password-button">
                    Set New Password
                  </button>
                </div>
              </form>
            </Fragment>
          ) : (
            <Fragment>
              <div className="forget-password-subheading-container">
                <h3 className="forget-password-subheading">
                  Enter your userId/Email address to generate OTP 😁
                </h3>
              </div>
              <form className="forget-password-form" onSubmit={handleSubmit}>
                <div className="forget-password-input-container">
                  <div className="image-container">
                    <Image
                      src="/login/username.png"
                      alt="username"
                      height={20}
                      width={20}
                      className="username-icon"
                    ></Image>
                    <p className="forgot-or">OR</p>
                    <Image
                      src="/login/password.png"
                      alt="password"
                      height={20}
                      width={20}
                      className="password-icon"
                    />
                  </div>
                  <input
                    type="text"
                    className="forget-password-input"
                    placeholder="Enter your userId/Email address"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                  />
                </div>
                <div className="forget-password-button-container">
                  <button type="submit" className="forget-password-button">
                    Generate OTP
                  </button>
                </div>
              </form>
            </Fragment>
          )}
        </div>
      </LandingLayout>
    </Fragment>
  );
}

export default ForgetPassword;
