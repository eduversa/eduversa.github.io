import { Fragment, useEffect, useState } from "react";
import { AdminLayout } from "@/layout";
import { ApplicantForm } from "@/components";

function StudentProfileUpdate() {
  const [userid, setUserid] = useState("");
  const [userData, setUserData] = useState({});
  
  useEffect(() => {
    const studentId = JSON.parse(localStorage.getItem("userid"));
    setUserid(studentId);
    const data = JSON.parse(localStorage.getItem('student_profile'));
    setUserData(data);
  }, []); 

  return (
    <Fragment>
      <AdminLayout>
        <ApplicantForm userid={userid} userData={userData} selected_user_type="student"/>
      </AdminLayout>
    </Fragment>
  );
}

export default StudentProfileUpdate