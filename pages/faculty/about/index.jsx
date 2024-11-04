import { Fragment } from "react";
import { FacultyLayout } from "@/layout";
import { AboutUs } from "@/containers";
function FacultyAboutUs() {
  return (
    <Fragment>
      <FacultyLayout>
        <AboutUs></AboutUs>
      </FacultyLayout>
    </Fragment>
  );
}

export default FacultyAboutUs;
