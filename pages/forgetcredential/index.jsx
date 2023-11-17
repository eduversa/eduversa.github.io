import { Fragment } from "react";
import { LandingLayout } from "@/layout";
function ForgetCredential() {
  return (
    <Fragment>
      <LandingLayout>
        <div className="forget-container">
          <div className="forget-userid"></div>
          <div className="forget-password"></div>
        </div>
      </LandingLayout>
    </Fragment>
  );
}

export default ForgetCredential;
