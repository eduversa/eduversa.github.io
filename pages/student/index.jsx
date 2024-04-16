import { Fragment, useEffect, useState } from "react";
import { StudentLayout } from "@/layout";
import { fetchSingleStudent } from "@/functions";
import { AllLoader, IdCard } from "@/components";

// import IdCard from "@/components/IdCard";
function Index() {
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState(undefined);

  useEffect(() => {
    const userType = localStorage.getItem("userType");

    if (userType === "student") {
      const studentId = localStorage.getItem("userid");

      const fetchData = async () => {
        try {
          setLoading(true);
          const response = await fetchSingleStudent(studentId);

          if (!response || response.error) {
            console.error("Error fetching student data:", response?.error);
            setLoading(false);
            return;
          }
          localStorage.setItem(
            "eduversa_studentdata",
            JSON.stringify(response)
          );
          setProfileData(response);
          setLoading(false);
        } catch (error) {
          console.error("Error fetching student data:", error.message);
          setLoading(false);
        }
      };

      fetchData();
    }
  }, []);

  return (
    <Fragment>
      {loading && <AllLoader />}
      <StudentLayout>
        <section className="dashboard">
          <div className="dashboard__left dashboard__column"> </div>
          <div className="dashboard__right dashboard__column">
            {profileData && (
              <IdCard profile={profileData.data} page={"dashboard"} />
            )}
          </div>
        </section>
        {/* <div className="right-side"></div> */}
      </StudentLayout>
      {/* <div>{JSON.stringify(profileData)}</div> */}
    </Fragment>
  );
}

export default Index;

// const showBackSide = () => {
// 	const frontSide = document.getElementById("id-card__front");
// 	const backSide = document.getElementById("id-card__back");
// 	// console.log("back");
// 	frontSide.style.transform = "rotateY(-180deg)";
// 	frontSide.style.zIndex = "0";
// 	backSide.style.transform = "rotateY(-360deg)";
// 	backSide.style.zIndex = "1";
// };

// const showFrontSide = () => {
// 	const frontSide = document.getElementById("id-card__front");
// 	const backSide = document.getElementById("id-card__back");
// 	// console.log("front");
// 	frontSide.style.transform = "rotateY(0deg)";
// 	frontSide.style.zIndex = "1";
// 	backSide.style.transform = "rotateY(-180deg)";
// 	backSide.style.zIndex = "0";
// };
// const qrCode = document.getElementById("id-card__qr-code");
// const qrCodeBack = document.getElementById("id-card__qr-code--back");
// console.log(qrCode);
// console.log(qrCodeBack);
// qrCode.addEventListener("click", showBackSide);
// qrCodeBack.addEventListener("click", showFrontSide);
