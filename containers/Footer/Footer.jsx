import React, { Fragment, useState } from "react";
import Link from "next/link";


function Footer() {
  let year = new Date().getFullYear().toString();

  const menuItems = [
    { label: "Applicant", className: "nav-items", src: "/applicant" },
    {
      label: "Student",
      className: "nav-items",
      src: "/applicant",
    },
    { label: "Faculty", className: "nav-items", src: "/applicant" },
    { label: "Admin", className: "nav-items", src: "/applicant" },
  ];


  return (

    <Fragment>
      <footer>
        <nav className="footer-nav">
          <div className="copyright">
            <p>&copy; {year} Eduversa. All Rights Reserved.</p>
          </div>
          <div className="nav-links">
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
        </nav>
      </footer>
    </Fragment>
  )
}

export default Footer;