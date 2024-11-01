import { Fragment, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { LandingLayout } from "@/layout";
import { withLoading, devLog, apiRequest } from "@/utils/apiUtils";
import { AllLoader } from "@/components";
import { useSession, signIn, signOut } from "next-auth/react";
import Head from "next/head";
import { useAlert } from "@/contexts/AlertContext";

function Register() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { data: session } = useSession();
  const { showAlert } = useAlert();

  useEffect(() => {
    const platformName = localStorage.getItem("platformName");
    if (session) {
      if (process.env.NODE_ENV === "development") {
        devLog("Session detected:", session);
      }

      setLoading(true);
      handlePlatformAuth(platformName, session)
        .catch((error) => devLog("Platform auth error:", error))
        .finally(() => setLoading(false));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session, showAlert]);

  const handlePlatformAuth = async (platformName, sessionData) => {
    const response = await fetch(
      `https://eduversa-api.onrender.com/account/auth/platform?platform=${platformName}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(sessionData),
      }
    );

    const res = await response.json();
    devLog("Auth platform response:", res);
    showAlert(res.message);

    if (!res.status) {
      setLoading(false);
      return;
    }

    localStorage.removeItem("platformName");
    await signOut({ callbackUrl: "/" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const wrappedApiRequest = withLoading(
      apiRequest,
      setLoading,
      showAlert,
      "Registration"
    );

    try {
      const response = await wrappedApiRequest(
        "/account",
        "POST",
        { email },
        localStorage.getItem("authToken"),
        "Registration"
      );

      if (!response.success) {
        devLog("Registration error response:", response);
        showAlert(response.message);
        return;
      }

      devLog("Registration success data:", response.data);
      showAlert(
        "Registration Was Successful! Check Your Email For Login Credentials"
      );
      router.push("/");
    } catch (error) {
      devLog("Global Error:", error);
      showAlert("An unexpected error occurred. Please try again.");
    }
  };

  const handleSocialRegisterClick = (provider) => {
    showAlert(`Register with ${provider} is coming soon!`);
    devLog("Social provider registration attempt:", provider);
  };

  const handleGoogleSignIn = () => initiateSignIn("google");
  const handleGithubSignIn = () => initiateSignIn("github");
  const handleFacebookSignIn = () => initiateSignIn("facebook");

  const initiateSignIn = async (provider) => {
    await signIn(provider);
    localStorage.setItem("platformName", provider);
  };

  return (
    <Fragment>
      <LandingLayout>
        <Head>
          <title>Register - Eduversa</title>
          <meta
            name="description"
            content="Register for an account on Eduversa to access exclusive features."
          />
          <meta
            name="keywords"
            content="register, sign up, create account, Eduversa"
          />
        </Head>
        {loading && <AllLoader />}
        <div className="register-container">
          <h2 className="register-heading">Register</h2>
          <h3 className="register-subheading">
            Your Pathway to Academic Excellence: Register Now on Eduversa 😉
          </h3>
          <form className="register-form" onSubmit={handleSubmit}>
            <div className="register-email">
              <Image
                src="/register/gmail.png"
                alt="email"
                height={20}
                width={20}
                className="email-icon"
              />
              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="email-input"
                required
              />
            </div>

            <div className="social-login">
              <span>Register with:</span>
              <div className="images">
                <Image
                  src="/login/google.png"
                  alt="google"
                  height={25}
                  width={25}
                  className="google-icon"
                  onClick={handleGoogleSignIn}
                />
                <Image
                  src="/login/facebook.png"
                  alt="facebook"
                  height={25}
                  width={25}
                  className="facebook-icon"
                  onClick={handleFacebookSignIn}
                />
                <Image
                  src="/login/twitter.png"
                  alt="twitter"
                  height={25}
                  width={25}
                  className="twitter-icon"
                  onClick={() => handleSocialRegisterClick("Twitter")}
                />
                <Image
                  src="/login/linkedin.png"
                  alt="linkedin"
                  height={25}
                  width={25}
                  className="linkedin-icon"
                  onClick={() => handleSocialRegisterClick("LinkedIn")}
                />
                <Image
                  src="/login/github.png"
                  alt="github"
                  height={25}
                  width={25}
                  className="github-icon"
                  onClick={handleGithubSignIn}
                />
              </div>
            </div>

            <div className="button-container">
              <button type="submit" className="register-button">
                Register
              </button>
            </div>

            <div className="login-prompt">
              <span>Already Registered?</span>
              <Link href="/">
                <p className="login-link">Click here to Login</p>
              </Link>
            </div>
          </form>
        </div>
      </LandingLayout>
    </Fragment>
  );
}

export default Register;
