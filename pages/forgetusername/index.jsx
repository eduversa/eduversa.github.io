import { Fragment, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import { LandingLayout } from "@/layout";
import { AllLoader } from "@/components";
import { generateOtpApi } from "@/functions";
function ForgetUsername() {
  const [loading, setLoading] = useState(false);
  return (
    <Fragment>
      <LandingLayout>
        {loading && <AllLoader />}
        <h1>Forget Username</h1>
      </LandingLayout>
    </Fragment>
  );
}

export default ForgetUsername;
