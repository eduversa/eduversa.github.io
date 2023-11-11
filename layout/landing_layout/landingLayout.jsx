import { Fragment } from "react";
import { LandingNavbar, LandingPage } from "@/containers";
function LandingLayout({ children }) {
  return (
    <Fragment>
      <LandingNavbar></LandingNavbar>
      <div className="homepage">
        <LandingPage></LandingPage>
        <div className="homepage-right">{children}</div>
      </div>
    </Fragment>
  );
}
export default LandingLayout;
