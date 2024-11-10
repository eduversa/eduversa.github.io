import { Fragment, useEffect, useState } from "react";
import { StudentLayout } from "@/layout";
import { StudentUpdateReqForm } from "@/components";
import { fetchSingleStudent } from "@/functions";
import { devLog } from "@/utils/apiUtils";

function StudentProfileUpdateReq() {

  const [userid, setUserid] = useState("");

  useEffect(() => {
    setUserid(localStorage.getItem("userid"));
  }, []);
  const [userData, setUserData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userType = localStorage.getItem("userType");

    if (userType === "student") {
      const applicantId = localStorage.getItem("userid");

      const fetchData = async () => {
        try {
          setLoading(true);
          const response = await fetchSingleStudent(applicantId);

          if (response.status === false) {
            alert(response.message);
            setLoading(false);
            return;
          }
          devLog('response', response);
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
      <StudentLayout>
        <StudentUpdateReqForm userid={userid} userData= {userData}/>
      </StudentLayout>
    </Fragment>
  );
}

export default StudentProfileUpdateReq;
