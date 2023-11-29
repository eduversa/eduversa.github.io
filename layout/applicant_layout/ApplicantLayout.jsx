import { Fragment, useEffect } from "react";
import { useRouter } from "next/router";
import { ApplicantNavbar, Footer } from "@/containers";
import { Analytics } from "@vercel/analytics/react";
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
      router.push("/");
    }
  }, [router]);
  return (
    <Fragment>
      <ApplicantNavbar />

      <div className="wrapper">{children}</div>
      {/* <Analytics /> */}

      <Footer />
    </Fragment>
  );
}

export default ApplicantLayout;
