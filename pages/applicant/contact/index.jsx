import { Fragment } from "react";
import { ApplicantLayout } from "@/layout";
import { ContactUs } from "@/containers";
function ApplicantContactUs() {
  return (
    <Fragment>
      <ApplicantLayout>
        <ContactUs></ContactUs>
      </ApplicantLayout>
    </Fragment>
  );
}

export default ApplicantContactUs;
