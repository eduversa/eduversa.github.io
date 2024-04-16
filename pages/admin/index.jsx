import React, { Fragment, useState, useEffect } from "react";
import { AdminLayout } from "@/layout";
import { getApplicantsByYearApi } from "@/functions";
import { AllLoader } from "@/components";
import Link from "next/link";
const AdminDashboard = () => {
  const [loading, setLoading] = useState(false);
  const [applicants, setApplicants] = useState([]);
  const [notifications, setNotifications] = useState(0);
  const year = new Date().getFullYear();

  useEffect(() => {
    setLoading(true);
    getApplicantsByYearApi(year)
      .then((data) => {
        if (Array.isArray(data.data)) {
          setApplicants(data.data);
        } else {
          console.error("Applicants data is not an array:", data.data);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching applicants:", error);
        setLoading(false);
      });
  }, [year]);
  // function buttonClickHandler() {
  //   console.log("Button clicked");
  //   localStorage.clear();
  // }
  return (
    <Fragment>
      {loading && <AllLoader />}
      <AdminLayout>
        <div className="dashboard-container">
          <div className="dashboard-content">
            <h1 className="title">Admin Dashboard</h1>
            <div className="dashboard-feature">
              <div className="feature-box">
                <div className="box-header">Applicants</div>
                <Link href="/admin/manage/applicants" className="box-value">
                  <div className="box-value">{applicants.length}</div>
                </Link>
              </div>
              <div className="feature-box">
                <div className="box-header">Notifications</div>
                <div className="box-value">{notifications}</div>
              </div>
              {/* <button onClick={buttonClickHandler}>click me</button> */}
            </div>
          </div>
        </div>
      </AdminLayout>
    </Fragment>
  );
};

export default AdminDashboard;
