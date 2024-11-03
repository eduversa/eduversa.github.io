import { Fragment, useEffect, useState } from "react";
import { ApplicantLayout } from "@/layout";
import { FormLayout } from "@/containers";
import { StudentUpdateReqForm } from "@/components";
import { AllLoader } from "@/components";
import { getSingleApplicantApi } from "@/functions";

function StudentProfileUpdateReq() {
  const [userid, setUserid] = useState("");

  useEffect(() => {
    setUserid(localStorage.getItem("userid"));
  }, []);
  const [userData, setUserData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userType = localStorage.getItem("userType");

    if (userType === "applicant") {
      const applicantId = localStorage.getItem("userid");

      const fetchData = async () => {
        try {
          setLoading(true);
          const response = await getSingleApplicantApi(applicantId);

          if (response.status === false) {
            alert(response.message);
            setLoading(false);
            return;
          }
          setUserData(response.data);
          setLoading(false);
        } catch (error) {
          console.error("Error fetching student data:", error.message);
        }
      };

      fetchData();
    }
  }, []);

  return (
    <Fragment>
      {loading && <AllLoader />}
      <ApplicantLayout>
        {/* <h1>Student Profile Update Request</h1> */}
        {/* <ApplicantForm userid={userid} /> */}
        <StudentUpdateReqForm userid={userid} userData= {userData}/>

      </ApplicantLayout>
    </Fragment>
  );

}

export default StudentProfileUpdateReq;
