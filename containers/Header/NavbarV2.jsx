import React, { useState, useEffect } from "react";
import Link from "next/link";

function NavbarV2() {
  const [activeItem, setActiveItem] = useState("Dashboard");
  const [userType, setUserType] = useState("");
  const [selectedCustomLink, setSelectedCustomLink] = useState(null);
  const [customLinks, setCustomLinks] = useState([]);

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
  //  A Comment Just For The Day.
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
        {customLinks.map((customLink, index) => (
          <li key={`custom-${index}`} className="nav-item">
            <Link href={customLink.src} passHref>
              <div
                className={`nav-link ${
                  activeItem === customLink.label ? "active" : ""
                }`}
                onClick={() => handleItemClick(customLink)}
              >
                {customLink.label}
              </div>
            </Link>
          </li>
        ))}
      </ul>

      {/* Dropdown to select existing userMenuLinks */}
      <div>
        <select
          value={selectedCustomLink ? selectedCustomLink.label : ""}
          onChange={(e) => {
            const selectedLabel = e.target.value;
            const selectedLink = userMenuLinks.find(
              (link) => link.label === selectedLabel
            );
            setSelectedCustomLink(selectedLink);
          }}
        >
          <option value="" disabled>
            Select a link
          </option>
          {userMenuLinks.map((link) => (
            <option key={link.label} value={link.label}>
              {link.label}
            </option>
          ))}
        </select>
        <button onClick={handleAddCustomLink}>Add Custom Link</button>
      </div>
    </nav>
  );
}

export default NavbarV2;
