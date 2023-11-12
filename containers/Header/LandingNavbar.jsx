import { Fragment, useState } from "react";
import Link from "next/link";

function LandingNavbar() {
  const logoText = "eduversa";
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  return (
    <Fragment>
      <header>
        <nav className="navbar">
          <div className="logo">
            <Link href="/">
              <span className="logo-text">{logoText}</span>
            </Link>
          </div>
          <div className="nav-section">
            <ul className="nav-list">
              <li className="nav-item">
                <Link href="/about">
                  <span>About Us</span>
                </Link>
              </li>
              <li className="nav-item">
                <Link href="/contact">
                  <span>Contact Us</span>
                </Link>
              </li>
            </ul>
          </div>
          <div className="button-section">
            <Link href="/">
              <button className="login-button">Login</button>
            </Link>
            <Link href="/register">
              <button className="register-button">Register</button>
            </Link>
          </div>
          <div
            className={`menu ${isMenuOpen ? "open" : ""}`}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <div className="menu-line"></div>
            <div className="menu-line"></div>
            <div className="menu-line"></div>
          </div>
          {isMenuOpen && (
            <div className="mobile-menu">
              <ul className="mobile-nav-list">
                <li className="mobile-nav-item">
                  <Link href="/">
                    <span>Home</span>
                  </Link>
                </li>
                <li className="mobile-nav-item">
                  <Link href="/about">
                    <span>About Us</span>
                  </Link>
                </li>
                <li className="mobile-nav-item">
                  <Link href="/contact">
                    <span>Contact Us</span>
                  </Link>
                </li>
                <li className="mobile-nav-item">
                  <Link href="/">
                    <span>Login</span>
                  </Link>
                </li>
                <li className="mobile-nav-item">
                  <Link href="/register">
                    <span>Register</span>
                  </Link>
                </li>
              </ul>
            </div>
          )}
        </nav>
      </header>
    </Fragment>
  );
}

export default LandingNavbar;
