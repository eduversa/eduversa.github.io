import { Fragment, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { LandingLayout } from "@/layout";
import { loginUser, logIntoAccountWithSocialPlatform } from "@/functions";
import { AllLoader } from "@/components";
import { useSession, signIn, signOut } from "next-auth/react";
function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { data: session } = useSession();

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
          if (res.data.type === "applicant") {
            // router.push("/applicant");
            await signOut({ callbackUrl: "/applicant" });
          } else if (res.data.type === "student") {
            // router.push("/student");
            await signOut({ callbackUrl: "/student" });
          } else if (res.data.type === "faculty") {
            alert("Faculty is not ready yet");
            // await signOut({ callbackUrl: "/faculty" }); //uncomment later
            localStorage.clear();
          } else if (res.data.type === "admin") {
            // router.push("/admin");
            await signOut({ callbackUrl: "/admin" });
          } else {
            alert("Invalid User Type");
          }

          // setLoading(false);
          // console.log("1234-->", session);
          // router.push("/");
        })
        .catch((error) => console.log(error));
    }
  }, [session]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const apiResponse = await loginUser(username, password);
      if (apiResponse.status === false) {
        if (process.env.NODE_ENV === "development") {
          console.log("Login data:", apiResponse);
        }
        alert(apiResponse.message);
        setLoading(false);
        return;
      }
      if (process.env.NODE_ENV === "development") {
        console.log("Login data:", apiResponse);
      }
      localStorage.setItem("authToken", apiResponse.authToken);
      localStorage.setItem("email", apiResponse.data.email);
      localStorage.setItem("userType", apiResponse.data.type);
      localStorage.setItem("userid", apiResponse.data.user_id);
      if (apiResponse.data.type === "applicant") {
        localStorage.setItem(
          "applicant_profile",
          JSON.stringify(apiResponse.profileData)
        );
      }
      if (process.env.NODE_ENV === "development") {
        console.log("AuthToken", localStorage.getItem("authToken"));
        console.log("Email", localStorage.getItem("email"));
        console.log("UserType", localStorage.getItem("userType"));
        console.log("UserId", localStorage.getItem("userid"));
      }
      alert(apiResponse.message);
      setLoading(false);
      if (apiResponse.data.type === "applicant") {
        router.push("/applicant");
      } else if (apiResponse.data.type === "student") {
        router.push("/student");
      } else if (apiResponse.data.type === "faculty") {
        alert("Faculty is not ready yet");
        localStorage.clear();
      } else if (apiResponse.data.type === "admin") {
        router.push("/admin");
      } else {
        alert("Invalid User Type");
      }
    } catch (error) {
      if (process.env.NODE_ENV === "development") {
        console.error("Error in login:", error);
      }
    }
  };

  // async function socialLogin(platformname) {
  //   try {
  //     setLoading(true);
  //     const apiResponse = await logIntoAccountWithSocialPlatform(
  //       platformname,
  //       session
  //     );

  //     if (apiResponse.status === false) {
  //       if (process.env.NODE_ENV === "development") {
  //         console.log("Login data:", apiResponse);
  //       }
  //       alert(apiResponse.message);
  //       setLoading(false);
  //       router.push("/");
  //       return;
  //     }
  //     if (process.env.NODE_ENV === "development") {
  //       console.log("Login data:", apiResponse);
  //     }
  //     localStorage.setItem("authToken", apiResponse.authToken);
  //     localStorage.setItem("email", apiResponse.data.email);
  //     localStorage.setItem("userType", apiResponse.data.type);
  //     localStorage.setItem("userid", apiResponse.data.user_id);
  //   } catch (error) {
  //     if (process.env.NODE_ENV === "development") {
  //       console.error("Error during registration:", error.message);
  //     }
  //   }
  // }
  const handleSocialLoginClick = (provider) => {
    alert(`Login with ${provider} is coming soon!`);
    console.log("Session:", session);
    console.log("signIn Fnction:", signIn);
    console.log("signOut Fnction:", signOut);
    console.log("useSession Function:", useSession);
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
  if (process.env.NODE_ENV === "development") {
    console.log("Session:", session);
  }
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
                  onClick={handleGoogleSignIn}
                ></Image>
                <Image
                  src="/login/facebook.png"
                  alt="facebook"
                  height={25}
                  width={25}
                  className="facebook-icon"
                  onClick={handleFacebookSignIn}
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
                  onClick={handleGithubSignIn}
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
