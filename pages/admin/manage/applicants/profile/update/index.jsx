import { Fragment, useEffect } from "react";
import { AdminLayout } from "@/layout";
import { ApplicantForm } from "@/components";
import { devLog } from "@/utils/apiUtils";

const UpdateApplicant = () => {
  useEffect(() => {
    devLog("HI, Debargha", localStorage.getItem("selected-applicantId"));
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
