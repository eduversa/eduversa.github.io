import { Fragment } from "react";
import { LandingNavbar } from "@/containers";
function LandingLayout({ children }) {
  return (
    <Fragment>
      <LandingNavbar></LandingNavbar>
      {children}
    </Fragment>
  );
}
export default LandingLayout;
