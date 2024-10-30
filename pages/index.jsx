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

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
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
          localStorage.setItem("authToken", res.security_token);
          localStorage.setItem("email", res.data.email);
          localStorage.setItem("userType", res.data.type);
          localStorage.setItem("userid", res.data.user_id);

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
      showAlert,
      "Login"
    );

    try {
      console.log("Username:", username);
      console.log("Password:", password);
      const response = await wrappedApiRequest("/account/auth", "POST", {
        user_id: username,
        password,
      });

      if (!response.success || response.status === false) {
        devLog("Login error response:", response);
        showAlert(response.message);
        return;
      }

      devLog("Login success data:", response.data);
      localStorage.removeItem("platformName");
      localStorage.setItem("authToken", response.data.security_token);
      localStorage.setItem("email", response.data.email);
      localStorage.setItem("userType", response.data.type);
      localStorage.setItem("userid", response.data.user_id);
      const authToken = localStorage.getItem("authToken");
      const email = localStorage.getItem("email");
      const userType = localStorage.getItem("userType");
      const userid = localStorage.getItem("userid");

      console.log("Auth Token:", authToken);
      console.log("Email:", email);
      console.log("User Type:", userType);
      console.log("User ID:", userid);
      showAlert("Logged In Successfully!");

      if (userType === "applicant") {
        router.push("/applicant");
      } else if (userType === "student") {
        router.push("/student");
      } else if (userType === "faculty") {
        showAlert("Faculty is not ready yet");
        localStorage.clear();
      } else if (userType === "admin") {
        router.push("/admin");
      } else {
        showAlert("Invalid User Type");
      }
    } catch (error) {
      devLog("Global Error:", error);
      showAlert("An unexpected error occurred. Please try again.");
    }
  };

  const handleSocialLoginClick = async (provider) => {
    showAlert(`Login with ${provider} is coming soon!`);
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
          <title>Login - Eduversa</title>
          <meta
            name="description"
            content="Login to access your account on Eduversa."
          />
          <meta name="keywords" content="login, authentication, Eduversa" />
        </Head>
        {loading && <AllLoader />}
        <div className="login-container">
          <h2 className="login-heading">Login</h2>
          <div className="login-subheading-container">
            <h3 className="loginbox-heading">
              Step Inside your Academic Realm
              <span role="img" aria-label="Wink Emoji">
                🙂
              </span>
            </h3>
          </div>
          <form className="login-form" onSubmit={handleSubmit}>
            <div className="login-username">
              <Image
                src="/login/username.png"
                alt="username"
                height={20}
                width={20}
                className="username-icon"
              />
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="username-input"
                required
              />
            </div>
            <div className="login-password">
              <Image
                src="/login/password.png"
                alt="password"
                height={20}
                width={20}
                className="password-icon"
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="password-input"
                required
              />
            </div>

            <div className="social-login">
              <span>Login with:</span>
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
                  onClick={() => handleSocialLoginClick("Twitter")}
                />
                <Image
                  src="/login/linkedin.png"
                  alt="linkedin"
                  height={25}
                  width={25}
                  className="linkedin-icon"
                  onClick={() => handleSocialLoginClick("LinkedIn")}
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
              <button type="submit" className="login-button">
                Login
              </button>
            </div>
            <div className="extra-options">
              <div className="forget-option">
                <Link href="/forgetpassword">
                  <span className="forget-password">Forgot Password?</span>
                </Link>
                <Link href="/forgetusername">
                  <span className="forget-password">Forget username?</span>
                </Link>
              </div>
              <div className="register">
                <span>New to eduversa?</span>
                <Link href="/register">
                  <p className="rerister-promt">Click here to Register</p>
                </Link>
              </div>
            </div>
          </form>
        </div>
      </LandingLayout>
    </Fragment>
  );
}

export default Login;
