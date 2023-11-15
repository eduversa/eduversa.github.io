import { Fragment, useState } from "react";
function ApplicantNavbar() {
  const logoText = "eduversa";
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  return (
    <Fragment>
      <header>
        <nav className="applicant-nav"></nav>
      </header>
    </Fragment>
  );
}

export default ApplicantNavbar;
