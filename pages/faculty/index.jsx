import { Fragment, useEffect, useState } from "react";
import { FacultyLayout } from "@/layout";
import { AllLoader } from "@/components";
import { withLoading, devLog, apiRequest } from "@/utils/apiUtils";
import { useAlert } from "@/contexts/AlertContext";
function Faculty() {
  const [loading, setLoading] = useState(false);
  const { showAlert } = useAlert();
  return (
    <Fragment>
      {loading && <AllLoader />}
      <FacultyLayout>
        <h1>Faculty Dashboard</h1>
      </FacultyLayout>
    </Fragment>
  );
}

export default Faculty;
