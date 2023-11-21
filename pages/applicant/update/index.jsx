import { Fragment } from "react";
import { ApplicantLayout } from "@/layout";
import { ApplicantForm } from "@/components";
function UpdateApplicant() {
  return (
    <Fragment>
      <ApplicantLayout>
        <ApplicantForm />
      </ApplicantLayout>
    </Fragment>
  );
}

export default UpdateApplicant;
