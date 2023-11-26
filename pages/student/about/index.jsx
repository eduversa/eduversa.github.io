import { Fragment } from "react";
import { StudentLayout } from "@/layout";
import { AboutUs } from "@/containers";
function StudentAboutUs() {
  return (
    <Fragment>
      <StudentLayout>
        <AboutUs></AboutUs>
      </StudentLayout>
    </Fragment>
  );
}

export default StudentAboutUs;
