import { Fragment, useState } from "react";
import { AllLoader } from "@/components";
import { LandingLayout } from "@/layout";
import { generateOtpApi } from "@/functions";

function ForgetPassword() {
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);

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

  return (
    <Fragment>
      <LandingLayout>
        {loading && <AllLoader />}
        <div className="forget-password-container">
          <h1>Forget Password</h1>
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
        </div>
      </LandingLayout>
    </Fragment>
  );
}

export default ForgetPassword;
