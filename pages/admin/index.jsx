import { AdminLayout } from "@/layout";
import React, { Fragment } from "react";

const AdminDashboard = () => {
  function logoutHandler() {
    localStorage.clear();
  }

  return (
    <Fragment>
      <AdminLayout>
        <h1>This is Admin Dashboard</h1>
        <button onClick={logoutHandler}>logout</button>{" "}
      </AdminLayout>
    </Fragment>
  );
};

export default AdminDashboard;
