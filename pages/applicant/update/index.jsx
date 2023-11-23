import { Fragment } from "react";
import { ApplicantLayout } from "@/layout";
import { FormLayout } from "@/containers";

function UpdateApplicant() {
  return (
    <Fragment>
      <ApplicantLayout>
        <FormLayout></FormLayout>
      </ApplicantLayout>
    </Fragment>
  );
}

export default UpdateApplicant;
