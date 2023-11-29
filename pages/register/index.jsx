import { Fragment, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { LandingLayout } from "@/layout";
import { registerUser, createAccountWithSocialPlatform } from "@/functions";
import { AllLoader } from "@/components";
import { useSession, signIn, signOut } from "next-auth/react";
function Register() {
  const [email, setEmail] = useState("");
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
          method: "POST",
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
          await signOut({ callbackUrl: "/" });
          // setLoading(false);
          // console.log("1234-->", session);
          // router.push("/");
        })
        .catch((error) => console.log(error));
    }
  }, [session]);

  // useEffect(() => {
  //   if (session) {
  //     const provider = "google";
  //     async function socialRegister(provider, session) {
  //       alert("Register with " + provider + " is working!");
  //       try {
  //         setLoading(true);

  //         const apiResponse = await createAccountWithSocialPlatform(
  //           provider,
  //           session
  //         );
  //         console.log("apiResponse", provider, session);
  //         if (apiResponse.status === false) {
  //           if (process.env.NODE_ENV === "development") {
  //             alert(apiResponse.message);
  //             console.log("Register data data:", apiResponse);
  //             setLoading(false);
  //           }
  //           return;
  //         }
  //         if (process.env.NODE_ENV === "development") {
  //           console.log("Register data data:", apiResponse);
  //         }
  //         alert(apiResponse.message);
  //         setLoading(false);
  //         router.push("/");
  //       } catch (error) {
  //         if (process.env.NODE_ENV === "development") {
  //           console.error("Error during registration:", error.message);
  //         }
  //       }
  //     }
  //     socialRegister(provider, session);
  //   }
  // }, [router, session]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const registrationData = await registerUser(email);
      if (registrationData.status === false) {
        if (process.env.NODE_ENV === "development") {
          console.log("Registration data:", registrationData);
        }
        alert(registrationData.message);
        setLoading(false);
        return;
      }
      if (process.env.NODE_ENV === "development") {
        console.log("Registration data:", registrationData);
      }
      alert(
        "Registration Was Successful! Check Your Email For Login Credentials"
      );
      setLoading(false);
      router.push("/");
    } catch (error) {
      if (process.env.NODE_ENV === "development") {
        console.error("Error during registration:", error.message);
      }
    }
  };
  // async function socialRegister(platformname, session) {
  //   alert("Register with " + platformname + " is working!");
  //   try {
  //     setLoading(true);

  //     const apiResponse = await createAccountWithSocialPlatform(
  //       platformname,
  //       session
  //     );
  //     console.log("apiResponse", platformname, session);
  //     if (apiResponse.status === false) {
  //       if (process.env.NODE_ENV === "development") {
  //         alert(apiResponse.message);
  //         console.log("Register data data:", apiResponse);
  //         setLoading(false);
  //       }
  //       return;
  //     }
  //     if (process.env.NODE_ENV === "development") {
  //       console.log("Register data data:", apiResponse);
  //     }
  //     alert(apiResponse.message);
  //     setLoading(false);
  //     router.push("/");
  //   } catch (error) {
  //     if (process.env.NODE_ENV === "development") {
  //       console.error("Error during registration:", error.message);
  //     }
  //   }
  // }
  const handleSocialRegisterClick = async (provider) => {
    alert(`Register with ${provider} is coming soon!`);
    // const platformname = "google";
    // const apiResponse = await createAccountWithSocialPlatform(
    //   platformname,
    //   session
    // );
    console.log("apiResponse", apiResponse);
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
                ></Image>
                <Image
                  src="/login/facebook.png"
                  alt="facebook"
                  height={25}
                  width={25}
                  className="facebook-icon"
                  onClick={() => handleFacebookSignIn("Facebook")}
                ></Image>
                <Image
                  src="/login/twitter.png"
                  alt="twitter"
                  height={25}
                  width={25}
                  className="twitter-icon"
                  onClick={() => handleSocialRegisterClick("Twitter")}
                ></Image>
                <Image
                  src="/login/linkedin.png"
                  alt="linkedin"
                  height={25}
                  width={25}
                  className="linkedin-icon"
                  onClick={async () =>
                    await handleSocialRegisterClick("LinkedIn")
                  }
                ></Image>
                <Image
                  src="/login/github.png"
                  alt="github"
                  height={25}
                  width={25}
                  className="github-icon"
                  onClick={() => handleGithubSignIn("GitHub")}
                ></Image>
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
