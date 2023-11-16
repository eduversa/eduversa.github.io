/* eslint-disable react-hooks/exhaustive-deps */
import { Fragment, useEffect } from "react";
import { useRouter } from "next/router";
import { ApplicantNavbar } from "@/containers";
function ApplicantLayout({ children }) {
  const router = useRouter();
  useEffect(() => {
    const authToken = localStorage.getItem("authToken");
    const userType = localStorage.getItem("userType");
    console.log("AuthToken", authToken);
    console.log("UserType", userType);
    if (!authToken) {
      router.push("/");
      if (userType !== "applicant") {
        localStorage.removeItem("authToken");
      }
    }
  }, []);
  return (
    <Fragment>
      <ApplicantNavbar />
      {children}
    </Fragment>
  );
}

export default ApplicantLayout;
