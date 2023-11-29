import { Fragment, useEffect, useState } from "react";
import { ApplicantLayout } from "@/layout";
import { FormLayout } from "@/containers";
import { ApplicantForm } from "@/components";

function UpdateApplicant() {
  const [userid, setUserid] = useState("");

  useEffect(() => {
    setUserid(localStorage.getItem("userid"));
  }, []);
  
  return (
    <Fragment>
      <ApplicantLayout>
        <ApplicantForm 
          userid = {userid}
        />
      </ApplicantLayout>
    </Fragment>
  );
}

export default UpdateApplicant;
