import { AdminLayout } from "@/layout";
import React, { Fragment, useEffect } from "react";
import { getCollegeDetailsApi, getApplicantsByYear } from "@/functions";

const ManageApplicants = () => {
  useEffect(() => {
    onLoadHandler();
  }, []);

  function onLoadHandler() {
    getCollegeDetailsApi(304);
    getApplicantsByYear(2023);
  }

  return (
    <Fragment>
      <AdminLayout></AdminLayout>
    </Fragment>
  );
};

export default ManageApplicants;
