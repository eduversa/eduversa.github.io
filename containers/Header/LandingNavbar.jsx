import { Fragment } from "react";
import Link from "next/link";
function LandingNavbar() {
  return (
    <Fragment>
      <header>
        <nav>
          <ul>
            <li>
              <Link href="/">Login</Link>
            </li>
            <li>
              <Link href="/register">Register</Link>
            </li>
            <li>
              <Link href="/about">About</Link>
            </li>
            <li>
              <Link href="/contact">Contact</Link>
            </li>
          </ul>
        </nav>
      </header>
    </Fragment>
  );
}

export default LandingNavbar;
