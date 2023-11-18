import { Fragment } from "react";
import { LandingLayout } from "@/layout";
import { AboutUs } from "@/containers";
function About() {
  return (
    <Fragment>
      <LandingLayout>
        <AboutUs></AboutUs>
      </LandingLayout>
    </Fragment>
  );
}

export default About;
