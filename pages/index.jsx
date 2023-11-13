import { Fragment, useState } from "react";
import { LandingLayout } from "@/layout";
import Image from "next/image";
function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  return (
    <Fragment>
      <LandingLayout>
        <div className="login">
          <h2 className="login__heading">Login</h2>
          <form className="login__form">
            <div className="login__username">
              <Image
                src="/login/username.png"
                alt="username"
                height={20}
                width={20}
                className="username__icon"
              ></Image>
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="username-input"
              />
            </div>
            <div className="input-group">
              <Image
                src="/login/password.png"
                alt="username"
                height={20}
                width={20}
              ></Image>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="password-input"
              />
            </div>
            <button type="button" className="login-button">
              Login
            </button>
          </form>
        </div>
      </LandingLayout>
    </Fragment>
  );
}
export default Login;
