import React, { Fragment, useEffect, useState } from 'react';

const Footer = () => {
  const [userType, setUserType] = useState(null);

  useEffect(() => {
   
    const storedUserType = localStorage.getItem('userType');
    setUserType(storedUserType);
  }, []);


  const footerContent = {
    student: [
      { label: 'Update ID Card', href: '/update-id-card' },
      { label: 'Dashboard', href: '/dashboard' },
    ],
    applicant: [
      { label: 'Dashboard', href: '/applicant' },
      { label: 'Update Profile', href: '/applicant/update' },
      { label: 'About Us', href: '/applicant/about' },
      { label: 'Contact Us', href: '/applicant/contact' },
    ],

  };


  const userFooterLinks = footerContent[userType];
  let year = new Date().getFullYear().toString();

  return (
    <Fragment>
    <footer className='footer'>
     
    <div className="copyright">
            <p>&copy; {year} Eduversa. All Rights Reserved.</p>
          </div>
      <ul>
        {userFooterLinks ? (
          userFooterLinks.map((link, index) => (
            <li className= "nav-links" key={index}>
              <a href={link.href}>{link.label}</a>
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
