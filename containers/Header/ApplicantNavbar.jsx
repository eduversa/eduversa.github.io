import React, { Fragment, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { AllLoader } from "@/components";
import { withLoading, devLog, apiRequest } from "@/utils/apiUtils";
import { useAlert } from "@/contexts/AlertContext";
function ApplicantNavbar() {
  const router = useRouter();
  const logoText = "eduversa";
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { showAlert } = useAlert();
  const handleLogout = async () => {
    const userId = localStorage.getItem("userid");
    const authToken = localStorage.getItem("authToken");

    try {
      const wrappedApiRequest = withLoading(
        apiRequest,
        setIsLoading,
        showAlert,
        "Logout"
      );

      const response = await wrappedApiRequest(
        `/account/auth?user_id=${userId}`,
        "PATCH",
        null,
        authToken,
        "Logout"
      );

      if (!response.success || response.status === false) {
        devLog("Logout error:", response);
        showAlert(response.message);
        return;
      }
      devLog("Logout response:", response);
      showAlert(response.message);
      localStorage.clear();
      router.push("/");
    } catch (error) {
      devLog("global error:", error);
      showAlert("An unexpected error occurred. Please try again.");
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
