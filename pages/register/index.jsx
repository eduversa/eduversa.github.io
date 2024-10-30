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
        console.log("Session:", session);
      }
      setLoading(true);
      fetch(
        `https://eduversa-api.onrender.com/account/auth/platform?platform=${platformName}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(session),
        }
      )
        .then((response) => response.json())
        .then(async (res) => {
          devLog("Auth platform response:", res);
          showAlert(res.message);
          if (!res.status) {
            setLoading(false);
            return;
          }
          localStorage.removeItem("platformName");
          await signOut({ callbackUrl: "/" });
        })
        .catch((error) => devLog("Error in platform auth:", error))
        .finally(() => setLoading(false));
    }
  }, [session, showAlert]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const wrappedApiRequest = withLoading(
      apiRequest,
      setLoading,
      "Registration"
    );

    try {
      const response = await wrappedApiRequest("/account", "POST", { email });

      if (!response.success || response.status === false) {
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

  const handleSocialRegisterClick = async (provider) => {
    showAlert(`Register with ${provider} is coming soon!`);
    devLog("API response for social provider:", provider);
  };

  const handleGoogleSignIn = async () => {
    await signIn("google");
    localStorage.setItem("platformName", "google");
  };

  const handleGithubSignIn = async () => {
    await signIn("github");
    localStorage.setItem("platformName", "github");
  };

  const handleFacebookSignIn = async () => {
    await signIn("facebook");
    localStorage.setItem("platformName", "facebook");
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
            Your Pathway to Academic Excellence: Register Now on Eduversa😉
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
                  onClick={() => handleGoogleSignIn("Google")}
                />
                <Image
                  src="/login/facebook.png"
                  alt="facebook"
                  height={25}
                  width={25}
                  className="facebook-icon"
                  onClick={() => handleFacebookSignIn("Facebook")}
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
                  onClick={() => handleGithubSignIn("GitHub")}
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
