import { Fragment } from "react";
import Link from "next/link";

function LandingNavbar() {
  const logoText = "eduversa";

  return (
    <Fragment>
      <header>
        <nav className="navbar">
          <div className="logo">
            <Link href="/">
              <a className="logo-link">{logoText && <span>{logoText}</span>}</a>
            </Link>
          </div>
          <div className="nav-section">
            <ul className="nav-list">
              <li className="nav-item">
                <Link href="/about">
                  <a>About US</a>
                </Link>
              </li>
              <li className="nav-item">
                <Link href="/contact">
                  <a>Contact US</a>
                </Link>
              </li>
            </ul>
          </div>
          <div className="button-section">
            <button className="login-button">
              <Link href="/">Login</Link>
            </button>
            <button className="register-button">
              <Link href="/register">Register</Link>
            </button>
          </div>
        </nav>
      </header>
    </Fragment>
  );
}

export default LandingNavbar;
