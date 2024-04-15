import { Fragment, useEffect } from "react";
import { LandingNavbar, LandingPage, ChatBot } from "@/containers";
import { useRouter } from "next/router";
function LandingLayout({ children }) {
  const router = useRouter();
  useEffect(() => {
    const authToken = localStorage.getItem("authToken");
    const userType = localStorage.getItem("userType");
    if (process.env.NODE_ENV === "development") {
      console.log("AuthToken", authToken);
      console.log("UserType", userType);
    }
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
        localStorage.clear();
      }
    }
  }, [router]);
  return (
    <Fragment>
      <LandingNavbar></LandingNavbar>
      <div className="homepage">
        <LandingPage></LandingPage>
        <div className="homepage-right">{children}</div>
      </div>
      <ChatBot></ChatBot>
    </Fragment>
  );
}
export default LandingLayout;
