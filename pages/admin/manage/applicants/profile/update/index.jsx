import { Fragment, useEffect, useState } from "react";
import { AdminLayout } from "@/layout";
import { ApplicantForm } from "@/components";
import { devLog } from "@/utils/apiUtils";
import { getSingleApplicantApi } from "@/functions";

const UpdateApplicant = () => {
  const userid =
    typeof window !== "undefined"
      ? localStorage.getItem("selected-applicantId")
      : null;

  const [userData, setUserData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const userType = localStorage.getItem("userType");
    
    if (userType === "admin" && userid) {
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
      <AdminLayout>
        <ApplicantForm userid={userid} userData={userData}/>
      </AdminLayout>
    </Fragment>
  );
};

export default UpdateApplicant;
