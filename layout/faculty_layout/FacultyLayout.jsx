import React, { Fragment, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { Footer, Navbar, ChatBot } from "@/containers";

function FacultyLayout({ children }) {
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

    if (!authToken) {
      localStorage.clear();
      router.push("/");
    } else if (userType !== "faculty") {
      localStorage.clear();
      router.push("/");
    }
  }, [router]);

  return (
    <Fragment>
      <Navbar />
      <div className="wrapper">{children}</div>
      <Footer />
      <ChatBot />
    </Fragment>
  );
}

export default FacultyLayout;
