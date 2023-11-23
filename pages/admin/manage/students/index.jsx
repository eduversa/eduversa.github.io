import { AdminLayout } from "@/layout";
import React, { Fragment } from "react";
import { getCollegeDetailsApi } from "@/functions";
const manageStudents = () => {
  return (
    <Fragment>
      <AdminLayout>
        <button
          onClick={() => {
            getCollegeDetailsApi(304);
          }}
        >
          {" "}
          Get Dropdown Data
        </button>
      </AdminLayout>
    </Fragment>
  );
};

export default manageStudents;
