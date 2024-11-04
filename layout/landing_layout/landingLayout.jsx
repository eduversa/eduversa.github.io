import { Fragment, useEffect, useRef } from "react";
import { LandingNavbar, LandingPage, ChatBot } from "@/containers";
import { useRouter } from "next/router";

function LandingLayout({ children }) {
  const router = useRouter();
  const hasLogged = useRef(false);

  useEffect(() => {
    const authToken = localStorage.getItem("authToken");
    const userType = localStorage.getItem("userType");

    if (process.env.NODE_ENV === "development" && !hasLogged.current) {
      console.log("AuthToken", authToken);
      console.log("UserType", userType);
      hasLogged.current = true;
    }

    if (authToken) {
      switch (userType) {
        case "applicant":
          router.push("/applicant");
          break;
        case "student":
          router.push("/student");
          break;
        case "faculty":
          router.push("/faculty");
          break;
        case "admin":
          router.push("/admin");
          break;
        default:
          localStorage.clear();
          break;
      }
    }
  }, [router]);

  return (
    <Fragment>
      <LandingNavbar />
      <div className="homepage">
        <LandingPage />
        <div className="homepage-right">{children}</div>
      </div>
      <ChatBot />
    </Fragment>
  );
}

export default LandingLayout;
