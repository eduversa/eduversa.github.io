import React, { Fragment, useState } from "react";
import { useRouter } from "next/router";
import { AllLoader } from "@/components";
import { logoutApi } from "@/functions";
function Navbar() {
  const router = useRouter();
  const logoText = "eduversa";
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  //@ Its Handling the logout functionality
  const handleLogout = async () => {
    const userId = localStorage.getItem("userid");
    const authToken = localStorage.getItem("authToken");

    try {
      setIsLoading(true);
      const apiResponse = await logoutApi(userId, authToken);
      if (apiResponse.status === false) {
        alert(apiResponse.message);
        setIsLoading(false);
        return;
      }
      if (process.env.NODE_ENV === "development") {
        console.log("Logout data:", apiResponse);
      }
      localStorage.removeItem("authToken");
      localStorage.removeItem("email");
      localStorage.removeItem("userType");
      localStorage.removeItem("userid");
      localStorage.clear();
      alert(apiResponse.message);
      setIsLoading(false);
      router.push("/");
    } catch (error) {
      if (process.env.NODE_ENV === "development") {
        console.error("Logout error:", error.message);
      }
    }
  };
  // @ Its tooggling the sidenavbar
  const toggleSideNavbar = () => {
    const navContainer = document.getElementById("navContainer");
    const width = navContainer.offsetWidth;
    if (width > 0) {
      navContainer.style.width = "0px";
    } else {
      navContainer.style.width = "100%";
    }
    setIsMenuOpen(!isMenuOpen);
  };
  return <Fragment></Fragment>;
}

export default Navbar;
