import { Fragment, useState } from "react";
import Image from "next/image";
import { AllLoader } from "@/components";
import { LandingLayout } from "@/layout";
import { generateOtpApi } from "@/functions";

function ForgetPassword() {
  const [inputValue, setInputValue] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [otpResponse, setOtpResponse] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const userIdOrEmail = inputValue.trim();

      if (!userIdOrEmail) {
        alert("Please enter your userId or Email address.");
        setLoading(false);
        return;
      }

      const otpResponse = await generateOtpApi(userIdOrEmail);
      console.log(otpResponse);
      alert(otpResponse.message);

      if (otpResponse.status) {
        setOtpResponse(otpResponse);
      }
    } catch (error) {
      console.error("Error generating OTP:", error);
      alert("Error generating OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleNewPasswordSubmit = (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      alert("Passwords do not match. Please make sure the passwords match.");
      return;
    }

    if (!isStrongPassword(newPassword)) {
      alert(
        "Please enter a password that is at least 8 characters long, contains at least one uppercase letter, one lowercase letter, one digit, and one special character."
      );
      return;
    }

    if (!otp) {
      alert("Please enter the OTP.");
      return;
    }

    // Additional logic for updating the password using OTP

    setNewPassword("");
    setConfirmPassword("");
    setOtp("");
    setOtpResponse(null);

    alert("Password updated successfully!");
  };

  const isStrongPassword = (password) => {
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  };

  return (
    <Fragment>
      <LandingLayout>
        {loading && <AllLoader />}
        <div className="forget-password-container">
          <h1 className="forget-password-heading">Forgot Password</h1>
          {otpResponse && otpResponse.status ? (
            <>
              <h3 className="forget-password-subheading">
                Verify OTP and enter your new password!
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
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
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
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
                <div className="new-password-button-container">
                  <button type="submit" className="new-password-button">
                    Set New Password
                  </button>
                </div>
              </form>
            </>
          ) : (
            <>
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
            </>
          )}
        </div>
      </LandingLayout>
    </Fragment>
  );
}

export default ForgetPassword;
