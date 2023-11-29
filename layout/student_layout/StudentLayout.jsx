import React, { Fragment, useEffect } from "react";
import { useRouter } from "next/router";
import { Footer } from "@/containers";
import { Analytics } from "@vercel/analytics/react";
function StudentLayout({ children }) {
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
    if (userType !== "student") {
      router.push("/");
    }
  }, [router]);
  return (
    <Fragment>
      <div className="wrapper">{children}</div>
      {/* <Analytics /> */}

      <Footer></Footer>
    </Fragment>
  );
}

export default StudentLayout;
