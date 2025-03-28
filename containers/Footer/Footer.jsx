import React, { Fragment, useEffect, useState } from "react";
import Link from "next/link";
const Footer = () => {
  const [userType, setUserType] = useState(null);

  useEffect(() => {
    const storedUserType = localStorage.getItem("userType");
    setUserType(storedUserType);
  }, []);

  const footerContent = {
    student: [
      { label: "Dashboard", href: "/student" },
      {
        label: "Update Profile",

        href: "/student/update",
      },
      {
        label: "Contact Us",

        href: "/student/contact",
      },
      {
        label: "About Us",

        href: "/student/about",
      },
      {
        label: "Scanner",

        href: "/student/scanner",
      },
    ],
    applicant: [
      { label: "Dashboard", href: "/applicants" },
      { label: "Update Profile", href: "/applicant/update" },
      { label: "About Us", href: "/applicant/about" },
      { label: "Contact Us", href: "/applicant/contact" },
    ],
    admin: [
      { label: "Dashboard", href: "/admin" },
      { label: "About Us", href: "/admin/about" },
      { label: "Contact Us", href: "/admin/contact" },
      { label: "manage Applicants", href: "/admin/manage/applicants" },
      { label: "manage Students", href: "/admin/manage/students" },
      { label: "manage Faculties", href: "/admin/manage/faculties" },
      { label: "scanner", href: "/admin/scanner" },
    ],
    faculty: [
      { label: "Dashboard", href: "/faculty" },
      { label: "Update Profile", href: "/faculty/update" },
      { label: "Contact Us", href: "/faculty/contact" },
      { label: "About Us", href: "/faculty/about" },
      { label: "Scanner", href: "/faculty/scanner" },
    ],
  };

  const userFooterLinks = footerContent[userType];
  let year = new Date().getFullYear().toString();

  return (
    <Fragment>
      <footer className="footer">
        <div className="copyright">
          <p>&copy; {year} Eduversa. All Rights Reserved.</p>
        </div>
        <ul>
          {userFooterLinks ? (
            userFooterLinks.map((link, index) => (
              <li className="nav-links" key={index}>
                <Link href={link.href}>{link.label}</Link>
              </li>
            ))
          ) : (
            <li>User type &apos;{userType}&apos; not found in footerContent</li>
          )}
        </ul>
      </footer>
    </Fragment>
  );
};

export default Footer;
