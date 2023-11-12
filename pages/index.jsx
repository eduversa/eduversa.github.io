import { Fragment, useState } from "react";
import { LandingLayout } from "@/layout";
import { LandingPage } from "@/containers";

// Import your images or replace with actual image URLs
import usernameIcon from "./path/to/username-icon.png";
import passwordIcon from "./path/to/password-icon.png";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Username:", username);
    console.log("Password:", password);
    // Add your authentication logic here
  };

  return (
    <Fragment>
      <LandingLayout>
        <div className="login-container">
          <h2>Login</h2>
          <form className="login-form" onSubmit={handleSubmit}>
            <label className="form-label">
              <img src={usernameIcon} alt="Username" className="input-icon" />
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
              <img src={passwordIcon} alt="Password" className="input-icon" />
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
