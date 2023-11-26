/* eslint-disable react-hooks/exhaustive-deps */
import React, { Fragment, useEffect } from "react";
import { useRouter } from "next/router";
import { Footer } from "@/containers";
function StudentLayout({ children }) {
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
    if (userType !== "student") {
      router.push("/");
    }
  }, []);
  return (
    <Fragment>
      {children}
      <Footer></Footer>
    </Fragment>
  );
}

export default StudentLayout;
