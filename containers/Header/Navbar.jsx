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
  const [selectedMenuItem, setSelectedMenuItem] = useState(null);
  const [customMenuItems, setCustomMenuItems] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
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
  // @ Its tooggling the sidenavbar
  const toggleSideNavbar = () => {
    const navContainer = document.getElementById("navContainer");
    const width = navContainer.offsetWidth;
    if (width > 0) {
      navContainer.style.width = "0px";
    } else {
      navContainer.style.width = "100%";
    }
    setIsMenuOpen(!isMenuOpen);
  };

  // @ This code will handle the user type and their respective links
  useEffect(() => {
    const storedUserType = localStorage.getItem("userType");
    setUserType(storedUserType);
  }, []);
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
      {
        label: "Update Applicants",
        className: "nav-item",
        src: "/admin/update/applicants",
      },
      {
        label: "Update Students",
        className: "nav-item",
        src: "/admin/update/students",
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

  //@ Function to handle the addition of a new menu item
  const addMenuItem = () => {
    if (selectedMenuItem) {
      setCustomMenuItems([...customMenuItems, selectedMenuItem]);
      setSelectedMenuItem(null);
      setIsModalOpen(false);
    }
  };
  const navigateToCustomMenuItem = (item) => {
    router.push(item.src);
    setIsMenuOpen(false);
  };

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
          <div className="navbar-user-defined-items">
            {customMenuItems.map((item, index) => (
              <div
                key={index}
                className="custom-menu-item"
                onClick={() => navigateToCustomMenuItem(item)}
              >
                {item.label}
              </div>
            ))}
            {isModalOpen && (
              <div className="modal">
                <select
                  value={selectedMenuItem ? selectedMenuItem.src : ""}
                  onChange={(e) => {
                    const selectedItem = userMenuLinks.find(
                      (item) => item.src === e.target.value
                    );
                    setSelectedMenuItem(selectedItem);
                  }}
                >
                  <option value="" disabled>
                    Select a menu item
                  </option>
                  {userMenuLinks.map((item) => (
                    <option key={item.label} value={item.src}>
                      {item.label}
                    </option>
                  ))}
                </select>
                <button onClick={addMenuItem}>Add</button>
                <button onClick={() => setIsModalOpen(false)}>Cancel</button>
              </div>
            )}
            <div className="add-menu-item" onClick={() => setIsModalOpen(true)}>
              +
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
          <div id="navContainer" className="sidenavbar">
            <div className="sidenavbar__container">
              <div className="sidenavbar__brand">
                <span className="sidenavbar__brand__name">{logoText}</span>
                <div
                  className={`menu ${isMenuOpen && "open"}`}
                  onClick={toggleSideNavbar}
                >
                  <div className="menu-line"></div>
                  <div className="menu-line"></div>
                  <div className="menu-line"></div>
                </div>
              </div>

              <ul className="sidenavbar__menu">
                {userMenuLinks.map((item) => {
                  return (
                    <li
                      key={JSON.stringify(item)}
                      className="sidenavbar__menu-item"
                    >
                      <Link href={item.src} className="sidenavbar__menu-link">
                        <span>{item.label}</span>
                      </Link>
                    </li>
                  );
                })}
                <li className="sidenavbar__menu-item">
                  <button
                    className="sidenavbar__menu-btn"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </nav>
      </header>
    </Fragment>
  );
}

export default Navbar;
