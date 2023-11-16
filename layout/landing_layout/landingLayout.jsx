/* eslint-disable react-hooks/exhaustive-deps */
import { Fragment, useEffect } from "react";
import { LandingNavbar, LandingPage } from "@/containers";
import { useRouter } from "next/router";
function LandingLayout({ children }) {
  const router = useRouter();
  useEffect(() => {
    const authToken = localStorage.getItem("authToken");
    const userType = localStorage.getItem("userType");
    console.log("AuthToken", authToken);
    console.log("UserType", userType);
    if (authToken) {
      if (userType === "applicant") {
        router.push("/applicant");
      } else if (userType === "student") {
        router.push("/student");
      } else if (userType === "faculty") {
        router.push("/faculty");
      } else if (userType === "admin") {
        router.push("/admin");
      } else {
        localStorage.removeItem("authToken");
      }
    }
  }, []);
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
