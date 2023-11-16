import { Fragment } from "react";
import { ApplicantLayout } from "@/layout";
import { AboutUs } from "@/containers";
function ApplicantAboutUs() {
  return (
    <Fragment>
      <ApplicantLayout>
        <AboutUs></AboutUs>
      </ApplicantLayout>
    </Fragment>
  );
}

export default ApplicantAboutUs;
