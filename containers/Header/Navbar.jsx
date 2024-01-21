import React, { useState, useEffect } from "react";
import Link from "next/link";

function Navbar() {
  const [activeItem, setActiveItem] = useState("Dashboard");
  const [userType, setUserType] = useState("");

  const handleItemClick = (item) => {
    setActiveItem(item.label);
  };

  useEffect(() => {
    const storedUserType = localStorage.getItem("userType");
    setUserType(storedUserType);
  }, []);

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
    faculty: [{ label: "Dashboard", className: "nav-item", src: "/faculty" }],
    student: [{ label: "Dashboard", className: "nav-item", src: "/student" }],
  };

  const userMenuLinks = menuContents[userType] || [];

  const handleAddCustomLink = () => {
    if (selectedCustomLink && customLinks.length < 4) {
      setCustomLinks([...customLinks, selectedCustomLink]);
      setSelectedCustomLink(null);
    }
  };
  return (
    <nav className="navbar">
      <ul className="nav-list">
        {userMenuLinks.map((item) => (
          <li
            key={item.label}
            className={`nav-item ${activeItem === item.label ? "active" : ""}`}
          >
            <Link href={item.src} passHref>
              <div className="nav-link" onClick={() => handleItemClick(item)}>
                {item.label}
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default Navbar;
