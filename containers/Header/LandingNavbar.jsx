import { Fragment } from "react";
import Link from "next/link";

function LandingNavbar() {
  const logoText = "eduversa";

  return (
    <Fragment>
      <header>
        <nav>
          <div className="logo">
            <Link href="/">{logoText && <span>{logoText}</span>}</Link>
          </div>
          <div>
            <ul>
              <li>
                <Link href="/about">About US</Link>
              </li>
              <li>
                <Link href="/contact">Contact US</Link>
              </li>
            </ul>
          </div>
          <div>
            <button>
              <Link href="/">Login</Link>
            </button>
            <button>
              <Link href="/register">Register</Link>
            </button>
          </div>
        </nav>
      </header>
    </Fragment>
  );
}

export default LandingNavbar;
