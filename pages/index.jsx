import { Fragment } from "react";
import { LandingLayout } from "@/layout";
import LandingPage from "@/containers/landingPage/LadingPage";
function Login() {
  return (
    <Fragment>
      <LandingLayout>
        <div className="homepage">
          <LandingPage></LandingPage>
          <div className="homepage-right">
            <h1>Login</h1>
          </div>
        </div>
      </LandingLayout>
    </Fragment>
  );
}

export default Login;
