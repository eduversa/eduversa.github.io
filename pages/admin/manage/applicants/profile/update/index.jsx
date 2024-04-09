import { Fragment, useEffect, useState } from "react";
import { AdminLayout } from "@/layout";
import { FormLayout } from "@/containers";
import { ApplicantForm } from "@/components";

const UpdateApplicant = () => {
  const userid = localStorage.getItem("selected-applicantId");
  useEffect(() => {
    console.log("HI, Debargha", localStorage.getItem("selected-applicantId"));
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
