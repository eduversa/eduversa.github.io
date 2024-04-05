import React, { Fragment, useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { AllLoader } from "@/components";
import { logoutApi } from "@/functions";

function Navbar() {
  const router = useRouter();
  const logoText = "eduversa";
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [userType, setUserType] = useState(null);
  const [showMenuPanel, setShowMenuPanel] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState(null);
  const [customLinks, setCustomLinks] = useState([]);

  //@ Its Handling the logout functionality
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

  //@ Toggling the sidenavbar
  const toggleSideNavbar = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  //@ This code will handle the user type and their respective links
  useEffect(() => {
    const storedUserType = localStorage.getItem("userType");
    setUserType(storedUserType);

    const storedCustomLinks =
      JSON.parse(localStorage.getItem("customLinks")) || [];
    setCustomLinks(storedCustomLinks);
  }, []);

  //@ Function to add custom link
  const addCustomLink = (link) => {
    if (customLinks.length < 4) {
      const updatedLinks = [...customLinks, link];
      setCustomLinks(updatedLinks);
      localStorage.setItem("customLinks", JSON.stringify(updatedLinks));
      setShowMenuPanel(false);
    }
  };

  //@ Function to remove custom link
  const removeCustomLink = (index) => {
    const updatedLinks = [...customLinks];
    updatedLinks.splice(index, 1);
    setCustomLinks(updatedLinks);
    localStorage.setItem("customLinks", JSON.stringify(updatedLinks));
  };

  const menuContents = {
    superAdmin: [],
    admin: [
      { label: "Dashboard", className: "nav-item", src: "/admin/dashboard" },
      {
        label: "Manage Applicants",
        className: "nav-item",
        src: "/admin/manage/applicants",
      },
      {
        label: "Manage Students",
        className: "nav-item",
        src: "/admin/manage/students",
      },
    ],
    faculty: [
      { label: "Dashboard", className: "nav-item", src: "/faculty/dashboard" },
    ],
    student: [
      { label: "Dashboard", className: "nav-item", src: "/student/dashboard" },
    ],
  };

  const userMenuLinks = menuContents[userType] || [];

  return (
    <Fragment>
      {isLoading && <AllLoader />}
      <header>
        <nav className="navbar">
          <div className="logo">
            <Link href="/">
              <span className="logo-text">{logoText}</span>
            </Link>
          </div>
          <div className="navbar-links">
            {customLinks.map((link, index) => (
              <div key={index} className="nav-item">
                <Link href={link.src} className="nav-item-link">
                  <span>{link.label}</span>
                </Link>
                <button onClick={() => removeCustomLink(index)}>X</button>
              </div>
            ))}
            <div
              className="nav-item"
              onClick={() => setShowMenuPanel(!showMenuPanel)}
            >
              <span style={{ cursor: "pointer" }}>+</span>
            </div>
          </div>
          <div
            className={`menu ${isMenuOpen && "open"}`}
            onClick={toggleSideNavbar}
          >
            <div className="menu-line"></div>
            <div className="menu-line"></div>
            <div className="menu-line"></div>
          </div>
        </nav>
        {showMenuPanel && (
          <div className="menu-panel">
            <ul>
              {userMenuLinks.map((item, index) => (
                <li key={index} onClick={() => addCustomLink(item)}>
                  {item.label}
                </li>
              ))}
            </ul>
          </div>
        )}
      </header>
    </Fragment>
  );
}

export default Navbar;
