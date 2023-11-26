/* eslint-disable react-hooks/exhaustive-deps */
import { Fragment, useEffect } from "react";
import { useRouter } from "next/router";
import { ApplicantNavbar, Footer } from "@/containers";
function ApplicantLayout({ children }) {
  const router = useRouter();
  useEffect(() => {
    const authToken = localStorage.getItem("authToken");
    const userType = localStorage.getItem("userType");
    console.log("AuthToken", authToken);
    console.log("UserType", userType);
    if (!authToken) {
      localStorage.clear();
      router.push("/");
    }
    if (userType !== "applicant") {
      router.push("/");
    }
  }, []);
  return (
    <Fragment>
      <ApplicantNavbar />
      {children}
      <Footer />
    </Fragment>
  );
}

export default ApplicantLayout;
