import { Fragment } from "react";
import { StudentLayout } from "@/layout";
import { ContactUs } from "@/containers";
function StudentContactUs() {
  return (
    <Fragment>
      <StudentLayout>
        <ContactUs></ContactUs>
      </StudentLayout>
    </Fragment>
  );
}

export default StudentContactUs;
