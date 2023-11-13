import { Fragment, useState } from "react";
import { LandingLayout } from "@/layout";
import Image from "next/image";
import Link from "next/link";

function Register() {
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Registering...", email);
  };

  return (
    <Fragment>
      <LandingLayout>
        <div className="register-container">
          <h2 className="register-heading">Register</h2>
          <form className="register-form" onSubmit={handleSubmit}>
            <div className="register-email">
              <Image
                src="/register/email.png"
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

            <div className="button-container">
              <button type="submit" className="register-button">
                Register
              </button>
            </div>

            <div className="login-prompt">
              <span>Already have an account?</span>
              <Link href="/login">
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
