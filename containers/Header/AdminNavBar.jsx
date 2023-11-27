import Link from "next/link";
import { useRouter } from "next/router";
import { logoutApi } from "@/functions";
import { AllLoader } from "@/components";
import React, { Fragment, useState } from "react";

function AdminNavbar() {
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
  const menuItems = [
    { label: "Dashboard", className: "nav-item", src: "/admin" },
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
  ];

  return (
    <Fragment>
      {isLoading && <AllLoader />}
      <header>
        <nav className="admin-nav">
          <div className="logo">
            <Link href="/">
              <span className="logo-text">{logoText}</span>
            </Link>
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
                <p className="sidenavbar__brand__name">Eduversa</p>
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
                {menuItems.map((item) => {
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

export default AdminNavbar;
