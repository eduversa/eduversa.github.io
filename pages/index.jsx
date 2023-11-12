import { Fragment, useState } from "react";
import { LandingLayout } from "@/layout";
import Image from "next/image";
function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Username:", username);
    console.log("Password:", password);
  };

  return (
    <Fragment>
      <LandingLayout>
        <div className="login-container">
          <h2>Login</h2>
          <form className="login-form" onSubmit={handleSubmit}>
            <label className="form-label">
              <Image
                src="/login/username.png"
                alt="Username"
                height={20}
                width={20}
              ></Image>
              Username:
              <input
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="form-input"
              />
            </label>
            <br />
            <label className="form-label">
              <Image
                src="/login/password.png"
                alt="Password"
                height={20}
                width={20}
              ></Image>
              Password:
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-input"
              />
            </label>
            <br />
            <button type="submit" className="login-button">
              Login
            </button>
          </form>
        </div>
      </LandingLayout>
    </Fragment>
  );
}

export default Login;
