import { Fragment } from "react";
import { AdminLayout } from "@/layout";
import { ApplicantForm } from "@/components";

const updateApplicants = () => {
  return (
    <Fragment>
      <AdminLayout>
        <ApplicantForm
          userid="2023007640"
        />
      </AdminLayout>
    </Fragment>
  );
};

export default updateApplicants;
