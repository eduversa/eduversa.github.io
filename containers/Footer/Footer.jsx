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
      { label: "update data application", href: "/student/update" },
      { label: "About Us", href: "/student/about" },
      { label: "Contact Us", href: "/student/contact" },
      { label: "Logout", href: "/student/logout" },
    ],
    applicant: [
      { label: "Dashboard", href: "/applicant" },
      { label: "Update Profile", href: "/applicant/update" },
      { label: "About Us", href: "/applicant/about" },
      { label: "Contact Us", href: "/applicant/contact" },
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
