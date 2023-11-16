import { Fragment, useState } from "react";
function ApplicantNavbar() {
  const logoText = "eduversa";
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  return (
    <Fragment>
      <header>
        <nav className="applicant-nav">
          <div className="logo">
            <span className="logo-text">{logoText}</span>
          </div>
          <div className="nav-section">
            <ul className="nav-list">
              <li className="nav-item">
                <span>Dashboard</span>
              </li>
              <li className="nav-item">
                <span>Update Profile</span>
              </li>
              <li className="nav-item">
                <span>About Us</span>
              </li>
              <li className="nav-item">
                <span>Contact Us</span>
              </li>
            </ul>
          </div>
          <div className="button-section">
            <button className="logout-button">Logout</button>
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
                  <span>Dashboard</span>
                </li>
                <li className="mobile-nav-item">
                  <span>Profile</span>
                </li>
                <li className="mobile-nav-item">
                  <span>Settings</span>
                </li>
                <li className="mobile-nav-item">
                  <button className="mobile-logout-button">Logout</button>
                </li>
              </ul>
            </div>
          )}
        </nav>
      </header>
    </Fragment>
  );
}

export default ApplicantNavbar;
