import React, { Fragment, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { logoutApi } from "@/functions";
import { AllLoader } from "@/components";

function ApplicantNavbar() {
  const router = useRouter();
  const logoText = "eduversa";
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    const userId = localStorage.getItem("userid");
    const authToken = localStorage.getItem("authToken");

    try {
      setIsLoading(true);
      const apiResponse = await logoutApi(userId, authToken);
      if (apiResponse.status === false) {
        alert(apiResponse.message);
        setIsLoading(false);
        return;
      }
      if (process.env.NODE_ENV === "development") {
        console.log("Logout data:", apiResponse);
      }
      localStorage.removeItem("authToken");
      localStorage.removeItem("email");
      localStorage.removeItem("userType");
      localStorage.removeItem("userid");
      localStorage.removeItem("applicant_profile");
      localStorage.clear();
      alert(apiResponse.message);
      setIsLoading(false);
      router.push("/");
    } catch (error) {
      if (process.env.NODE_ENV === "development") {
        console.error("Logout error:", error.message);
      }
    }
  };
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
      {isLoading && <AllLoader />}
      <header>
        <nav className="applicant-nav">
          <div className="logo">
            <Link href="/">
              <span className="logo-text">{logoText}</span>
            </Link>
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
            <button className="logout-button" onClick={handleLogout}>
              Logout
            </button>
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
                  <button className="logout-button" onClick={handleLogout}>
                    Logout
                  </button>
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
