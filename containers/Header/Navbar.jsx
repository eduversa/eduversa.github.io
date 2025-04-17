import React, { Fragment, useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { AllLoader } from "@/components";
import { logoutApi } from "@/functions";
import Image from "next/image";
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
    setIsMenuOpen((prevState) => !prevState);
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
    const MAX_CUSTOM_LINKS = 4;

    if (customLinks.length < MAX_CUSTOM_LINKS && !customLinks.includes(link)) {
      const updatedLinks = [...customLinks, link];
      setCustomLinks(updatedLinks);
      localStorage.setItem("customLinks", JSON.stringify(updatedLinks));
      setShowMenuPanel(false);
    } else {
      alert("Maximum custom links reached or link already added.");
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
        label: "Manage Faculties",
        className: "nav-item",
        src: "/admin/manage/faculties",
      },
      {
        label: "Contact Us",
        className: "nav-item",
        src: "/admin/contact",
      },
      {
        label: "About Us",
        className: "nav-item",
        src: "/admin/about",
      },
      {
        label: "Scanner",
        className: "nav-item",
        src: "/admin/scanner",
      },
      {
        label: "Create Room",
        className: "nav-item",
        src: "/createRoom",
      },
      {
        label: "Create Course",
        className: "nav-item",
        src: "/createCourse",
      },
      {
        label: "Create Routine",
        className: "nav-item",
        src: "/createRoutine",
      },
      {
        label: "Create Stream",
        className: "nav-item",
        src: "/createStream",
      },
      {
        label: "Create Subject",
        className: "nav-item",
        src: "/createSubject",
      },
    ],
    faculty: [
      { label: "Dashboard", className: "nav-item", src: "/faculty" },

      {
        label: "Update Profile",
        className: "nav-item",
        src: "/faculty/update",
      },
      {
        label: "Contact Us",
        className: "nav-item",
        src: "/faculty/contact",
      },
      {
        label: "About Us",
        className: "nav-item",
        src: "/faculty/about",
      },
      {
        label: "Scanner",
        className: "nav-item",
        src: "/faculty/scanner",
      },
    ],
    student: [
      { label: "Dashboard", className: "nav-item", src: "/student" },
      {
        label: "Update Profile",
        className: "nav-item",
        src: "/student/update",
      },
      {
        label: "Contact Us",
        className: "nav-item",
        src: "/student/contact",
      },
      {
        label: "About Us",
        className: "nav-item",
        src: "/student/about",
      },
      {
        label: "Scanner",
        className: "nav-item",
        src: "/student/scanner",
      },
    ],
  };

  const userMenuLinks = menuContents[userType] || [];

  const filteredMenuLinks = userMenuLinks.filter(
    (item) => !customLinks.some((link) => link.src === item.src)
  );

  return (
    <Fragment>
      {isLoading && <AllLoader />}
      <header>
        <nav className="navbar none">
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
                <button onClick={() => removeCustomLink(index)}>
                  <Image
                    className="close-icon"
                    src="/nav/close.png"
                    alt="Remove custom link"
                    width={30}
                    height={30}
                  />
                </button>
              </div>
            ))}
            {customLinks.length < 4 && (
              <div
                className="nav-item"
                onClick={() => setShowMenuPanel(!showMenuPanel)}
              >
                <span style={{ cursor: "pointer" }}>
                  <Image
                    src="/nav/add.png"
                    alt="Add custom link"
                    width={30}
                    height={30}
                    className="add-icon"
                  />
                </span>
              </div>
            )}
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
              {filteredMenuLinks.map((item, index) => (
                <li key={index} onClick={() => addCustomLink(item)}>
                  {item.label}
                </li>
              ))}
            </ul>
          </div>
        )}
      </header>
      <div className={`sidenavbar ${isMenuOpen && "open"}`}>
        <div className="sidenavbar__container">
          <div className="upper-side">
            <div className="sidenavbar__brand">
              <span className="sidenavbar__brand__name">{logoText}</span>
            </div>
            <ul className="sidenavbar__menu">
              {userMenuLinks.map((item, index) => (
                <li key={index} className="sidenavbar__menu-item">
                  <Link href={item.src} className="sidenavbar__menu-link">
                    <span>{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="sidenavbar__logout lower-side">
            <button onClick={handleLogout}>Logout</button>
          </div>
        </div>
      </div>
    </Fragment>
  );
}

export default Navbar;
