import { Fragment, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { LandingLayout } from "@/layout";
import { loginUser } from "@/functions";
import { AllLoader } from "@/components";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const apiResponse = await loginUser(username, password);
      if (apiResponse.status === false) {
        console.log("Login data:", apiResponse);
        alert(apiResponse.message);
        setLoading(false);
        return;
      }
      console.log("Login data:", apiResponse);
      localStorage.setItem("authToken", apiResponse.authToken);
      localStorage.setItem("email", apiResponse.data.email);
      localStorage.setItem("userType", apiResponse.data.type);
      localStorage.setItem("userid", apiResponse.data.user_id);
      localStorage.setItem("applicant_profile", JSON.stringify(apiResponse.profileData));
      console.log("AuthToken", localStorage.getItem("authToken"));
      console.log("Email", localStorage.getItem("email"));
      console.log("UserType", localStorage.getItem("userType"));
      console.log("UserId", localStorage.getItem("userid"));
      alert(apiResponse.message);
      setLoading(false);
      if (apiResponse.data.type === "applicant") {
        router.push("/applicant");
      } else if (apiResponse.data.type === "student") {
        alert("Student is not ready yet");
      } else if (apiResponse.data.type === "faculty") {
        alert("Faculty is not ready yet");
      } else if (apiResponse.data.type === "admin") {
        alert("Admin is not ready yet");
      } else {
        alert("Invalid User Type");
      }
    } catch (error) {
      console.error("Error in login:", error);
    }
  };
  const handleSocialLoginClick = (provider) => {
    alert(`Login with ${provider} is coming soon!`);
  };
  return (
    <Fragment>
      <LandingLayout>
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
                  onClick={() => handleSocialLoginClick("Google")}
                ></Image>
                <Image
                  src="/login/facebook.png"
                  alt="facebook"
                  height={25}
                  width={25}
                  className="facebook-icon"
                  onClick={() => handleSocialLoginClick("Facebook")}
                ></Image>
                <Image
                  src="/login/twitter.png"
                  alt="twitter"
                  height={25}
                  width={25}
                  className="twitter-icon"
                  onClick={() => handleSocialLoginClick("Twitter")}
                ></Image>
                <Image
                  src="/login/linkedin.png"
                  alt="linkedin"
                  height={25}
                  width={25}
                  className="linkedin-icon"
                  onClick={() => handleSocialLoginClick("LinkedIn")}
                ></Image>
                <Image
                  src="/login/github.png"
                  alt="github"
                  height={25}
                  width={25}
                  className="github-icon"
                  onClick={() => handleSocialLoginClick("GitHub")}
                ></Image>
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
