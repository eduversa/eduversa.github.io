import React, { Fragment, useState } from "react";
import Link from "next/link";


function Footer() {
  let year = new Date().getFullYear().toString();

  return (

    <Fragment>
      <footer>
        <nav className="footer-nav">
          <div className="copyright">
            <p>&copy; {year} Eduversa. All Rights Reserved.</p>
          </div>
          <div className="nav-links">
            <Link href="/">Demo1</Link>
            <Link href="/">Demo2</Link>
            <Link href="/">Demo3</Link>
          </div>
        </nav>
      </footer>
    </Fragment>
  )
}

export default Footer