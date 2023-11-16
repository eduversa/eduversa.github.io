import React, { Fragment, useState } from "react";
import Link from "next/link";

function ApplicantNavbar() {
  const logoText = "eduversa";
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menuItems = [
    { label: "Dashboard", className: "nav-item", src: "/applicant" },
    {
      label: "Update Profile",
      className: "nav-item",
      src: "/applicant/update",
    },
    { label: "About Us", className: "nav-item", src: "/applicant/about" },
    { label: "Contact Us", className: "nav-item", src: "/applicant/contact" },
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
                  <Link href={item.src}>
                    <span>{item.label}</span>
                  </Link>
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
                    <Link href={item.src}>
                      <span>{item.label}</span>
                    </Link>
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
