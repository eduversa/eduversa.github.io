import { Fragment } from "react";
import { LandingLayout } from "@/layout";
import { ContactUs } from "@/containers";
function Contact() {
  return (
    <Fragment>
      <LandingLayout>
        <ContactUs />
      </LandingLayout>
    </Fragment>
  );
}

export default Contact;
