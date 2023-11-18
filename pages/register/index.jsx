import { Fragment, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { LandingLayout } from "@/layout";
import { registerUser } from "@/functions";
import { AllLoader } from "@/components";
function Register() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const registrationData = await registerUser(email);
      if (registrationData.status === false) {
        console.log("Registration data:", registrationData);
        alert(registrationData.message);
        setLoading(false);
        return;
      }

      console.log("Registration data:", registrationData);
      localStorage.setItem("registeredUserId", registrationData.data.user_id);
      alert(
        "Registration Was Successful! Check Your Email For Login Credentials"
      );
      setLoading(false);
      router.push("/");
    } catch (error) {
      console.error("Error during registration:", error.message);
    }
  };
  const handleSocialRegisterClick = (provider) => {
    alert(`Register with ${provider} is coming soon!`);
  };
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
                  onClick={() => handleSocialRegisterClick("Google")}
                ></Image>
                <Image
                  src="/login/facebook.png"
                  alt="facebook"
                  height={25}
                  width={25}
                  className="facebook-icon"
                  onClick={() => handleSocialRegisterClick("Facebook")}
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
                  onClick={() => handleSocialRegisterClick("LinkedIn")}
                ></Image>
                <Image
                  src="/login/github.png"
                  alt="github"
                  height={25}
                  width={25}
                  className="github-icon"
                  onClick={() => handleSocialRegisterClick("GitHub")}
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
