import { Fragment, useEffect } from "react";
import { useRouter } from "next/router";
import { ApplicantNavbar, Footer, ChatBot } from "@/containers";
function ApplicantLayout({ children }) {
  const router = useRouter();
  useEffect(() => {
    const authToken = localStorage.getItem("authToken");
    const userType = localStorage.getItem("userType");
    if (process.env.NODE_ENV === "development") {
      console.log("AuthToken", authToken);
      console.log("UserType", userType);
    }
    if (!authToken) {
      localStorage.clear();
      router.push("/");
    }
    if (userType !== "applicant") {
      localStorage.clear();
      router.push("/");
    }
  }, [router]);
  return (
    <Fragment>
      <ApplicantNavbar />
      <div className="wrapper">{children}</div>
      <Footer />
      <ChatBot />
    </Fragment>
  );
}

export default ApplicantLayout;
