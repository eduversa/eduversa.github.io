import { Fragment } from "react";
function LandingNavbar() {
  return (
    <Fragment>
      <header>
        <nav>
          <ul>
            <li>
              <a href="/sample">Home</a>
            </li>
            <li>
              <a href="/about">About</a>
            </li>
            <li>
              <a href="/contact">Contact</a>
            </li>
          </ul>
        </nav>
      </header>
    </Fragment>
  );
}

export default LandingNavbar;
