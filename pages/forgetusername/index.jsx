import { Fragment, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import { LandingLayout } from "@/layout";
import { AllLoader } from "@/components";
import { generateOtpApi, resetUserNameApi } from "@/functions";

function ForgetUsername() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [otp, setOtp] = useState("");
  const [otpResponse, setOtpResponse] = useState(null);

  function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const userIdOrEmail = inputValue.trim();

      if (!userIdOrEmail) {
        alert("Please enter your Email address.");
        setLoading(false);
        return;
      }

      if (!isValidEmail(userIdOrEmail)) {
        alert("Please enter a valid Email address.");
        setLoading(false);
        return;
      }

      const otpResponse = await generateOtpApi(userIdOrEmail);
      if (process.env.NODE_ENV === "development") {
        console.log(otpResponse);
      }
      alert(otpResponse.message);

      if (otpResponse.status) {
        setOtpResponse(otpResponse);
      }
    } catch (error) {
      if (process.env.NODE_ENV === "development") {
        console.error("Error generating OTP:", error);
      }
      alert("An error occurred while generating OTP.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    try {
      setLoading(true);
      if (!otp) {
        alert("Please enter the OTP.");
        setLoading(false);
        return;
      }
      const verifyOtpResponse = await resetUserNameApi(inputValue.trim(), otp);
      if (process.env.NODE_ENV === "development") {
        console.log(verifyOtpResponse);
      }

      if (verifyOtpResponse.status) {
        alert(verifyOtpResponse.message);
        router.push("/");
      } else {
        alert("OTP verification failed. Please try again.");
      }
    } catch (error) {
      if (process.env.NODE_ENV === "development") {
        console.error("Error verifying OTP:", error);
      }
      alert("An error occurred while verifying OTP.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Fragment>
      <LandingLayout>
        {loading && <AllLoader />}
        <div className="forget-username-container">
          <h1 className="forget-username-heading">Forget Username</h1>
          {otpResponse && otpResponse.status ? (
            <Fragment>
              <h3 className="forget-username-subheading">
                Verify OTP to recover your username 😊
              </h3>
              <form className="verify-otp-form">
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
                <div className="verify-otp-button-container">
                  <button
                    type="button"
                    className="verify-otp-button"
                    onClick={handleVerifyOtp}
                  >
                    Verify OTP
                  </button>
                </div>
              </form>
            </Fragment>
          ) : (
            <Fragment>
              <div className="forget-username-subheading-container">
                <h3 className="forget-username-subheading">
                  Enter your Email address to generate OTP 😁
                </h3>
              </div>
              <form className="forget-username-form" onSubmit={handleSubmit}>
                <div className="forget-username-input-container">
                  <div className="image-container">
                    <Image
                      src="/register/gmail.png"
                      alt="email"
                      height={20}
                      width={20}
                      className="email-icon"
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
                    className="forget-username-input"
                    placeholder="Enter your Email address"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                  />
                </div>
                <div className="forget-username-button-container">
                  <button type="submit" className="forget-username-button">
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

export default ForgetUsername;
