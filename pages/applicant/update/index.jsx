import { Fragment } from "react";
import { ApplicantLayout } from "@/layout";
import { ApplicantForm } from "@/components";
import PersonalInfoForm from "@/containers/updateForm/PersonalInfo";
function UpdateApplicant() {
  return (
    <Fragment>
      <ApplicantLayout>
        <PersonalInfoForm></PersonalInfoForm>
        {/* <ApplicantForm /> */}
      </ApplicantLayout>
    </Fragment>
  );
}

export default UpdateApplicant;
