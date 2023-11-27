import { Fragment } from "react";
import { AdminLayout } from "@/layout";
import { ApplicantForm } from "@/components";

const updateApplicants = () => {
  return (
    <Fragment>
      <AdminLayout>
        <ApplicantForm/>
      </AdminLayout>
    </Fragment>
  );
};

export default updateApplicants;
