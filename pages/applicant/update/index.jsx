import { Fragment, useEffect, useState } from "react";
import { ApplicantLayout } from "@/layout";
import { FormLayout } from "@/containers";
import { ApplicantForm } from "@/components";
import { AllLoader } from "@/components";
import { getSingleApplicantApi } from "@/functions";

function UpdateApplicant() {
  const [userid, setUserid] = useState("");
  const [userData, setUserData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setUserid(localStorage.getItem("userid"));

    const userType = localStorage.getItem("userType");
  
    if (userType === "applicant" && userid) {
      const fetchData = async () => {
        try {
          setLoading(true);
          const response = await getSingleApplicantApi(userid);  
          if (response.status === false) {
            alert(response.message);
            setLoading(false);
            return;
          }
          setUserData(response.data);
          localStorage.setItem("applicant_profile", JSON.stringify(response.data));
          setLoading(false);
        } catch (error) {
          console.error("Error fetching applicant data:", error.message);
        }
      };
      fetchData();
    }
  }, [userid]); 

  return (
    <Fragment>
      <ApplicantLayout>
        <ApplicantForm userid={userid} userData={userData}/>
      </ApplicantLayout>
    </Fragment>
  );
}

export default UpdateApplicant;
