import { Fragment, useState } from "react";
import { LandingLayout } from "@/layout";
import Image from "next/image";
import Link from "next/link";
function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <Fragment>
      <LandingLayout>
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
                ></Image>
                <Image
                  src="/login/facebook.png"
                  alt="facebook"
                  height={25}
                  width={25}
                  className="facebook-icon"
                ></Image>
                <Image
                  src="/login/twitter.png"
                  alt="twitter"
                  height={25}
                  width={25}
                  className="twitter-icon"
                ></Image>
                <Image
                  src="/login/linkedin.png"
                  alt="linkedin"
                  height={25}
                  width={25}
                  className="linkedin-icon"
                ></Image>
                <Image
                  src="/login/github.png"
                  alt="github"
                  height={25}
                  width={25}
                  className="github-icon"
                ></Image>
              </div>
            </div>
            <div className="button-container">
              <button type="submit" className="login-button">
                Login
              </button>
            </div>
            <div className="extra-options">
              <span className="forget-password">Forgot Password?</span>
              <div className="register">
                <span>New to universa?</span>
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
