import { Fragment, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import { LandingLayout } from "@/layout";
import { AllLoader } from "@/components";
import { resetUserNameApi } from "@/functions";
import Head from "next/head";
import { useAlert } from "@/contexts/AlertContext";
import { withLoading, devLog, apiRequest } from "@/utils/apiUtils";

function ForgetUsername() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [otp, setOtp] = useState("");
  const [otpResponse, setOtpResponse] = useState(null);
  const { showAlert } = useAlert();

  function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
  const handleSubmit = async (e) => {
    const authToken = localStorage.getItem("authToken");
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
        showAlert("Please enter your Email address.");
        setLoading(false);
        return;
      }

      if (!isValidEmail(userIdOrEmail)) {
        showAlert("Please enter a valid Email address.");
        setLoading(false);
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

  const handleVerifyOtp = async () => {
    const authToken = localStorage.getItem("authToken");
    const wrappedApiRequest = withLoading(
      apiRequest,
      setLoading,
      showAlert,
      "ForgetUsername"
    );
    try {
      if (!otp) {
        showAlert("Please enter the OTP.");
        setLoading(false);
        return;
      }
      const userIdOrEmail = inputValue.trim();
      const response = await wrappedApiRequest(
        `/account/userid?query=${userIdOrEmail}&otp=${otp}`,
        "GET",
        null,
        authToken,
        "ForgetUsername"
      );
      if (!response.success || !response.status) {
        devLog("Error in verifying OTP:", response.message);
        showAlert(response.message || "Error verifying OTP. Please try again.");
        return;
      }
      showAlert(response.message || "OTP verified successfully.");
      router.push("/");
    } catch (error) {
      devLog("Error verifying OTP:", error.message);
      showAlert(error.message || "An error occurred while verifying OTP.");
    }
  };

  return (
    <Fragment>
      <LandingLayout>
        <Head>
          <title>Forget Username - Eduversa</title>
          <meta
            name="description"
            content="Recover your username by generating OTP on Eduversa."
          />
          <meta
            name="keywords"
            content="forget username, recover username, OTP, Eduversa"
          />
        </Head>
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
