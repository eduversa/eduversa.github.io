import { Fragment, useState } from "react";
import { AllLoader } from "@/components";
import { LandingLayout } from "@/layout";
import { generateOtpApi } from "@/functions";

function ForgetPassword() {
  const [inputValue, setInputValue] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [otpResponse, setOtpResponse] = useState(null);

  const isValidEmail = (value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
  };

  const isValidUserId = (value) => {
    return /^\d+$/.test(value);
  };

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

      if (isValidEmail(userIdOrEmail)) {
        console.log(userIdOrEmail);
        const otpResponse = await generateOtpApi(userIdOrEmail);
        //  Otp Generated
        console.log(otpResponse);
        alert(otpResponse.message);
      } else if (isValidUserId(userIdOrEmail)) {
        console.log(otpResponse);
        const otpResponse = await generateOtpApi(userIdOrEmail);
        //  Otp Generated
        alert(otpResponse.message);
      } else {
        alert("Please enter a valid userId or Email address.");
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
    setNewPassword("");
    setConfirmPassword("");
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
          <h1>Forget Password</h1>
          {otpResponse ? (
            <>
              <h3 className="forget-password-subheading">
                Verify OTP and enter your new password!
              </h3>
              <form
                className="new-password-form"
                onSubmit={handleNewPasswordSubmit}
              >
                <div className="new-password-input-container">
                  <input
                    type="password"
                    className="new-password-input"
                    placeholder="New Password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </div>
                <div className="confirm-password-input-container">
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
                  Enter your userId/Email address to generate OTP.
                </h3>
              </div>
              <form className="forget-password-form" onSubmit={handleSubmit}>
                <div className="forget-password-input-container">
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
