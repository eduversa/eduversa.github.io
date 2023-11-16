import React, { Fragment, useState } from "react";

function ApplicantNavbar() {
  const logoText = "eduversa";
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menuItems = [
    { label: "Dashboard", className: "nav-item" },
    { label: "Update Profile", className: "nav-item" },
    { label: "About Us", className: "nav-item" },
    { label: "Contact Us", className: "nav-item" },
  ];

  return (
    <Fragment>
      <header>
        <nav className="applicant-nav">
          <div className="logo">
            <span className="logo-text">{logoText}</span>
          </div>
          <div className="nav-section">
            <ul className="nav-list">
              {menuItems.map((item, index) => (
                <li key={index} className={item.className}>
                  <span>{item.label}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="button-section">
            <button className="logout-button">Logout</button>
          </div>
          <div
            className={`menu ${isMenuOpen && "open"}`}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <div className="menu-line"></div>
            <div className="menu-line"></div>
            <div className="menu-line"></div>
          </div>
          {isMenuOpen && (
            <div className="mobile-menu">
              <ul className="mobile-nav-list">
                {menuItems.map((item, index) => (
                  <li key={index} className="mobile-nav-item">
                    <span>{item.label}</span>
                  </li>
                ))}
                <li className="mobile-nav-item">
                  <button className="logout-button">Logout</button>
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
