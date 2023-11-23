import { AdminLayout } from "@/layout";
import React, { Fragment } from "react";
import { getCollegeDetailsApi } from "@/functions";
const manageApplicants = () => {
  return (
    <Fragment>
      <AdminLayout>
        <button onClick={getCollegeDetailsApi}> Get Dropdown Data</button>
      </AdminLayout>
    </Fragment>
  );
};

export default manageApplicants;
