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
      console.log("session--->", session);
      setLoading(true);
      fetch(
        `https://eduversa-api.onrender.com/account/auth/platform?platform=${platformName}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(session),
        }
      )
        .then((response) => response.json())
        .then(async (res) => {
          console.log(res);
          alert(res.message);
          if (!res.status) {
            setLoading(false);
            return;
          }
          localStorage.removeItem("platformName");
          localStorage.setItem("authToken", res.authToken);
          localStorage.setItem("email", res.data.email);
          localStorage.setItem("userType", res.data.type);
          localStorage.setItem("userid", res.data.user_id);
          if (res.data.type === "applicant") {
            localStorage.setItem(
              "applicant_profile",
              JSON.stringify(res.profileData)
            );
          }
          if (process.env.NODE_ENV === "development") {
            console.log("AuthToken", localStorage.getItem("authToken"));
            console.log("Email", localStorage.getItem("email"));
            console.log("UserType", localStorage.getItem("userType"));
            console.log("UserId", localStorage.getItem("userid"));
          }
          alert(res.message);
          if (res.data.type === "applicant") {
            await signOut({ callbackUrl: "/applicant" });
          } else if (res.data.type === "student") {
            await signOut({ callbackUrl: "/student" });
          } else if (res.data.type === "faculty") {
            await signOut({ callbackUrl: "/faculty" });
            localStorage.clear();
          } else if (res.data.type === "admin") {
            await signOut({ callbackUrl: "/admin" });
          } else {
            alert("Invalid User Type");
          }
        })
        .catch((error) => console.log(error));
    }
  }, [session]);

  const storeUserData = (data) => {
    localStorage.setItem("authToken", data.authToken);
    localStorage.setItem("email", data.data.email);
    localStorage.setItem("userType", data.data.type);
    localStorage.setItem("userid", data.data.user_id);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const wrappedApiRequest = withLoading(
      apiRequest,
      setLoading,
      showAlert,
      "Login"
    );

    try {
      const response = await wrappedApiRequest(
        "/account/auth",
        "POST",
        {
          user_id: username,
          password,
        },
        localStorage.getItem("authToken"),
        "Login"
      );

      if (!response.success || !response.status) {
        devLog("Login error response:", response);
        showAlert(response.message || "Login failed. Please try again.");
        return;
      }

      // devLog("Login success data:", response.data);
      storeUserData(response.data);

      navigateUser(response.data.data.type);
    } catch (error) {
      devLog("Global Error:", error);
      showAlert(
        error.message || "An unexpected error occurred. Please try again."
      );
    }
  };

  // Navigate user based on user type
  const navigateUser = (userType) => {
    showAlert("Logged In Successfully!");

    switch (userType) {
      case "applicant":
        router.push("/applicant");
        break;
      case "student":
        router.push("/student");
        break;
      case "faculty":
        router.push("/faculty");
        break;
      case "admin":
        router.push("/admin");
        break;
      case "superadmin":
        router.push("/superadmin");
      default:
        showAlert("Invalid User Type");
        localStorage.clear();
        window.location.reload();
        break;
    }
  };

  const handleSocialLogin = async (provider) => {
    await signIn(provider);
    localStorage.setItem("platformName", provider);
  };

  const handleSocialLoginClick = (provider) => {
    showAlert(`Login with ${provider} is coming soon!`);
    devLog("Social provider login attempt:", provider);
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
              Step Inside your Academic Realm{" "}
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
                  onClick={() => handleSocialLogin("google")}
                />
                <Image
                  src="/login/facebook.png"
                  alt="facebook"
                  height={25}
                  width={25}
                  className="facebook-icon"
                  onClick={() => handleSocialLogin("facebook")}
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
                  onClick={() => handleSocialLogin("github")}
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
                <span>New to Eduversa?</span>
                <Link href="/register">
                  <p className="register-prompt">Click here to Register</p>
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
