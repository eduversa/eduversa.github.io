/* eslint-disable react-hooks/exhaustive-deps */
import React, { Fragment, useEffect } from "react";
import { useRouter } from "next/router";
import { AdminNavbar, Footer } from "@/containers";

function AdminLayout({ children }) {
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
    if (userType !== "admin") {
      router.push("/");
    }
  }, []);
  return (
    <Fragment>
      <AdminNavbar></AdminNavbar>
      {children}
      <Footer></Footer>
    </Fragment>
  );
}

export default AdminLayout;
