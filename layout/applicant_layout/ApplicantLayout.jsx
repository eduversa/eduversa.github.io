/* eslint-disable react-hooks/exhaustive-deps */
import { Fragment, useEffect } from "react";
import { useRouter } from "next/router";
import { ApplicantNavbar } from "@/containers";
function ApplicantLayout() {
  const router = useRouter();
  useEffect(() => {
    const authToken = localStorage.getItem("authToken");
    const userType = localStorage.getItem("userType");
    console.log("AuthToken", authToken);
    console.log("UserType", userType);
    if (!authToken) {
      router.push("/");
    } else if (userType === "applicant") {
      router.push("/applicant");
    }
  }, []);
  return (
    <Fragment>
      <ApplicantNavbar />
    </Fragment>
  );
}

export default ApplicantLayout;
