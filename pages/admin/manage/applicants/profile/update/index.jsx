import { Fragment, useEffect } from "react";
import { AdminLayout } from "@/layout";
import { ApplicantForm } from "@/components";

const UpdateApplicant = () => {
  useEffect(() => {
    console.log("HI, Debargha", localStorage.getItem("selected-applicantId"));
  }, []);

  const userid =
    typeof window !== "undefined"
      ? localStorage.getItem("selected-applicantId")
      : null;

  return (
    <Fragment>
      <AdminLayout>
        <ApplicantForm userid={userid} />
      </AdminLayout>
    </Fragment>
  );
};

export default UpdateApplicant;
