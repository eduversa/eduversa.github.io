import React, { Fragment, useEffect } from "react";
import { useRouter } from "next/router";
import { Navbar, Footer, ChatBot } from "@/containers";
function AdminLayout({ children }) {
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
    if (userType !== "admin") {
      localStorage.clear();
      router.push("/");
    }
  }, [router]);
  return (
    <Fragment>
      <Navbar></Navbar>
      <div className="wrapper">{children}</div>
      <Footer></Footer>
      <ChatBot></ChatBot>
    </Fragment>
  );
}

export default AdminLayout;
