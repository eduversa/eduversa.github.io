import { Fragment, useEffect } from "react";
import { LandingNavbar, LandingPage, ChatBotv2 } from "@/containers";
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
        localStorage.removeItem("authToken");
      }
    }
  }, [router]);
  return (
    <Fragment>
      <LandingNavbar></LandingNavbar>
      <ChatBotv2></ChatBotv2>
      <div className="homepage">
        <LandingPage></LandingPage>
        <div className="homepage-right">{children}</div>
      </div>
    </Fragment>
  );
}
export default LandingLayout;
