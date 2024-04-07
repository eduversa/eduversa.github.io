import { Fragment, useEffect, useState } from "react";
import { AdminLayout } from "@/layout";
import { FormLayout } from "@/containers";
import { ApplicantForm } from "@/components";

const UpdateApplicant = () => {
  // const [userid, setUserid] = useState("");

  const userid = localStorage.getItem("selected-applicantId");
  useEffect(() => {
    console.log("HI, Debargha", localStorage.getItem("selected-applicantId"));
    // console.log("Debargha", userid);
  }, []);

  return (
    <Fragment>
      <AdminLayout>
        <ApplicantForm userid={userid} />
      </AdminLayout>
    </Fragment>
  );
};

export default UpdateApplicant;
